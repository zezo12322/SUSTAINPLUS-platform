import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'

const planSchema = z.object({
  slug: z.string().min(2).max(40).regex(/^[a-z0-9-]+$/, 'حروف صغيرة وأرقام وشرطات فقط'),
  nameAr: z.string().min(2).max(100),
  nameEn: z.string().min(2).max(100),
  pricePiasters: z.number().int(),
  consultationsPerMonth: z.number().int(),
  maxUsers: z.number().int().min(1).default(1),
  featuresAr: z.array(z.string()).default([]),
  featuresEn: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { subscriptions: true } } },
  })
  return NextResponse.json({ plans })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = planSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'بيانات غير صالحة.', errors: parsed.error.errors }, { status: 400 })
  }

  const clash = await prisma.plan.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } })
  if (clash) return NextResponse.json({ messageAr: 'المعرّف (slug) مستخدم بالفعل.' }, { status: 409 })

  const plan = await prisma.plan.create({ data: parsed.data })
  await prisma.auditLog.create({
    data: { userId: admin.adminId, action: 'ADMIN_PLAN_CREATE', details: { planId: plan.id, slug: plan.slug } },
  })
  return NextResponse.json({ plan }, { status: 201 })
}
