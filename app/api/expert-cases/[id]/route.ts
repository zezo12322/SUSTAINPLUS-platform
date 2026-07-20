import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Status transitions an assigned expert (or admin) may perform on their case.
const patchSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'ANSWERED', 'CONVERTED_TO_BOOKING', 'RESOLVED']),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await getAuthedUser()
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const c = await prisma.expertCase.findUnique({
    where: { id },
    select: { userId: true, assignedExpertId: true },
  })
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (authed.role !== 'ADMIN' && c.assignedExpertId !== authed.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })

  const { status } = parsed.data
  const data: Record<string, any> = { status }
  if (status === 'RESOLVED') data.resolvedAt = new Date()

  await prisma.expertCase.update({ where: { id }, data })

  const labels: Record<string, string> = {
    IN_PROGRESS: 'بدأ الخبير العمل على طلبك.',
    ANSWERED: 'أجاب الخبير على طلبك. يُرجى مراجعة المحادثة.',
    CONVERTED_TO_BOOKING: 'حوّل الخبير طلبك إلى حجز جلسة. سنوافيك بالتفاصيل قريباً.',
    RESOLVED: 'تم حل طلبك.',
  }
  await prisma.notification.create({
    data: {
      userId: c.userId,
      type: 'EXPERT_CASE_UPDATE',
      titleAr: 'تحديث طلب الخبير',
      bodyAr: labels[status],
      metadata: { caseId: id },
    },
  })

  return NextResponse.json({ ok: true, status })
}
