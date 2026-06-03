'use client'

import { useEffect, useState } from 'react'

interface ExpertCase {
  id: string
  descriptionAr: string
  status: string
  priority: string
  category: string | null
  createdAt: string
  resolvedAt: string | null
  adminNotes: string | null
}

const STATUS_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  PENDING: { label: 'في الانتظار', cls: 'sp-badge-yellow', icon: 'fa-clock' },
  IN_REVIEW: { label: 'قيد المراجعة', cls: 'sp-badge-yellow', icon: 'fa-magnifying-glass' },
  ASSIGNED: { label: 'تم التخصيص', cls: 'sp-badge-green', icon: 'fa-user-check' },
  IN_PROGRESS: { label: 'جارٍ العمل', cls: 'sp-badge-green', icon: 'fa-spinner' },
  RESOLVED: { label: 'تم الحل', cls: 'sp-badge-gray', icon: 'fa-circle-check' },
  CLOSED: { label: 'مغلق', cls: 'sp-badge-gray', icon: 'fa-xmark-circle' },
}

const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  low: { label: 'منخفض', cls: 'sp-badge-gray' },
  normal: { label: 'عادي', cls: 'sp-badge-yellow' },
  high: { label: 'عاجل', cls: 'sp-badge-red' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ExpertPage() {
  const [cases, setCases] = useState<ExpertCase[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ descriptionAr: '', category: 'general', priority: 'normal' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/expert-cases')
      .then((r) => r.json())
      .then((d) => setCases(d.cases || []))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.descriptionAr.trim()) return
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/expert-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.messageAr || 'حدث خطأ.')
      } else {
        setSuccess(data.messageAr)
        setForm({ descriptionAr: '', category: 'general', priority: 'normal' })
        // Reload cases
        fetch('/api/expert-cases')
          .then((r) => r.json())
          .then((d) => setCases(d.cases || []))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">التصعيد لخبير</h1>
        <p className="text-sm text-gray-400 mt-1">
          للحالات المعقدة التي تحتاج رأياً متخصصاً أو إجراءات رسمية.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 mb-6 flex gap-4">
        <i className="fa-solid fa-circle-info text-gold-500 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gold-800 mb-1">متى تتحدث مع خبير؟</p>
          <ul className="text-sm text-gold-700 space-y-1">
            <li>• حالات تستلزم تراخيص أو موافقات رسمية من الجهات الحكومية</li>
            <li>• قضايا قانونية أو غرامات أو مخالفات بيئية</li>
            <li>• دراسات تقييم الأثر البيئي (EIA) التي تتطلب توقيع متخصص</li>
            <li>• حوادث بيئية طارئة تحتاج تدخلاً فورياً</li>
          </ul>
        </div>
      </div>

      {/* New case form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-5">إرسال طلب جديد</h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <i className="fa-solid fa-circle-check" />
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              التصنيف
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="general">عام</option>
              <option value="compliance">الامتثال البيئي</option>
              <option value="permits">التراخيص والموافقات</option>
              <option value="eia">تقييم الأثر البيئي</option>
              <option value="waste">إدارة النفايات</option>
              <option value="emissions">الانبعاثات</option>
              <option value="water">إدارة المياه</option>
              <option value="legal">قانوني / مخالفات</option>
              <option value="emergency">حادث طارئ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              درجة الأهمية
            </label>
            <div className="flex gap-3">
              {(['low', 'normal', 'high'] as const).map((p) => (
                <label key={p} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={form.priority === p}
                    onChange={() => setForm((prev) => ({ ...prev, priority: p }))}
                    className="sr-only"
                  />
                  <div className={`text-center py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    form.priority === p
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                    {PRIORITY_MAP[p].label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              وصف الحالة
              <span className="text-gray-400 font-normal ms-1">(اشرح حالتك بالتفصيل)</span>
            </label>
            <textarea
              value={form.descriptionAr}
              onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))}
              required
              rows={5}
              placeholder="اشرح حالتك بالتفصيل: نوع المنشأة، المشكلة أو السؤال، الجهة الحكومية المعنية، أي مستندات ذات صلة..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.descriptionAr.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال طلب التصعيد'}
          </button>
        </form>
      </div>

      {/* Cases history */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-5">طلباتي السابقة</h2>
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">جاري التحميل...</p>
        ) : cases.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">لا توجد طلبات سابقة.</p>
        ) : (
          <div className="space-y-4">
            {cases.map((c) => {
              const st = STATUS_MAP[c.status] || { label: c.status, cls: 'sp-badge-gray', icon: 'fa-circle' }
              const pr = PRIORITY_MAP[c.priority] || { label: c.priority, cls: 'sp-badge-gray' }
              return (
                <div key={c.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={st.cls}>
                        <i className={`fa-solid ${st.icon}`} />
                        {st.label}
                      </span>
                      <span className={pr.cls}>{pr.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{c.descriptionAr}</p>
                  {c.adminNotes && (
                    <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">ملاحظة الخبير</p>
                      <p className="text-sm text-green-800">{c.adminNotes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
