'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Message {
  id?: string
  role: 'USER' | 'ASSISTANT' | 'user' | 'assistant'
  content: string
  isComplex?: boolean
  createdAt?: string
}

interface ChatInterfaceProps {
  userId: string
  sessionId: string | null
  planSlug: string
  used: number
  limit: number
  remaining: number
  canChat: boolean
  messages: Message[]
}

export function ChatInterface({
  userId: _userId,
  sessionId: initialSessionId,
  planSlug: _planSlug,
  used,
  limit,
  remaining,
  canChat: initialCanChat,
  messages: initialMessages,
}: ChatInterfaceProps) {
  const router = useRouter()
  const [sessionId, setSessionId] = useState(initialSessionId)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [canChat, setCanChat] = useState(initialCanChat)
  const [remainingCount, setRemainingCount] = useState(remaining)
  const [showEscalation, setShowEscalation] = useState(false)
  const [escalationSent, setEscalationSent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || loading || !canChat) return

    const userMsg: Message = { role: 'USER', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMsg.content,
          history: messages.map((m) => ({
            role: (m.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 402) {
          setCanChat(false)
          setRemainingCount(0)
          setError(data.messageAr || 'لقد وصلت لحد الاستشارات الشهرية.')
        } else {
          setError(data.messageAr || 'حدث خطأ. يُرجى المحاولة مجدداً.')
        }
        setMessages((prev) => prev.slice(0, -1))
        return
      }

      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId)
        router.replace(`/dashboard/chat/${data.sessionId}`, { scroll: false })
      }

      const aiMsg: Message = {
        id: data.messageId,
        role: 'ASSISTANT',
        content: data.content,
        isComplex: data.isComplex,
      }
      setMessages((prev) => [...prev, aiMsg])
      setRemainingCount((prev) => Math.max(0, prev - 1))

      if (data.needsEscalation) {
        setShowEscalation(true)
      }
    } catch {
      setError('حدث خطأ في الاتصال. يُرجى المحاولة مجدداً.')
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function escalateToExpert() {
    if (!sessionId || escalationSent) return
    try {
      await fetch('/api/expert-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          descriptionAr: messages
            .filter((m) => m.role === 'USER' || m.role === 'user')
            .map((m) => m.content)
            .join('\n'),
        }),
      })
      setEscalationSent(true)
      setShowEscalation(false)
    } catch {
      // silent
    }
  }

  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Usage banner */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block flex-shrink-0 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', {
                'bg-primary-500': pct < 70,
                'bg-amber-500': pct >= 70 && pct < 90,
                'bg-red-500': pct >= 90,
              })}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {remainingCount} استشارة متبقية هذا الشهر
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {escalationSent ? (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <i className="fa-solid fa-check-circle" />
              طُلب خبير بشري
            </span>
          ) : (
            <button
              onClick={() => setShowEscalation(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-user-tie" />
              تحدث مع خبير
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-leaf text-primary-600 text-2xl" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              مرحباً بك في المستشار البيئي
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              اطرح سؤالك البيئي وسيستجيب لك نظام الاستشارات المدعوم بخبرة سستين بلس.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'ما متطلبات ترخيص المصنع بيئياً؟',
                'كيف أحسب انبعاثات الكربون؟',
                'ما اشتراطات التخلص من النفايات الصناعية؟',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-2 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'USER' || msg.role === 'user'
          return (
            <div
              key={msg.id || i}
              className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
            >
              {!isUser && (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ml-2">
                  <i className="fa-solid fa-leaf text-primary-600 text-xs" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  isUser
                    ? 'bg-primary-600 text-white rounded-tl-none'
                    : 'bg-white border border-gray-100 shadow-sm rounded-tr-none text-gray-800'
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div
                    className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^#{1,3}\s(.+)$/gm, '<h3 class="font-bold mt-3 mb-1">$1</h3>')
                        .replace(/^(\d+)\.\s/gm, '<br/>$1. ')
                        .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />
                )}
                {!isUser && msg.isComplex && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                    <i className="fa-solid fa-bolt text-[8px]" />
                    تحليل معمّق
                  </span>
                )}
              </div>
              {isUser && (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                  <i className="fa-solid fa-user text-primary-600 text-xs" />
                </div>
              )}
            </div>
          )
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ml-2">
              <i className="fa-solid fa-leaf text-primary-600 text-xs" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tr-none px-4 py-3">
              <div className="typing-indicator flex gap-1">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Escalation modal */}
      {showEscalation && !escalationSent && (
        <div className="mx-4 mb-2 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              يبدو أن استفسارك قد يحتاج متخصصاً بشرياً
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              للحالات الرسمية والتراخيص والقضايا القانونية، يُنصح بالتحدث مع خبير.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowEscalation(false)}
              className="text-xs text-amber-600 hover:text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100"
            >
              لاحقاً
            </button>
            <button
              onClick={escalateToExpert}
              className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              تصعيد لخبير
            </button>
          </div>
        </div>
      )}

      {/* Limit reached banner */}
      {!canChat && (
        <div className="mx-4 mb-2 bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-red-700 text-sm">
              لقد استنفدت استشاراتك الشهرية
            </p>
            <p className="text-red-500 text-xs mt-0.5">
              قم بترقية باقتك أو شراء استشارات إضافية للمتابعة.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-sm font-semibold bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            ترقية الباقة
          </Link>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mx-4 mb-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 p-4 flex-shrink-0">
        <form onSubmit={sendMessage} className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || !canChat}
            placeholder={
              canChat
                ? 'اكتب استفسارك البيئي هنا... (Enter للإرسال، Shift+Enter لسطر جديد)'
                : 'يُرجى ترقية باقتك للمتابعة'
            }
            rows={2}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-400 leading-relaxed"
            style={{ minHeight: '52px', maxHeight: '160px' }}
          />
          <button
            type="submit"
            disabled={loading || !canChat || !input.trim()}
            className="w-12 h-12 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <i className="fa-solid fa-paper-plane text-sm" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-gray-300 text-center mt-2">
          الردود إرشادية فقط وليست شهادات رسمية • سستين بلس © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
