import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'
import { hashPassword } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/constants'

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = rateLimit(`reset-pw:${ip}`, RATE_LIMITS.auth.requests, RATE_LIMITS.auth.windowSeconds)
  if (!rl.ok) {
    return NextResponse.json({ messageAr: 'محاولات كثيرة. يُرجى المحاولة لاحقاً.' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })

  const { email, code, newPassword } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  })

  // Uniform response whether or not the email exists — prevents account enumeration.
  const invalidResponse = () =>
    NextResponse.json({ messageAr: 'الكود غير صحيح أو منتهي الصلاحية.' }, { status: 400 })

  if (!user) return invalidResponse()

  const valid = await verifyOtp(user.id, code, 'PASSWORD_RESET')
  if (!valid) return invalidResponse()

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      sessionVersion: { increment: 1 }, // invalidate all existing sessions
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  })

  return NextResponse.json({ success: true })
}
