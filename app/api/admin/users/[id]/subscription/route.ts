import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { addMonths } from 'date-fns'

const schema = z.object({
  planId: z.string().min(1),
  status: z.enum(['ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING']).default('ACTIVE'),
  // months to set the current period end from now; omit to keep/extend by 1 month
  periodMonths: z.number().int().min(1).max(36).default(1),
  cancelAtPeriodEnd: z.boolean().default(false),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'بيانات غير صالحة.', errors: parsed.error.errors }, { status: 400 })
  }
  const { planId, status, periodMonths, cancelAtPeriodEnd } = parsed.data

  const [user, plan] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id: true } }),
    prisma.plan.findUnique({ where: { id: planId }, select: { id: true } }),
  ])
  if (!user) return NextResponse.json({ messageAr: 'المستخدم غير موجود.' }, { status: 404 })
  if (!plan) return NextResponse.json({ messageAr: 'الخطة غير موجودة.' }, { status: 404 })

  const now = new Date()
  const periodEnd = addMonths(now, periodMonths)

  const subscription = await prisma.subscription.upsert({
    where: { userId: id },
    create: {
      userId: id,
      planId,
      status,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd,
    },
    update: {
      planId,
      status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd,
    },
    include: { plan: true },
  })

  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: 'ADMIN_SUBSCRIPTION_UPDATE',
      details: { targetUserId: id, planId, status, periodMonths, cancelAtPeriodEnd },
    },
  })

  return NextResponse.json({ subscription })
}
