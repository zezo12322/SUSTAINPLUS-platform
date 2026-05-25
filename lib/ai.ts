import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'
import {
  AI_MODELS,
  AI_SYSTEM_PROMPT,
  COMPLEX_QUERY_KEYWORDS,
  ESCALATION_KEYWORDS,
} from '@/lib/constants'

// ==========================================
// CLIENT SINGLETONS
// ==========================================

let _anthropicClient: Anthropic | null = null
let _geminiClient: GoogleGenerativeAI | null = null

function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!_anthropicClient) _anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _anthropicClient
}

function getGeminiClient(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) return null
  if (!_geminiClient) _geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return _geminiClient
}

// ==========================================
// KNOWLEDGE BASE CONTEXT
// ==========================================

async function getKBContext(query: string): Promise<string> {
  try {
    const entries = await prisma.knowledgeEntry.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { titleAr: { contains: query, mode: 'insensitive' } },
          { contentAr: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: query.split(' ').filter((w) => w.length > 3) } },
        ],
      },
      take: 5,
      select: { id: true, titleAr: true, contentAr: true, category: true },
    })

    if (entries.length === 0) return ''

    const context = entries
      .map((e) => `### ${e.titleAr}\n${e.contentAr}`)
      .join('\n\n---\n\n')

    return `\n\n**معلومات من قاعدة معرفة سستين بلس:**\n${context}`
  } catch {
    return ''
  }
}

// ==========================================
// COMPLEXITY DETECTION
// ==========================================

export function detectComplexity(text: string): {
  isComplex: boolean
  needsEscalation: boolean
} {
  const lower = text.toLowerCase()
  const isComplex = COMPLEX_QUERY_KEYWORDS.some((kw) =>
    lower.includes(kw.toLowerCase())
  )
  const needsEscalation = ESCALATION_KEYWORDS.some((kw) =>
    lower.includes(kw.toLowerCase())
  )
  return { isComplex, needsEscalation }
}

// ==========================================
// TIER SELECTION
// Tier 1 — simple:   Gemini Flash   (cheapest, ~$0.075/1M tokens)
// Tier 2 — moderate: Claude Haiku   (~$0.25/1M tokens)
// Tier 3 — complex:  Claude Sonnet  (highest quality, ~$3/1M tokens)
// ==========================================

type Tier = 'simple' | 'moderate' | 'complex'

function selectTier(isComplex: boolean, needsEscalation: boolean): Tier {
  if (needsEscalation) return 'complex'
  if (isComplex) return 'moderate'
  return 'simple'
}

// ==========================================
// INTERFACES
// ==========================================

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  modelUsed: string
  isComplex: boolean
  needsEscalation: boolean
  inputTokens: number
  outputTokens: number
  isFallback: boolean
}

// ==========================================
// GEMINI GENERATION (Tier 1)
// ==========================================

async function generateWithGemini(
  userMessage: string,
  history: ChatMessage[],
  systemPrompt: string
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const client = getGeminiClient()
  if (!client) throw new Error('GEMINI_API_KEY not configured')

  const model = client.getGenerativeModel({
    model: AI_MODELS.simple,
    systemInstruction: systemPrompt,
  })

  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 1024 },
  })

  const result = await chat.sendMessage(userMessage)
  const content = result.response.text()
  const usage = result.response.usageMetadata

  return {
    content,
    inputTokens: usage?.promptTokenCount ?? 0,
    outputTokens: usage?.candidatesTokenCount ?? 0,
  }
}

// ==========================================
// ANTHROPIC GENERATION (Tier 2 & 3)
// ==========================================

async function generateWithAnthropic(
  userMessage: string,
  history: ChatMessage[],
  systemPrompt: string,
  model: string,
  maxTokens: number
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const client = getAnthropicClient()
  if (!client) throw new Error('ANTHROPIC_API_KEY not configured')

  const messages = [
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''

  return {
    content,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}

// ==========================================
// MAIN AI CHAT FUNCTION
// ==========================================

export async function generateAIResponse(
  userMessage: string,
  history: ChatMessage[]
): Promise<AIResponse> {
  const { isComplex, needsEscalation } = detectComplexity(userMessage)
  const tier = selectTier(isComplex, needsEscalation)

  const kbContext = await getKBContext(userMessage)
  const systemPrompt = AI_SYSTEM_PROMPT + kbContext

  try {
    let result: { content: string; inputTokens: number; outputTokens: number }
    let modelUsed: string

    if (tier === 'simple') {
      try {
        result = await generateWithGemini(userMessage, history, systemPrompt)
        modelUsed = AI_MODELS.simple
      } catch {
        // Gemini unavailable — fall back to Claude Haiku
        if (!getAnthropicClient()) return buildFallback(isComplex, needsEscalation)
        result = await generateWithAnthropic(userMessage, history, systemPrompt, AI_MODELS.moderate, 1024)
        modelUsed = AI_MODELS.moderate
      }
    } else if (tier === 'moderate') {
      if (!getAnthropicClient()) return buildFallback(isComplex, needsEscalation)
      result = await generateWithAnthropic(userMessage, history, systemPrompt, AI_MODELS.moderate, 1024)
      modelUsed = AI_MODELS.moderate
    } else {
      if (!getAnthropicClient()) return buildFallback(isComplex, needsEscalation)
      result = await generateWithAnthropic(userMessage, history, systemPrompt, AI_MODELS.complex, 2048)
      modelUsed = AI_MODELS.complex
    }

    return {
      content: result.content,
      modelUsed,
      isComplex,
      needsEscalation,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      isFallback: false,
    }
  } catch (error) {
    console.error('AI generation error:', error)
    return {
      content: getErrorFallbackResponse(),
      modelUsed: 'fallback',
      isComplex,
      needsEscalation,
      inputTokens: 0,
      outputTokens: 0,
      isFallback: true,
    }
  }
}

function buildFallback(isComplex: boolean, needsEscalation: boolean): AIResponse {
  return {
    content: getFallbackResponse(),
    modelUsed: 'fallback',
    isComplex,
    needsEscalation,
    inputTokens: 0,
    outputTokens: 0,
    isFallback: true,
  }
}

// ==========================================
// FALLBACK RESPONSES
// ==========================================

function getFallbackResponse(): string {
  return `شكراً لاستفساركم.

نظام الاستشارات الذكي غير متاح حالياً. يُرجى:

١. **المحاولة لاحقاً** — نعمل على إعادة الخدمة في أقرب وقت.
٢. **التواصل مع فريق سستين بلس مباشرة** عبر صفحة التواصل للحصول على استشارة من خبراء متخصصين.

نعتذر عن هذا الاضطراب.`
}

function getErrorFallbackResponse(): string {
  return `عذراً، حدث خطأ مؤقت في معالجة استفسارك.

يُرجى **المحاولة مرة أخرى بعد قليل**.

إذا استمرت المشكلة، يمكنك **تصعيد استفسارك إلى خبير بشري** عبر الزر أدناه للحصول على رد في أقرب وقت ممكن.`
}
