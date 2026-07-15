'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ACTIONS: { status: string; label: string; icon: string; cls: string }[] = [
  { status: 'IN_PROGRESS', label: 'بدء العمل', icon: 'fa-play', cls: 'border-primary-200 text-primary-700 hover:bg-primary-50' },
  { status: 'ANSWERED', label: 'تمّت الإجابة', icon: 'fa-circle-check', cls: 'border-green-200 text-green-700 hover:bg-green-50' },
  { status: 'CONVERTED_TO_BOOKING', label: 'تحويل لحجز', icon: 'fa-calendar-check', cls: 'border-gold-200 text-gold-700 hover:bg-gold-50' },
  { status: 'RESOLVED', label: 'إغلاق كمحلول', icon: 'fa-flag-checkered', cls: 'border-gray-200 text-gray-600 hover:bg-gray-50' },
]

export function ExpertCaseActions({ caseId, currentStatus }: { caseId: string; currentStatus: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  async function setStatus(status: string) {
    setBusy(status)
    setError('')
    try {
      const res = await fetch(`/api/expert-cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.messageAr || 'تعذّر تحديث الحالة.')
        return
      }
      router.refresh()
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-sm font-bold text-gray-800 mb-3">إجراءات الحالة</p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-3">{error}</div>
      )}
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.status}
            onClick={() => setStatus(a.status)}
            disabled={!!busy || currentStatus === a.status}
            className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${a.cls}`}
          >
            <i className={`fa-solid ${busy === a.status ? 'fa-spinner fa-spin' : a.icon}`} />
            {a.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        {/* TODO: "تحويل لحجز" will link to the booking flow in Phase 2 of the product roadmap. */}
        ملاحظة: تحويل لحجز يسجّل الحالة فقط حالياً (ربط الحجز لاحقاً).
      </p>
    </div>
  )
}
