import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

const schema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'حالة غير صالحة.' }, { status: 400 })
  }

  const payment = await prisma.payment.findUnique({ where: { id }, select: { id: true, status: true } })
  if (!payment) return NextResponse.json({ messageAr: 'الدفعة غير موجودة.' }, { status: 404 })

  const updated = await prisma.payment.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  })

  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: 'ADMIN_PAYMENT_STATUS',
      details: { paymentId: id, from: payment.status, to: parsed.data.status },
    },
  })

  return NextResponse.json({ payment: updated })
}
