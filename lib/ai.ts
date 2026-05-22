import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'
import {
  AI_MODELS,
  AI_SYSTEM_PROMPT,
  COMPLEX_QUERY_KEYWORDS,
  ESCALATION_KEYWORDS,
} from '@/lib/constants'

let _client: Anthropic | null = null

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _client
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
// MAIN AI CHAT FUNCTION
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

export async function generateAIResponse(
  userMessage: string,
  history: ChatMessage[]
): Promise<AIResponse> {
  const { isComplex, needsEscalation } = detectComplexity(userMessage)
  const model = isComplex ? AI_MODELS.complex : AI_MODELS.simple
  const client = getClient()

  // Safe fallback when API key is missing
  if (!client) {
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

  const kbContext = await getKBContext(userMessage)
  const systemPrompt = AI_SYSTEM_PROMPT + kbContext

  const messages = [
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]

  try {
    const response = await client.messages.create({
      model,
      max_tokens: isComplex ? 2048 : 1024,
      system: systemPrompt,
      messages,
    })

    const content =
      response.content[0].type === 'text' ? response.content[0].text : ''

    return {
      content,
      modelUsed: model,
      isComplex,
      needsEscalation,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
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
