import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'

const schema = z.object({ code: z.string().length(6) })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ messageAr: 'كود غير صالح.' }, { status: 400 })

  const valid = await verifyOtp(session.user.id, parsed.data.code, 'EMAIL_VERIFY')
  if (!valid) return NextResponse.json({ messageAr: 'الكود غير صحيح أو منتهي الصلاحية.' }, { status: 400 })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { emailVerified: true },
  })

  return NextResponse.json({ success: true })
}
