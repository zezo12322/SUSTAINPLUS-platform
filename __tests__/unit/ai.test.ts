import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    knowledgeEntry: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}))

const mockCreate = vi.hoisted(() => vi.fn())

vi.mock('@anthropic-ai/sdk', () => {
  class MockAnthropic {
    messages = { create: mockCreate }
  }
  return { default: MockAnthropic }
})

import { detectComplexity, generateAIResponse } from '@/lib/ai'
import { AI_MODELS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

const defaultAPIResponse = {
  content: [{ type: 'text', text: 'إجابة تجريبية من الذكاء الاصطناعي' }],
  usage: { input_tokens: 10, output_tokens: 25 },
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.ANTHROPIC_API_KEY = 'test-key-123'
  mockCreate.mockResolvedValue(defaultAPIResponse)
})

afterEach(() => {
  delete process.env.ANTHROPIC_API_KEY
})

describe('detectComplexity', () => {
  it('returns isComplex=false and needsEscalation=false for simple query', () => {
    const result = detectComplexity('ما هي فوائد إعادة التدوير؟')
    expect(result.isComplex).toBe(false)
    expect(result.needsEscalation).toBe(false)
  })

  it('detects Arabic complex keyword "تدقيق"', () => {
    expect(detectComplexity('أحتاج تدقيق بيئي').isComplex).toBe(true)
  })

  it('detects English complex keyword "audit"', () => {
    expect(detectComplexity('I need an environmental audit').isComplex).toBe(true)
  })

  it('detects escalation keyword "إجراءات قانونية"', () => {
    const result = detectComplexity('نحتاج إجراءات قانونية ضد التلوث')
    expect(result.needsEscalation).toBe(true)
  })

  it('detects escalation keyword "lawsuit"', () => {
    expect(detectComplexity('considering a lawsuit').needsEscalation).toBe(true)
  })
})

describe('generateAIResponse', () => {
  it('returns isFallback=true and modelUsed="fallback" when API key missing', async () => {
    delete process.env.ANTHROPIC_API_KEY
    const result = await generateAIResponse('سؤال', [])
    expect(result.isFallback).toBe(true)
    expect(result.modelUsed).toBe('fallback')
    expect(typeof result.content).toBe('string')
    expect(result.content.length).toBeGreaterThan(0)
  })

  it('returns correct AIResponse shape with all required fields', async () => {
    const result = await generateAIResponse('سؤال بسيط', [])
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('modelUsed')
    expect(result).toHaveProperty('isComplex')
    expect(result).toHaveProperty('needsEscalation')
    expect(result).toHaveProperty('inputTokens')
    expect(result).toHaveProperty('outputTokens')
    expect(result).toHaveProperty('isFallback')
  })

  it('marks isComplex=false for simple query', async () => {
    const result = await generateAIResponse('ما هي فوائد إعادة التدوير؟', [])
    expect(result.isComplex).toBe(false)
    expect(result.isFallback).toBe(false)
  })

  it('marks isComplex=true for complex query', async () => {
    const result = await generateAIResponse('أحتاج رخصة بيئية للمصنع', [])
    expect(result.isComplex).toBe(true)
  })

  it('routes simple query to simple model (haiku)', async () => {
    await generateAIResponse('سؤال بسيط عن إعادة التدوير', [])
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: AI_MODELS.simple })
    )
  })

  it('routes complex query to complex model (sonnet)', async () => {
    await generateAIResponse('أحتاج تدقيق بيئي رسمي للمصنع', [])
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: AI_MODELS.complex })
    )
  })

  it('injects KB context into system prompt when entries found', async () => {
    vi.mocked(prisma.knowledgeEntry.findMany).mockResolvedValueOnce([
      {
        id: 'kb-1',
        titleAr: 'معلومة بيئية',
        contentAr: 'محتوى المقالة البيئية',
        category: 'COMPLIANCE',
      },
    ] as any)

    await generateAIResponse('سؤال يتعلق بالامتثال', [])

    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.system).toContain('معلومة بيئية')
  })

  it('returns inputTokens and outputTokens from API response', async () => {
    const result = await generateAIResponse('سؤال', [])
    expect(result.inputTokens).toBe(10)
    expect(result.outputTokens).toBe(25)
    expect(result.isFallback).toBe(false)
  })

  it('returns isFallback=true when Anthropic API throws', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API error'))
    const result = await generateAIResponse('سؤال', [])
    expect(result.isFallback).toBe(true)
    expect(result.modelUsed).toBe('fallback')
  })
})
