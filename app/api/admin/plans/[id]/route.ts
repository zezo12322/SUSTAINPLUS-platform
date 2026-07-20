import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

const updateSchema = z.object({
  nameAr: z.string().min(2).max(100).optional(),
  nameEn: z.string().min(2).max(100).optional(),
  // -1 is the PAYG sentinel (billed per use); anything below is invalid.
  pricePiasters: z.number().int().min(-1).optional(),
  consultationsPerMonth: z.number().int().min(-1).optional(),
  maxUsers: z.number().int().min(1).optional(),
  featuresAr: z.array(z.string()).optional(),
  featuresEn: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'بيانات غير صالحة.', errors: parsed.error.errors }, { status: 400 })
  }

  const plan = await prisma.plan.findUnique({ where: { id }, select: { id: true } })
  if (!plan) return NextResponse.json({ messageAr: 'الخطة غير موجودة.' }, { status: 404 })

  const updated = await prisma.plan.update({ where: { id }, data: parsed.data })
  await prisma.auditLog.create({
    data: { userId: admin.adminId, action: 'ADMIN_PLAN_UPDATE', details: { planId: id, changes: parsed.data } },
  })
  return NextResponse.json({ plan: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const plan = await prisma.plan.findUnique({
    where: { id },
    select: { id: true, slug: true, _count: { select: { subscriptions: true } } },
  })
  if (!plan) return NextResponse.json({ messageAr: 'الخطة غير موجودة.' }, { status: 404 })

  // Don't delete a plan that still has subscribers or the free plan — deactivate instead.
  if (plan._count.subscriptions > 0) {
    return NextResponse.json(
      { messageAr: 'لا يمكن حذف خطة عليها مشتركون. عطّلها بدلاً من الحذف.' },
      { status: 409 }
    )
  }
  if (plan.slug === 'free') {
    return NextResponse.json({ messageAr: 'لا يمكن حذف الخطة المجانية الافتراضية.' }, { status: 409 })
  }

  await prisma.plan.delete({ where: { id } })
  await prisma.auditLog.create({
    data: { userId: admin.adminId, action: 'ADMIN_PLAN_DELETE', details: { planId: id, slug: plan.slug } },
  })
  return NextResponse.json({ success: true })
}
