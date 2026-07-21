'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreditsControl({
  userId,
  current,
}: {
  userId: string
  current: number
}) {
  const router = useRouter()
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function apply(sign: 1 | -1) {
    const n = Number(delta)
    if (!Number.isInteger(n) || n <= 0) {
      setMsg({ type: 'err', text: 'أدخل عدداً صحيحاً موجباً.' })
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: sign * n, reason: reason.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg({ type: 'err', text: data.messageAr || 'تعذّر التحديث.' })
        return
      }
      setMsg({ type: 'ok', text: `تم التحديث. الرصيد الحالي: ${data.paygCredits} استشارة.` })
      setDelta('')
      setReason('')
      router.refresh()
    } catch {
      setMsg({ type: 'err', text: 'خطأ في الاتصال.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">شحن رصيد الاستشارات (يدوي)</h2>
        <span className="text-sm font-semibold text-gold-600">
          <i className="fa-solid fa-coins ml-1" />
          الرصيد الحالي: {current}
        </span>
      </div>
      {msg && (
        <div className={`text-sm rounded-lg px-3 py-2 ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">عدد الاستشارات</label>
          <input
            type="number"
            min={1}
            max={1000}
            className={inp}
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            placeholder="مثال: 10"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">السبب (اختياري)</label>
          <input
            type="text"
            className={inp}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="مثال: دفع عبر التحويل البنكي"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => apply(1)}
          disabled={busy}
          className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <i className="fa-solid fa-plus ml-1" />
          إضافة رصيد
        </button>
        <button
          onClick={() => apply(-1)}
          disabled={busy}
          className="border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <i className="fa-solid fa-minus ml-1" />
          خصم رصيد
        </button>
      </div>
      <p className="text-xs text-gray-400">
        الرصيد المدفوع لا ينتهي شهرياً، ويُستهلك بعد استنفاد الحصة الشهرية للباقة.
      </p>
    </div>
  )
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500'
