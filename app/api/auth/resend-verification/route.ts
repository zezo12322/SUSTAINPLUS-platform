import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOtp } from '@/lib/otp'
import { sendVerificationEmail } from '@/lib/email'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, nameAr: true, emailVerified: true },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.emailVerified) return NextResponse.json({ messageAr: 'البريد مُفعّل بالفعل.' }, { status: 400 })

  const code = await createOtp(session.user.id, 'EMAIL_VERIFY')
  await sendVerificationEmail(user.email, user.nameAr || user.email, code)

  return NextResponse.json({ success: true })
}
