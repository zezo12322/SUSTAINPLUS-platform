import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createSchema = z.object({
  sessionId: z.string().optional(),
  descriptionAr: z.string().min(10).max(5000),
  category: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cases = await prisma.expertCase.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({ cases })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })
    }

    const { sessionId, descriptionAr, category, priority } = parsed.data

    // Check for existing case on same session
    if (sessionId) {
      const existing = await prisma.expertCase.findUnique({ where: { sessionId } })
      if (existing) {
        return NextResponse.json({ caseId: existing.id, messageAr: 'تم تقديم الطلب مسبقاً.' })
      }
    }

    const expertCase = await prisma.expertCase.create({
      data: {
        userId: session.user.id,
        sessionId: sessionId || null,
        descriptionAr,
        category: category || 'general',
        priority,
        status: 'PENDING',
      },
    })

    // Notify admin (create notification)
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'EXPERT_CASE_CREATED',
        titleAr: 'طلب تصعيد لخبير',
        bodyAr: `تم إرسال طلبك لفريق الخبراء. سيتواصل معك أحد المتخصصين قريباً.`,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'EXPERT_CASE_CREATE',
        details: { caseId: expertCase.id, priority },
      },
    })

    return NextResponse.json({
      caseId: expertCase.id,
      messageAr: 'تم إرسال طلبك لفريق الخبراء بنجاح. سيتواصل معك متخصص قريباً.',
    }, { status: 201 })
  } catch (error) {
    console.error('Expert case error:', error)
    return NextResponse.json({ messageAr: 'حدث خطأ. يُرجى المحاولة لاحقاً.' }, { status: 500 })
  }
}
