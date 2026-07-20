import { NextResponse } from 'next/server'
import { getAuthedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOtp } from '@/lib/otp'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/constants'

export async function POST() {
  const authed = await getAuthedUser()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Throttle verification-email resends per user to prevent email-send abuse.
  const rl = rateLimit(`resend-verify:${authed.userId}`, RATE_LIMITS.auth.requests, RATE_LIMITS.auth.windowSeconds)
  if (!rl.ok) {
    return NextResponse.json({ messageAr: 'محاولات كثيرة. يُرجى المحاولة لاحقاً.' }, { status: 429 })
  }

  const user = await prisma.user.findUnique({
    where: { id: authed.userId },
    select: { email: true, nameAr: true, emailVerified: true },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.emailVerified) return NextResponse.json({ messageAr: 'البريد مُفعّل بالفعل.' }, { status: 400 })

  const code = await createOtp(authed.userId, 'EMAIL_VERIFY')
  await sendVerificationEmail(user.email, user.nameAr || user.email, code)

  return NextResponse.json({ success: true })
}
