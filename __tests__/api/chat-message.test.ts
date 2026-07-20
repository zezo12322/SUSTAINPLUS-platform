import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({ getAuthedUser: vi.fn() }))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    chatSession: { findFirst: vi.fn() },
    message: { findMany: vi.fn() },
    usageRecord: { upsert: vi.fn(), updateMany: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/ai', () => ({
  generateAIResponse: vi.fn(),
  classifyEscalation: vi.fn(),
}))

import { POST } from '@/app/api/chat/message/route'
import { getAuthedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateAIResponse } from '@/lib/ai'

const authedUser = { userId: 'user-1', role: 'USER' as const, emailVerified: true }

const mockAIResult = {
  content: 'إجابة تجريبية من الذكاء الاصطناعي',
  modelUsed: 'azure/gpt-4o-mini',
  isComplex: false,
  needsEscalation: false,
  inputTokens: 10,
  outputTokens: 20,
  isFallback: false,
}

const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

function makeRequest(body: object) {
  return new NextRequest('http://localhost:3001/api/chat/message', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

// Wire the persistence transaction to a fake tx that returns created rows.
function mockPersistTransaction(sessionId = 'session-new') {
  vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: any) => {
    const tx = {
      chatSession: {
        create: vi.fn().mockResolvedValue({ id: sessionId }),
        update: vi.fn().mockResolvedValue({}),
      },
      message: { create: vi.fn().mockResolvedValue({ id: 'msg-ai-1' }) },
    }
    return fn(tx)
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(generateAIResponse).mockResolvedValue(mockAIResult)
})

describe('POST /api/chat/message', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(null)
    const res = await POST(makeRequest({ message: 'سؤال', sessionId: null }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body (empty message)', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    const res = await POST(makeRequest({ message: '', sessionId: null }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for missing message field', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    const res = await POST(makeRequest({ sessionId: null }))
    expect(res.status).toBe(400)
  })

  it('returns 402 when Free plan user has reached the monthly limit', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ subscription: null } as any)
    vi.mocked(prisma.usageRecord.upsert).mockResolvedValueOnce({} as any)
    // No row satisfied "consultationsUsed < limit" → limit reached.
    vi.mocked(prisma.usageRecord.updateMany).mockResolvedValueOnce({ count: 0 } as any)

    const res = await POST(makeRequest({ message: 'سؤال', sessionId: null }))
    expect(res.status).toBe(402)
  })

  it('returns 402 when PAYG user has 0 credits', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: { status: 'ACTIVE', currentPeriodEnd: future, plan: { slug: 'payg', consultationsPerMonth: -1 } },
    } as any)
    // No credit row could be decremented → 0 credits.
    vi.mocked(prisma.usageRecord.updateMany).mockResolvedValueOnce({ count: 0 } as any)

    const res = await POST(makeRequest({ message: 'سؤال', sessionId: null }))
    expect(res.status).toBe(402)
  })

  it('falls back to free limit when the subscription is expired', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: { status: 'ACTIVE', currentPeriodEnd: past, plan: { slug: 'standard', consultationsPerMonth: 30 } },
    } as any)
    vi.mocked(prisma.usageRecord.upsert).mockResolvedValueOnce({} as any)
    // Expired → treated as free (limit 3); simulate limit reached to prove the fallback path ran.
    vi.mocked(prisma.usageRecord.updateMany).mockResolvedValueOnce({ count: 0 } as any)

    const res = await POST(makeRequest({ message: 'سؤال', sessionId: null }))
    expect(res.status).toBe(402)
  })

  it('returns 200 with sessionId and content on success', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: { status: 'ACTIVE', currentPeriodEnd: future, plan: { slug: 'standard', consultationsPerMonth: 30 } },
    } as any)
    vi.mocked(prisma.usageRecord.upsert).mockResolvedValueOnce({} as any)
    vi.mocked(prisma.usageRecord.updateMany).mockResolvedValueOnce({ count: 1 } as any)
    mockPersistTransaction('session-ok')

    const res = await POST(makeRequest({ message: 'سؤال بيئي', sessionId: null }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.sessionId).toBe('session-ok')
    expect(body.content).toBe(mockAIResult.content)
  })

  it('does NOT charge a consultation when the AI response is a fallback (refund)', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: { status: 'ACTIVE', currentPeriodEnd: future, plan: { slug: 'standard', consultationsPerMonth: 30 } },
    } as any)
    vi.mocked(prisma.usageRecord.upsert).mockResolvedValueOnce({} as any)
    vi.mocked(prisma.usageRecord.updateMany).mockResolvedValue({ count: 1 } as any)
    vi.mocked(generateAIResponse).mockResolvedValueOnce({ ...mockAIResult, isFallback: true })
    mockPersistTransaction('session-fb')

    const res = await POST(makeRequest({ message: 'سؤال', sessionId: null }))
    expect(res.status).toBe(200)

    // A refund updateMany with a decrement must have been issued.
    const refundCall = vi
      .mocked(prisma.usageRecord.updateMany)
      .mock.calls.find((c: any) => c[0]?.data?.consultationsUsed?.decrement === 1)
    expect(refundCall).toBeTruthy()
  })

  it('returns 404 when a supplied session does not belong to the caller', async () => {
    vi.mocked(getAuthedUser).mockResolvedValueOnce(authedUser)
    vi.mocked(prisma.chatSession.findFirst).mockResolvedValueOnce(null)

    const res = await POST(makeRequest({ message: 'سؤال', sessionId: 'someone-elses-session' }))
    expect(res.status).toBe(404)
  })
})
