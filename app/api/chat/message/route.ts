import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateAIResponse } from '@/lib/ai'
import { getMonthYear, generateSessionTitle } from '@/lib/utils'

const schema = z.object({
  sessionId: z.string().nullable(),
  message: z.string().min(1).max(4000),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).max(40),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ messageAr: 'غير مصرح.' }, { status: 401 })
  }

  const userId = session.user.id
  const monthYear = getMonthYear()

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })
    }

    const { sessionId, message, history } = parsed.data

    // Get user subscription and usage
    const [userSub, usageRecord] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: { include: { plan: true } } },
      }),
      prisma.usageRecord.findUnique({
        where: { userId_monthYear: { userId, monthYear } },
      }),
    ])

    const plan = userSub?.subscription?.plan
    const used = usageRecord?.consultationsUsed ?? 0
    const limit = plan?.consultationsPerMonth ?? 3
    const paygCredits = usageRecord?.paygCredits ?? 0

    // Check limits
    if (plan?.slug === 'payg') {
      if (paygCredits <= 0) {
        return NextResponse.json(
          { messageAr: 'رصيدك الحالي صفر. يُرجى شحن رصيد لمتابعة الاستشارات.' },
          { status: 402 }
        )
      }
    } else if (used >= limit) {
      return NextResponse.json(
        { messageAr: 'لقد استنفدت استشاراتك الشهرية. يُرجى ترقية باقتك أو شراء استشارات إضافية.' },
        { status: 402 }
      )
    }

    // Generate AI response
    const aiResult = await generateAIResponse(message, history)

    // Persist in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or verify session
      let chatSessionId = sessionId
      if (!chatSessionId) {
        const newSession = await tx.chatSession.create({
          data: {
            userId,
            titleAr: generateSessionTitle(message),
          },
        })
        chatSessionId = newSession.id
      }

      // Save user message
      await tx.message.create({
        data: {
          sessionId: chatSessionId,
          role: 'USER',
          content: message,
        },
      })

      // Save AI response
      const aiMessage = await tx.message.create({
        data: {
          sessionId: chatSessionId,
          role: 'ASSISTANT',
          content: aiResult.content,
          modelUsed: aiResult.modelUsed,
          isComplex: aiResult.isComplex,
          inputTokens: aiResult.inputTokens,
          outputTokens: aiResult.outputTokens,
        },
      })

      // Update session timestamp
      await tx.chatSession.update({
        where: { id: chatSessionId },
        data: { updatedAt: new Date() },
      })

      // Update usage
      if (plan?.slug === 'payg') {
        await tx.usageRecord.upsert({
          where: { userId_monthYear: { userId, monthYear } },
          create: { userId, monthYear, paygCredits: -1, consultationsUsed: 1 },
          update: { paygCredits: { decrement: 1 }, consultationsUsed: { increment: 1 } },
        })
      } else {
        await tx.usageRecord.upsert({
          where: { userId_monthYear: { userId, monthYear } },
          create: { userId, monthYear, consultationsUsed: 1 },
          update: { consultationsUsed: { increment: 1 } },
        })
      }

      return { chatSessionId, aiMessage }
    })

    return NextResponse.json({
      sessionId: result.chatSessionId,
      messageId: result.aiMessage.id,
      content: aiResult.content,
      isComplex: aiResult.isComplex,
      needsEscalation: aiResult.needsEscalation,
      isFallback: aiResult.isFallback,
    })
  } catch (error) {
    console.error('Chat message error:', error)
    return NextResponse.json(
      { messageAr: 'حدث خطأ في معالجة طلبك. يُرجى المحاولة مجدداً.' },
      { status: 500 }
    )
  }
}
