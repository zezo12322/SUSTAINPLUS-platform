'use client'

import { useEffect, useRef, useState } from 'react'

interface ThreadMessage {
  id: string
  senderRole: 'USER' | 'EXPERT'
  body: string
  createdAt: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('ar-EG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EscalationThread({
  caseId,
  viewerRole,
  disabled = false,
}: {
  caseId: string
  viewerRole: 'expert' | 'user'
  disabled?: boolean
}) {
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    fetch(`/api/expert-cases/${caseId}/messages`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setMessages(d.messages || [])
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [caseId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(`/api/expert-cases/${caseId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.messageAr || 'تعذّر إرسال الرسالة.')
        return
      }
      setMessages((prev) => [...prev, data.message])
      setBody('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-comments text-primary-600" />
        المحادثة {viewerRole === 'expert' ? 'مع العميل' : 'مع الخبير'}
      </p>

      <div className="space-y-3 max-h-[420px] overflow-y-auto mb-4">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-6">جاري التحميل...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">لا توجد رسائل بعد. ابدأ المحادثة بالأسفل.</p>
        ) : (
          messages.map((m) => {
            const mine =
              (viewerRole === 'expert' && m.senderRole === 'EXPERT') ||
              (viewerRole === 'user' && m.senderRole === 'USER')
            const senderLabel = m.senderRole === 'EXPERT' ? 'الخبير' : 'العميل'
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    mine
                      ? 'bg-primary-600 text-white rounded-tl-none'
                      : 'bg-gray-100 text-gray-800 rounded-tr-none'
                  }`}
                >
                  <p className={`text-[10px] font-semibold mb-1 ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                    {senderLabel} · {formatTime(m.createdAt)}
                  </p>
                  {m.body}
                </div>
              </div>
            )
          })
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {disabled ? (
        <p className="text-xs text-gray-400 text-center py-2">هذا الطلب مغلق.</p>
      ) : (
        <form onSubmit={send} className="flex items-end gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder={viewerRole === 'expert' ? 'اكتب ردّك للعميل...' : 'اكتب رسالتك للخبير...'}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-right text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex-shrink-0"
          >
            {sending ? '...' : 'إرسال'}
          </button>
        </form>
      )}
    </div>
  )
}
