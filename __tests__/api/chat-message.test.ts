import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    usageRecord: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/ai', () => ({
  generateAIResponse: vi.fn(),
}))

import { POST } from '@/app/api/chat/message/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateAIResponse } from '@/lib/ai'

const mockSession = {
  user: { id: 'user-1', email: 'test@sustainplus.com' },
  expires: '2099-01-01',
}

const mockAIResult = {
  content: 'إجابة تجريبية من الذكاء الاصطناعي',
  modelUsed: 'claude-haiku-4-5-20251001',
  isComplex: false,
  needsEscalation: false,
  inputTokens: 10,
  outputTokens: 20,
  isFallback: false,
}

function makeRequest(body: object) {
  return new NextRequest('http://localhost:3001/api/chat/message', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(generateAIResponse).mockResolvedValue(mockAIResult)
})

describe('POST /api/chat/message', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any)
    const res = await POST(makeRequest({ message: 'سؤال', history: [], sessionId: null }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body (empty message)', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    const res = await POST(makeRequest({ message: '', history: [], sessionId: null }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for missing message field', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    const res = await POST(makeRequest({ history: [], sessionId: null }))
    expect(res.status).toBe(400)
  })

  it('returns 402 when Free plan user has reached 3 consultations', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: {
        plan: { slug: 'free', consultationsPerMonth: 3 },
      },
    } as any)
    vi.mocked(prisma.usageRecord.findUnique).mockResolvedValueOnce({
      consultationsUsed: 3,
      paygCredits: 0,
    } as any)

    const res = await POST(makeRequest({ message: 'سؤال', history: [], sessionId: null }))
    expect(res.status).toBe(402)
  })

  it('returns 402 when PAYG user has 0 credits', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: {
        plan: { slug: 'payg', consultationsPerMonth: -1 },
      },
    } as any)
    vi.mocked(prisma.usageRecord.findUnique).mockResolvedValueOnce({
      consultationsUsed: 0,
      paygCredits: 0,
    } as any)

    const res = await POST(makeRequest({ message: 'سؤال', history: [], sessionId: null }))
    expect(res.status).toBe(402)
  })

  it('returns 200 with sessionId and content on success', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: {
        plan: { slug: 'standard', consultationsPerMonth: 30 },
      },
    } as any)
    vi.mocked(prisma.usageRecord.findUnique).mockResolvedValueOnce({
      consultationsUsed: 5,
      paygCredits: 0,
    } as any)
    vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: any) => {
      const tx = {
        chatSession: {
          create: vi.fn().mockResolvedValue({ id: 'session-new' }),
          update: vi.fn().mockResolvedValue({}),
        },
        message: {
          create: vi.fn().mockResolvedValue({ id: 'msg-ai-1' }),
        },
        usageRecord: { upsert: vi.fn().mockResolvedValue({}) },
      }
      return fn(tx)
    })

    const res = await POST(makeRequest({ message: 'سؤال بيئي', history: [], sessionId: null }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('sessionId')
    expect(body).toHaveProperty('content')
    expect(body.content).toBe(mockAIResult.content)
  })

  it('decrements paygCredits for PAYG user on success', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: {
        plan: { slug: 'payg', consultationsPerMonth: -1 },
      },
    } as any)
    vi.mocked(prisma.usageRecord.findUnique).mockResolvedValueOnce({
      consultationsUsed: 2,
      paygCredits: 5,
    } as any)

    let upsertCall: any
    vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: any) => {
      const tx = {
        chatSession: {
          create: vi.fn().mockResolvedValue({ id: 'session-payg' }),
          update: vi.fn().mockResolvedValue({}),
        },
        message: { create: vi.fn().mockResolvedValue({ id: 'msg-1' }) },
        usageRecord: {
          upsert: vi.fn().mockImplementation((args: any) => {
            upsertCall = args
            return Promise.resolve({})
          }),
        },
      }
      return fn(tx)
    })

    await POST(makeRequest({ message: 'سؤال', history: [], sessionId: null }))
    expect(upsertCall?.update).toMatchObject({ paygCredits: { decrement: 1 } })
  })

  it('increments consultationsUsed for subscription user on success', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      subscription: {
        plan: { slug: 'standard', consultationsPerMonth: 30 },
      },
    } as any)
    vi.mocked(prisma.usageRecord.findUnique).mockResolvedValueOnce({
      consultationsUsed: 10,
      paygCredits: 0,
    } as any)

    let upsertCall: any
    vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: any) => {
      const tx = {
        chatSession: {
          create: vi.fn().mockResolvedValue({ id: 'session-sub' }),
          update: vi.fn().mockResolvedValue({}),
        },
        message: { create: vi.fn().mockResolvedValue({ id: 'msg-1' }) },
        usageRecord: {
          upsert: vi.fn().mockImplementation((args: any) => {
            upsertCall = args
            return Promise.resolve({})
          }),
        },
      }
      return fn(tx)
    })

    await POST(makeRequest({ message: 'سؤال', history: [], sessionId: null }))
    expect(upsertCall?.update).toMatchObject({ consultationsUsed: { increment: 1 } })
  })
})
