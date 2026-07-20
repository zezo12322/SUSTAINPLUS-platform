import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateAIResponse, classifyEscalation } from '@/lib/ai'
import { getMonthYear, generateSessionTitle } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'
import { RATE_LIMITS } from '@/lib/constants'

const schema = z.object({
  sessionId: z.string().nullable(),
  message: z.string().min(1).max(4000),
  // `history` is accepted for backward compatibility but NOT trusted: the server
  // rebuilds conversation context from the DB so a client cannot inject fake
  // turns or oversized payloads.
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(40)
    .optional(),
})

const FREE_LIMIT = 3
const HISTORY_LIMIT = 20

export async function POST(req: NextRequest) {
  const authed = await getAuthedUser()
  if (!authed) {
    return NextResponse.json({ messageAr: 'غير مصرح.' }, { status: 401 })
  }
  const userId = authed.userId
  const monthYear = getMonthYear()

  // Per-user rate limit (in addition to the monthly consultation quota).
  const rl = rateLimit(`chat:${userId}`, RATE_LIMITS.chat.requests, RATE_LIMITS.chat.windowSeconds)
  if (!rl.ok) {
    return NextResponse.json(
      { messageAr: 'عدد كبير من الطلبات في وقت قصير. يُرجى الانتظار قليلاً ثم المحاولة مجدداً.' },
      { status: 429 }
    )
  }

  // Declared outside the try so a failure after reservation can refund it.
  let reserved: 'payg' | 'monthly' | null = null

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })
    }

    const { sessionId, message } = parsed.data

    // If a session was supplied, it must belong to the caller.
    if (sessionId) {
      const owned = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
        select: { id: true },
      })
      if (!owned) {
        return NextResponse.json({ messageAr: 'الجلسة غير موجودة.' }, { status: 404 })
      }
    }

    // Effective plan honours subscription status + expiry: an expired, cancelled
    // or past-due subscription falls back to the free tier — it does NOT keep
    // granting paid limits forever.
    const userSub = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { plan: true } } },
    })
    const sub = userSub?.subscription
    const subActive = !!sub && sub.status === 'ACTIVE' && sub.currentPeriodEnd > new Date()
    const plan = subActive ? sub!.plan : null
    // PAYG plans carry the -1 sentinel; treat any non-positive value as "no
    // monthly allotment" so the user relies purely on prepaid credits.
    const monthlyLimit = plan && plan.consultationsPerMonth > 0 ? plan.consultationsPerMonth : (plan ? 0 : FREE_LIMIT)

    // Ensure the month's usage row exists so both counters update atomically.
    await prisma.usageRecord.upsert({
      where: { userId_monthYear: { userId, monthYear } },
      create: { userId, monthYear, consultationsUsed: 0 },
      update: {},
    })

    // --- Atomically reserve one consultation BEFORE the (slow) AI call. ---
    // Consumption order: monthly plan quota first, then prepaid PAYG credits.
    // The conditional updateMany closes the check-then-increment race, and the
    // credit fallback makes purchased packs spendable on top of ANY plan
    // (the billing UI advertises packs as "added to your current plan").
    if (monthlyLimit > 0) {
      const r = await prisma.usageRecord.updateMany({
        where: { userId, monthYear, consultationsUsed: { lt: monthlyLimit } },
        data: { consultationsUsed: { increment: 1 } },
      })
      if (r.count > 0) reserved = 'monthly'
    }
    if (!reserved) {
      // Account-level prepaid credits (do not expire monthly).
      const r = await prisma.user.updateMany({
        where: { id: userId, paygCredits: { gt: 0 } },
        data: { paygCredits: { decrement: 1 } },
      })
      if (r.count > 0) reserved = 'payg'
    }
    if (!reserved) {
      const messageAr =
        monthlyLimit > 0
          ? 'لقد استنفدت استشاراتك الشهرية. يُرجى ترقية باقتك أو شحن رصيد استشارات إضافية.'
          : 'رصيدك الحالي صفر. يُرجى شحن رصيد لمتابعة الاستشارات.'
      return NextResponse.json({ messageAr }, { status: 402 })
    }

    // Rebuild conversation history from the DB (never trust the client's copy).
    let history: { role: 'user' | 'assistant'; content: string }[] = []
    if (sessionId) {
      const past = await prisma.message.findMany({
        where: { sessionId, role: { in: ['USER', 'ASSISTANT'] } },
        orderBy: { createdAt: 'desc' },
        take: HISTORY_LIMIT,
        select: { role: true, content: true },
      })
      history = past
        .reverse()
        .map((m) => ({ role: m.role === 'USER' ? 'user' : 'assistant', content: m.content }))
    }

    // Generate AI response (never throws — signals failure via isFallback).
    const aiResult = await generateAIResponse(message, history)

    // Do not charge a consultation for a failed generation — refund the reservation.
    if (aiResult.isFallback) {
      if (reserved === 'payg') {
        await prisma.user.update({ where: { id: userId }, data: { paygCredits: { increment: 1 } } })
      } else {
        await prisma.usageRecord.updateMany({
          where: { userId, monthYear },
          data: { consultationsUsed: { decrement: 1 } },
        })
      }
      reserved = null // already refunded — prevent the catch handler from double-refunding
    }

    // Model-judged escalation suggestion (only when keyword detection didn't
    // already flag it). Suggestion only — never auto-escalates.
    let escalationSuggested = aiResult.needsEscalation
    let escalationReason = ''
    if (!aiResult.needsEscalation && aiResult.isComplex && !aiResult.isFallback) {
      const cls = await classifyEscalation(message, aiResult.content)
      if (cls?.suggested) {
        escalationSuggested = true
        escalationReason = cls.reason
      }
    }

    // Persist the exchange (usage was already reserved/refunded above).
    const result = await prisma.$transaction(async (tx) => {
      let chatSessionId = sessionId
      if (!chatSessionId) {
        const newSession = await tx.chatSession.create({
          data: { userId, titleAr: generateSessionTitle(message) },
        })
        chatSessionId = newSession.id
      }

      await tx.message.create({
        data: { sessionId: chatSessionId, role: 'USER', content: message },
      })

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

      await tx.chatSession.update({
        where: { id: chatSessionId },
        data: { updatedAt: new Date() },
      })

      return { chatSessionId, aiMessage }
    })

    return NextResponse.json({
      sessionId: result.chatSessionId,
      messageId: result.aiMessage.id,
      content: aiResult.content,
      isComplex: aiResult.isComplex,
      needsEscalation: aiResult.needsEscalation,
      escalationSuggested,
      escalationReason,
      isFallback: aiResult.isFallback,
    })
  } catch (error) {
    console.error('Chat message error:', error)
    // A consultation was reserved but the request failed before completing —
    // refund it so the user isn't charged for an error.
    if (reserved === 'payg') {
      await prisma.user
        .update({ where: { id: userId }, data: { paygCredits: { increment: 1 } } })
        .catch(() => {})
    } else if (reserved === 'monthly') {
      await prisma.usageRecord
        .updateMany({ where: { userId, monthYear }, data: { consultationsUsed: { decrement: 1 } } })
        .catch(() => {})
    }
    return NextResponse.json(
      { messageAr: 'حدث خطأ في معالجة طلبك. يُرجى المحاولة مجدداً.' },
      { status: 500 }
    )
  }
}
