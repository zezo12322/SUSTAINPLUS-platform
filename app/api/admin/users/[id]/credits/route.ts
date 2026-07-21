import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

// Manual prepaid-credit top-up / adjustment by an admin (used while online
// payment is disabled). Positive delta adds credits, negative deducts.
const schema = z.object({
  delta: z.number().int().min(-1000).max(1000).refine((n) => n !== 0, 'القيمة لا يمكن أن تكون صفراً'),
  reason: z.string().max(200).optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'قيمة غير صالحة.' }, { status: 400 })
  }
  const { delta, reason } = parsed.data

  const user = await prisma.user.findUnique({ where: { id }, select: { paygCredits: true } })
  if (!user) return NextResponse.json({ messageAr: 'المستخدم غير موجود.' }, { status: 404 })

  // Clamp so a deduction can't drive the balance below zero.
  const newBalance = Math.max(0, user.paygCredits + delta)
  const applied = newBalance - user.paygCredits

  await prisma.user.update({ where: { id }, data: { paygCredits: newBalance } })

  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: 'ADMIN_CREDIT_ADJUST',
      details: { targetUserId: id, requestedDelta: delta, appliedDelta: applied, from: user.paygCredits, to: newBalance, reason: reason || null },
    },
  })

  return NextResponse.json({ paygCredits: newBalance, applied })
}
