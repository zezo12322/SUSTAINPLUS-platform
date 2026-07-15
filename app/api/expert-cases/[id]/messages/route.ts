import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createSchema = z.object({ body: z.string().min(1).max(5000) })

type AuthzCase = { id: string; userId: string; assignedExpertId: string | null; status: string }

async function loadAuthorizedCase(
  id: string,
  userId: string,
  role: string,
): Promise<{ error: 'not_found' | 'forbidden' } | { case: AuthzCase; isOwner: boolean; isExpert: boolean }> {
  const c = await prisma.expertCase.findUnique({
    where: { id },
    select: { id: true, userId: true, assignedExpertId: true, status: true },
  })
  if (!c) return { error: 'not_found' }
  const isOwner = c.userId === userId
  const isExpert = c.assignedExpertId === userId
  if (!isOwner && !isExpert && role !== 'ADMIN') return { error: 'forbidden' }
  return { case: c, isOwner, isExpert }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const res = await loadAuthorizedCase(id, session.user.id, (session.user as any).role)
  if ('error' in res) {
    return NextResponse.json({ error: res.error }, { status: res.error === 'not_found' ? 404 : 403 })
  }

  const messages = await prisma.escalationMessage.findMany({
    where: { expertCaseId: id },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const res = await loadAuthorizedCase(id, session.user.id, (session.user as any).role)
  if ('error' in res) {
    return NextResponse.json({ error: res.error }, { status: res.error === 'not_found' ? 404 : 403 })
  }

  try {
    const parsed = createSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ messageAr: 'الرسالة غير صالحة.' }, { status: 400 })

    const senderRole = res.isOwner ? 'USER' : 'EXPERT'
    const message = await prisma.escalationMessage.create({
      data: { expertCaseId: id, senderRole, senderId: session.user.id, body: parsed.data.body },
    })

    const theCase = res.case
    if (senderRole === 'EXPERT') {
      await prisma.notification.create({
        data: {
          userId: theCase.userId,
          type: 'EXPERT_CASE_REPLY',
          titleAr: 'رد جديد من الخبير',
          bodyAr: 'ردّ الخبير على طلبك. افتح طلبك لعرض الرسالة.',
          metadata: { caseId: id },
        },
      })
      // First expert reply nudges an assigned case into active work.
      if (theCase.status === 'ASSIGNED') {
        await prisma.expertCase.update({ where: { id }, data: { status: 'IN_PROGRESS' } })
      }
    } else if (theCase.assignedExpertId) {
      await prisma.notification.create({
        data: {
          userId: theCase.assignedExpertId,
          type: 'EXPERT_CASE_REPLY',
          titleAr: 'رسالة جديدة من العميل',
          bodyAr: 'أرسل العميل رسالة على حالة مُسندة إليك.',
          metadata: { caseId: id },
        },
      })
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (e) {
    console.error('escalation message error:', e)
    return NextResponse.json({ messageAr: 'حدث خطأ. يُرجى المحاولة لاحقاً.' }, { status: 500 })
  }
}
