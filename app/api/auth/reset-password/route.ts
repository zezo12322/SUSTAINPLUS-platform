import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'
import { hashPassword } from '@/lib/auth'

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(8),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })

  const { email, code, newPassword } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  })

  if (!user) return NextResponse.json({ messageAr: 'البريد الإلكتروني غير مسجّل.' }, { status: 404 })

  const valid = await verifyOtp(user.id, code, 'PASSWORD_RESET')
  if (!valid) return NextResponse.json({ messageAr: 'الكود غير صحيح أو منتهي الصلاحية.' }, { status: 400 })

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
