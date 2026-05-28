import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createOtp } from '@/lib/otp'
import { sendPasswordResetEmail } from '@/lib/email'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ messageAr: 'بريد إلكتروني غير صالح.' }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: { id: true, email: true, nameAr: true, isActive: true },
  })

  // Always return success to prevent email enumeration
  if (!user || !user.isActive) return NextResponse.json({ success: true })

  const code = await createOtp(user.id, 'PASSWORD_RESET')
  await sendPasswordResetEmail(user.email, user.nameAr || user.email, code)

  return NextResponse.json({ success: true })
}
