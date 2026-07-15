import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from '@/auth.config'
import { createOtp } from '@/lib/otp'
import { sendLoginNotificationEmail, sendTwoFactorEmail } from '@/lib/email'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otpCode: { label: 'OTP Code', type: 'text' },
        ipAddress: { label: 'IP', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const otpCode = credentials?.otpCode as string | undefined
        const ipAddress = (credentials?.ipAddress as string) || 'unknown'

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true, email: true, nameAr: true, nameEn: true,
            passwordHash: true, role: true, isActive: true,
            emailVerified: true, sessionVersion: true,
            failedLoginAttempts: true, lockedUntil: true,
            twoFactorEnabled: true,
          },
        })

        if (!user || !user.isActive) return null

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
          throw new Error(`LOCKED:${minutesLeft}`)
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          const attempts = user.failedLoginAttempts + 1
          const shouldLock = attempts >= MAX_FAILED_ATTEMPTS
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: attempts,
              lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60000) : undefined,
            },
          })
          if (shouldLock) throw new Error(`LOCKED:${LOCKOUT_MINUTES}`)
          return null
        }

        // Handle 2FA
        if (user.twoFactorEnabled) {
          if (!otpCode) {
            // First step: send OTP and signal 2FA required
            const code = await createOtp(user.id, 'TWO_FACTOR')
            await sendTwoFactorEmail(user.email, user.nameAr || user.email, code)
            throw new Error('NEEDS_2FA')
          }

          // Second step: verify OTP
          const { verifyOtp } = await import('@/lib/otp')
          const valid = await verifyOtp(user.id, otpCode, 'TWO_FACTOR')
          if (!valid) throw new Error('INVALID_OTP')
        }

        // Successful login — reset lockout, increment sessionVersion
        const newVersion = user.sessionVersion + 1
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            failedLoginAttempts: 0,
            lockedUntil: null,
            sessionVersion: newVersion,
          },
        })

        // Send login notification (non-blocking)
        sendLoginNotificationEmail(
          user.email,
          user.nameAr || user.email,
          ipAddress,
          new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })
        ).catch(console.error)

        return {
          id: user.id,
          email: user.email,
          name: user.nameAr || user.nameEn || user.email,
          role: user.role,
          sessionVersion: newVersion,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role
        token.sessionVersion = (user as any).sessionVersion
        token.emailVerified = (user as any).emailVerified
      }
      if (trigger === 'update' && session?.emailVerified !== undefined) {
        token.emailVerified = session.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).role = token.role
        ;(session.user as any).sessionVersion = token.sessionVersion
        ;(session.user as any).emailVerified = token.emailVerified
      }
      return session
    },
  },
})

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: { include: { plan: true } },
    },
  })

  // Enforce live account state against the JWT: a deactivated account or one
  // whose sessionVersion was bumped (role change / password reset / admin action)
  // is treated as logged out on the next server render.
  if (!user || !user.isActive) return null
  const tokenVersion = (session.user as any).sessionVersion
  if (typeof tokenVersion === 'number' && tokenVersion !== user.sessionVersion) return null

  return user
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('UNAUTHORIZED')

  // Validate live account state (active + current session version).
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true, sessionVersion: true },
  })
  const tokenVersion = (session.user as any).sessionVersion
  if (!user || !user.isActive) throw new Error('UNAUTHORIZED')
  if (typeof tokenVersion === 'number' && tokenVersion !== user.sessionVersion) throw new Error('UNAUTHORIZED')

  return session
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('FORBIDDEN')

  // Re-check role + active flag against the DB so demotions take effect immediately.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isActive: true },
  })
  if (!user || !user.isActive || user.role !== 'ADMIN') throw new Error('FORBIDDEN')
  return session
}
