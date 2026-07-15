import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  status: z
    .enum(['PENDING', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ANSWERED', 'RESOLVED', 'CONVERTED_TO_BOOKING', 'CLOSED'])
    .optional(),
  assignedExpert: z.string().optional(),
  assignedExpertId: z.string().optional(),
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
    // Normalize assignment: empty string => unassign; assigning bumps PENDING/IN_REVIEW to ASSIGNED.
    let newlyAssignedExpertId: string | null = null
    if (parsed.data.assignedExpertId !== undefined) {
      const newExpertId = parsed.data.assignedExpertId || null
      if (newExpertId) {
        // Only an active expert may be assigned — assignment grants case/PII access.
        const ex = await prisma.expert.findUnique({ where: { userId: newExpertId }, select: { isActive: true } })
        if (!ex || !ex.isActive) {
          return NextResponse.json({ error: 'Assignee is not an active expert' }, { status: 400 })
        }
      }
      data.assignedExpertId = newExpertId
      newlyAssignedExpertId = newExpertId
      if (newExpertId && !parsed.data.status) data.status = 'ASSIGNED'
    }

    const updated = await prisma.expertCase.update({
      where: { id },
      data,
    })

    // Notify the assigned expert that a case landed in their workspace
    if (newlyAssignedExpertId) {
      await prisma.notification.create({
        data: {
          userId: newlyAssignedExpertId,
          type: 'EXPERT_CASE_ASSIGNED',
          titleAr: 'حالة جديدة مُسندة إليك',
          bodyAr: 'تم إسناد حالة استشارة إليك. افتح مساحة الخبير لمراجعتها والرد على العميل.',
          metadata: { caseId: id },
        },
      })
    }

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
  const statusRaw = (formData.get('status') as string) || ''
  const assignedExpertId = ((formData.get('assignedExpertId') as string) || '').trim() || null
  const VALID_STATUSES = ['PENDING', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ANSWERED', 'RESOLVED', 'CONVERTED_TO_BOOKING', 'CLOSED']

  try {
    if (assignedExpertId) {
      const ex = await prisma.expert.findUnique({ where: { userId: assignedExpertId }, select: { isActive: true } })
      if (!ex || !ex.isActive) return NextResponse.redirect(new URL('/admin/expert-cases', req.url))
    }
    const safeStatus = statusRaw && VALID_STATUSES.includes(statusRaw) ? statusRaw : ''
    const finalStatus = safeStatus || (assignedExpertId ? 'ASSIGNED' : '')
    await prisma.expertCase.update({
      where: { id },
      data: {
        status: finalStatus ? (finalStatus as any) : undefined,
        assignedExpertId,
        resolvedAt: ['RESOLVED', 'CLOSED'].includes(statusRaw) ? new Date() : undefined,
      },
    })
    if (assignedExpertId) {
      await prisma.notification.create({
        data: {
          userId: assignedExpertId,
          type: 'EXPERT_CASE_ASSIGNED',
          titleAr: 'حالة جديدة مُسندة إليك',
          bodyAr: 'تم إسناد حالة استشارة إليك. افتح مساحة الخبير لمراجعتها.',
          metadata: { caseId: id },
        },
      })
    }
    return NextResponse.redirect(new URL('/admin/expert-cases', req.url))
  } catch {
    return NextResponse.redirect(new URL('/admin/expert-cases', req.url))
  }
}
