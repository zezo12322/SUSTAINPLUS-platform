'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PlanOption = { id: string; nameAr: string }

export function SubscriptionControl({
  userId,
  plans,
  current,
}: {
  userId: string
  plans: PlanOption[]
  current: { planId: string | null; status: string | null }
}) {
  const router = useRouter()
  const [planId, setPlanId] = useState(current.planId ?? plans[0]?.id ?? '')
  const [status, setStatus] = useState(current.status ?? 'ACTIVE')
  const [periodMonths, setPeriodMonths] = useState(1)
  const [cancelAtPeriodEnd, setCancel] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function save() {
    if (!planId) { setMsg({ type: 'err', text: 'اختر خطة.' }); return }
    setBusy(true); setMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, status, periodMonths: Number(periodMonths), cancelAtPeriodEnd }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.messageAr || 'تعذّر الحفظ.' }); return }
      setMsg({ type: 'ok', text: 'تم تحديث الاشتراك.' })
      router.refresh()
    } catch { setMsg({ type: 'err', text: 'خطأ في الاتصال.' }) } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 mt-4">
      <h2 className="text-sm font-bold text-gray-700">إدارة الاشتراك</h2>
      {msg && (
        <div className={`text-sm rounded-lg px-3 py-2 ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg.text}</div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">الخطة</label>
          <select className={inp} value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((p) => <option key={p.id} value={p.id}>{p.nameAr}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">الحالة</label>
          <select className={inp} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">نشط</option>
            <option value="TRIALING">تجريبي</option>
            <option value="PAST_DUE">متأخر السداد</option>
            <option value="CANCELED">ملغى</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">المدة (شهور من الآن)</label>
          <input type="number" min={1} max={36} className={inp} value={periodMonths} onChange={(e) => setPeriodMonths(e.target.value as any)} />
        </div>
        <label className="flex items-end gap-2 text-sm text-gray-700 pb-2">
          <input type="checkbox" checked={cancelAtPeriodEnd} onChange={(e) => setCancel(e.target.checked)} /> إلغاء عند نهاية الفترة
        </label>
      </div>
      <button onClick={save} disabled={busy} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
        حفظ الاشتراك
      </button>
    </div>
  )
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500'
