import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMonthYear } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const monthYear = getMonthYear()

  const [userSub, usage, payments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { plan: true } } },
    }),
    prisma.usageRecord.findUnique({
      where: { userId_monthYear: { userId, monthYear } },
    }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, amountPiasters: true, type: true, status: true, createdAt: true },
    }),
  ])

  const plan = userSub?.subscription?.plan
  const used = usage?.consultationsUsed ?? 0
  const limit = plan?.consultationsPerMonth ?? 3
  const remaining = Math.max(0, limit - used)
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return NextResponse.json({
    plan: plan
      ? {
          slug: plan.slug,
          nameAr: plan.nameAr,
          pricePiasters: plan.pricePiasters,
          consultationsPerMonth: plan.consultationsPerMonth,
        }
      : { slug: 'free', nameAr: 'مجاني', pricePiasters: 0, consultationsPerMonth: 3 },
    status: userSub?.subscription?.status || 'ACTIVE',
    currentPeriodEnd: userSub?.subscription?.currentPeriodEnd?.toISOString() || null,
    used,
    remaining,
    pct,
    payments: payments.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
  })
}
