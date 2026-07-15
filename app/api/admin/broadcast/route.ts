import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

const schema = z.object({
  titleAr: z.string().min(2).max(200),
  bodyAr: z.string().min(2).max(2000),
  target: z.enum(['ALL', 'USER', 'EXPERT', 'ADMIN']).default('ALL'),
})

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'بيانات غير صالحة.', errors: parsed.error.errors }, { status: 400 })
  }
  const { titleAr, bodyAr, target } = parsed.data

  const where = { isActive: true, ...(target === 'ALL' ? {} : { role: target }) }
  const users = await prisma.user.findMany({ where, select: { id: true } })
  if (users.length === 0) {
    return NextResponse.json({ messageAr: 'لا يوجد مستخدمون مطابقون.' }, { status: 400 })
  }

  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id,
      type: 'ADMIN_BROADCAST',
      titleAr,
      bodyAr,
      metadata: { broadcast: true },
    })),
  })

  await prisma.auditLog.create({
    data: { userId: admin.adminId, action: 'ADMIN_BROADCAST', details: { target, count: users.length, titleAr } },
  })

  return NextResponse.json({ success: true, sent: users.length })
}
