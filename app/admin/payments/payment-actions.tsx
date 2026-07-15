'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PaymentActions({ paymentId, status }: { paymentId: string; status: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function setStatus(next: 'PAID' | 'REFUNDED' | 'FAILED' | 'PENDING', label: string) {
    if (!confirm(`تغيير حالة الدفعة إلى "${label}"؟`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.messageAr || 'تعذّر التغيير.')
        return
      }
      router.refresh()
    } finally { setBusy(false) }
  }

  return (
    <div className="flex gap-1">
      {status !== 'PAID' && (
        <button onClick={() => setStatus('PAID', 'مدفوع')} disabled={busy}
          className="text-xs px-2 py-1 rounded text-green-600 hover:bg-green-50 disabled:opacity-50">
          تعليم كمدفوع
        </button>
      )}
      {status === 'PAID' && (
        <button onClick={() => setStatus('REFUNDED', 'مُسترد')} disabled={busy}
          className="text-xs px-2 py-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50">
          استرداد
        </button>
      )}
      {status === 'PENDING' && (
        <button onClick={() => setStatus('FAILED', 'فاشل')} disabled={busy}
          className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-50">
          فاشل
        </button>
      )}
    </div>
  )
}
