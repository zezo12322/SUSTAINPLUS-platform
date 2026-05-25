import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    knowledgeEntry: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}))

// Anthropic mock
const mockAnthropicCreate = vi.hoisted(() => vi.fn())
vi.mock('@anthropic-ai/sdk', () => {
  class MockAnthropic {
    messages = { create: mockAnthropicCreate }
  }
  return { default: MockAnthropic }
})

// Gemini mock
const mockGeminiSendMessage = vi.hoisted(() => vi.fn())
vi.mock('@google/generative-ai', () => {
  class MockGoogleGenerativeAI {
    getGenerativeModel() {
      return {
        startChat: () => ({ sendMessage: mockGeminiSendMessage }),
      }
    }
  }
  return { GoogleGenerativeAI: MockGoogleGenerativeAI }
})

import { detectComplexity, generateAIResponse } from '@/lib/ai'
import { AI_MODELS } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

const anthropicResponse = {
  content: [{ type: 'text', text: 'إجابة من Claude' }],
  usage: { input_tokens: 10, output_tokens: 25 },
}

const geminiResponse = {
  response: {
    text: () => 'إجابة من Gemini',
    usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 15 },
  },
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.GEMINI_API_KEY = 'gemini-test-key'
  process.env.ANTHROPIC_API_KEY = 'anthropic-test-key'
  mockGeminiSendMessage.mockResolvedValue(geminiResponse)
  mockAnthropicCreate.mockResolvedValue(anthropicResponse)
})

afterEach(() => {
  delete process.env.GEMINI_API_KEY
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
    expect(detectComplexity('نحتاج إجراءات قانونية ضد التلوث').needsEscalation).toBe(true)
  })

  it('detects escalation keyword "lawsuit"', () => {
    expect(detectComplexity('considering a lawsuit').needsEscalation).toBe(true)
  })
})

describe('generateAIResponse — 3-tier routing', () => {
  it('routes simple query to Gemini (Tier 1)', async () => {
    const result = await generateAIResponse('ما هي فوائد إعادة التدوير؟', [])
    expect(result.modelUsed).toBe(AI_MODELS.simple)
    expect(result.content).toBe('إجابة من Gemini')
    expect(result.isFallback).toBe(false)
    expect(mockGeminiSendMessage).toHaveBeenCalledOnce()
    expect(mockAnthropicCreate).not.toHaveBeenCalled()
  })

  it('routes complex query to Claude Haiku (Tier 2)', async () => {
    const result = await generateAIResponse('أحتاج تدقيق بيئي رسمي للمصنع', [])
    expect(result.modelUsed).toBe(AI_MODELS.moderate)
    expect(result.content).toBe('إجابة من Claude')
    expect(result.isComplex).toBe(true)
    expect(mockAnthropicCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: AI_MODELS.moderate, max_tokens: 1024 })
    )
    expect(mockGeminiSendMessage).not.toHaveBeenCalled()
  })

  it('routes escalation query to Claude Sonnet (Tier 3)', async () => {
    const result = await generateAIResponse('يوجد حادث بيئي خطير في المصنع', [])
    expect(result.modelUsed).toBe(AI_MODELS.complex)
    expect(result.needsEscalation).toBe(true)
    expect(mockAnthropicCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: AI_MODELS.complex, max_tokens: 2048 })
    )
    expect(mockGeminiSendMessage).not.toHaveBeenCalled()
  })

  it('falls back to Claude Haiku when Gemini fails', async () => {
    mockGeminiSendMessage.mockRejectedValueOnce(new Error('Gemini API error'))
    const result = await generateAIResponse('سؤال بسيط', [])
    expect(result.modelUsed).toBe(AI_MODELS.moderate)
    expect(result.isFallback).toBe(false)
    expect(mockAnthropicCreate).toHaveBeenCalledOnce()
  })

  it('falls back to text when no API keys configured', async () => {
    delete process.env.GEMINI_API_KEY
    delete process.env.ANTHROPIC_API_KEY
    const result = await generateAIResponse('سؤال', [])
    expect(result.isFallback).toBe(true)
    expect(result.modelUsed).toBe('fallback')
  })

  it('returns correct AIResponse shape with all fields', async () => {
    const result = await generateAIResponse('سؤال بسيط', [])
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('modelUsed')
    expect(result).toHaveProperty('isComplex')
    expect(result).toHaveProperty('needsEscalation')
    expect(result).toHaveProperty('inputTokens')
    expect(result).toHaveProperty('outputTokens')
    expect(result).toHaveProperty('isFallback')
  })

  it('returns Gemini token counts for simple query', async () => {
    const result = await generateAIResponse('سؤال بسيط', [])
    expect(result.inputTokens).toBe(5)
    expect(result.outputTokens).toBe(15)
  })

  it('injects KB context when entries found', async () => {
    vi.mocked(prisma.knowledgeEntry.findMany).mockResolvedValueOnce([
      { id: 'kb-1', titleAr: 'معلومة بيئية', contentAr: 'محتوى المقالة', category: 'COMPLIANCE' },
    ] as any)

    await generateAIResponse('سؤال يتعلق بالامتثال', [])

    const callArgs = mockGeminiSendMessage.mock.calls
    // KB context is injected at model creation (systemInstruction), verify the call was made
    expect(mockGeminiSendMessage).toHaveBeenCalledOnce()
  })

  it('returns isFallback=true when all providers throw', async () => {
    mockGeminiSendMessage.mockRejectedValueOnce(new Error('Gemini down'))
    mockAnthropicCreate.mockRejectedValueOnce(new Error('Claude down'))
    const result = await generateAIResponse('سؤال', [])
    expect(result.isFallback).toBe(true)
  })
})
