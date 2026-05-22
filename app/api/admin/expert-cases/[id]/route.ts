import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  assignedExpert: z.string().optional(),
  adminNotes: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

    const data: Record<string, any> = { ...parsed.data }
    if (parsed.data.status === 'RESOLVED' || parsed.data.status === 'CLOSED') {
      data.resolvedAt = new Date()
    }

    const updated = await prisma.expertCase.update({
      where: { id },
      data,
    })

    // Notify user of status change
    if (parsed.data.status) {
      const statusLabels: Record<string, string> = {
        IN_REVIEW: 'طلبك الآن قيد المراجعة من فريق الخبراء.',
        ASSIGNED: 'تم تخصيص خبير لطلبك وسيتواصل معك قريباً.',
        IN_PROGRESS: 'يعمل الخبير حالياً على طلبك.',
        RESOLVED: 'تم حل طلبك. يُرجى مراجعة ملاحظات الخبير.',
        CLOSED: 'تم إغلاق طلبك.',
      }
      const msg = statusLabels[parsed.data.status]
      if (msg) {
        await prisma.notification.create({
          data: {
            userId: updated.userId,
            type: 'EXPERT_CASE_UPDATE',
            titleAr: 'تحديث طلب الخبير',
            bodyAr: msg,
          },
        })
      }
    }

    return NextResponse.json({ case: updated })
  } catch {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }
}

// Handle form method override POST + _method=PUT
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const formData = await req.formData()
  const status = formData.get('status') as string
  const assignedExpert = formData.get('assignedExpert') as string

  try {
    await prisma.expertCase.update({
      where: { id },
      data: {
        status: status as any,
        assignedExpert: assignedExpert || null,
        resolvedAt: ['RESOLVED', 'CLOSED'].includes(status) ? new Date() : undefined,
      },
    })
    return NextResponse.redirect(new URL('/admin/expert-cases', req.url))
  } catch {
    return NextResponse.redirect(new URL('/admin/expert-cases', req.url))
  }
}
