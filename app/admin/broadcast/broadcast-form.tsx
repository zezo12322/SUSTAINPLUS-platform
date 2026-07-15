'use client'

import { useState } from 'react'

export function BroadcastForm() {
  const [titleAr, setTitle] = useState('')
  const [bodyAr, setBody] = useState('')
  const [target, setTarget] = useState<'ALL' | 'USER' | 'EXPERT' | 'ADMIN'>('ALL')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function send() {
    if (!titleAr.trim() || !bodyAr.trim()) { setMsg({ type: 'err', text: 'العنوان والنص مطلوبان.' }); return }
    if (!confirm('إرسال الإشعار للمجموعة المحددة؟')) return
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleAr: titleAr.trim(), bodyAr: bodyAr.trim(), target }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.messageAr || 'تعذّر الإرسال.' }); return }
      setMsg({ type: 'ok', text: `تم الإرسال إلى ${data.sent} مستخدم.` })
      setTitle(''); setBody('')
    } catch { setMsg({ type: 'err', text: 'خطأ في الاتصال.' }) } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {msg && (
        <div className={`text-sm rounded-lg px-3 py-2 ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg.text}</div>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">الفئة المستهدفة</label>
        <select className={inp} value={target} onChange={(e) => setTarget(e.target.value as any)}>
          <option value="ALL">كل المستخدمين</option>
          <option value="USER">المستخدمون فقط</option>
          <option value="EXPERT">الخبراء فقط</option>
          <option value="ADMIN">المدراء فقط</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">العنوان</label>
        <input className={inp} value={titleAr} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">النص</label>
        <textarea className={inp} rows={4} value={bodyAr} onChange={(e) => setBody(e.target.value)} maxLength={2000} />
      </div>
      <button onClick={send} disabled={busy} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
        إرسال الإشعار
      </button>
    </div>
  )
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500'
