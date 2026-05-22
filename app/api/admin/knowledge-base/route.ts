import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) return null
  if ((session.user as any).role !== 'ADMIN') return null
  return session
}

const entrySchema = z.object({
  titleAr: z.string().min(2).max(300),
  titleEn: z.string().max(300).optional(),
  contentAr: z.string().min(10),
  contentEn: z.string().optional(),
  category: z.enum([
    'COMPLIANCE', 'WASTE', 'EMISSIONS', 'WATER', 'EIA',
    'INDUSTRIAL_REQUIREMENTS', 'SUSTAINABILITY_REPORTING',
    'EGYPTIAN_REGULATIONS', 'FAQS', 'SUSTAIN_PLUS_GUIDANCE',
  ]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  reviewer: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sourceNotes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')
  const status = searchParams.get('status')
  const category = searchParams.get('category')

  const where: Record<string, any> = {}
  if (status) where.status = status
  if (category) where.category = category
  if (q) {
    where.OR = [
      { titleAr: { contains: q, mode: 'insensitive' } },
      { contentAr: { contains: q, mode: 'insensitive' } },
    ]
  }

  const entries = await prisma.knowledgeEntry.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: 200,
  })

  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = entrySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ messageAr: 'بيانات غير صالحة.', errors: parsed.error.errors }, { status: 400 })
    }

    const entry = await prisma.knowledgeEntry.create({
      data: {
        ...parsed.data,
        createdBy: session.user!.id!,
        reviewedAt: parsed.data.reviewer ? new Date() : null,
      },
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('KB create error:', error)
    return NextResponse.json({ messageAr: 'حدث خطأ.' }, { status: 500 })
  }
}
