import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') return null
  return session
}

const updateSchema = z.object({
  titleAr: z.string().min(2).max(300).optional(),
  titleEn: z.string().max(300).optional(),
  contentAr: z.string().min(10).optional(),
  contentEn: z.string().optional(),
  category: z.enum([
    'COMPLIANCE', 'WASTE', 'EMISSIONS', 'WATER', 'EIA',
    'INDUSTRIAL_REQUIREMENTS', 'SUSTAINABILITY_REPORTING',
    'EGYPTIAN_REGULATIONS', 'FAQS', 'SUSTAIN_PLUS_GUIDANCE',
  ]).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  reviewer: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sourceNotes: z.string().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  try {
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })
    }

    const data: Record<string, any> = { ...parsed.data }
    if (data.reviewer) data.reviewedAt = new Date()

    const entry = await prisma.knowledgeEntry.update({
      where: { id },
      data,
    })

    return NextResponse.json({ entry })
  } catch {
    return NextResponse.json({ messageAr: 'لم يُعثر على الإدخال.' }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  try {
    await prisma.knowledgeEntry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ messageAr: 'لم يُعثر على الإدخال.' }, { status: 404 })
  }
}
