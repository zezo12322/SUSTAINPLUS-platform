'use client'

import { useEffect, useState } from 'react'
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from '@/lib/specializations'

interface Expert {
  id: string
  title: string | null
  specializations: string[]
  isActive: boolean
  user: { id: string; nameAr: string | null; email: string }
}
interface Candidate {
  id: string
  nameAr: string | null
  email: string
}

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  // promotion form
  const [userId, setUserId] = useState('')
  const [title, setTitle] = useState('')
  const [specs, setSpecs] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function load() {
    fetch('/api/admin/experts')
      .then((r) => r.json())
      .then((d) => {
        setExperts(d.experts || [])
        setCandidates(d.candidates || [])
      })
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    load()
  }, [])

  function toggleSpec(list: string[], key: string) {
    return list.includes(key) ? list.filter((s) => s !== key) : [...list, key]
  }

  async function promote(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: title || undefined, specializations: specs }),
      })
      if (res.ok) {
        setMsg('تمت ترقية المستخدم لخبير.')
        setUserId('')
        setTitle('')
        setSpecs([])
        load()
      } else {
        setMsg('تعذّرت الترقية.')
      }
    } finally {
      setSaving(false)
    }
  }

  async function patchExpert(id: string, body: Record<string, unknown>) {
    await fetch(`/api/admin/experts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    load()
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">إدارة الخبراء</h1>
      <p className="text-sm text-gray-400 mb-6">ترقية المستخدمين لخبراء وإدارة تخصصاتهم.</p>

      {/* Promote */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-gray-800 mb-4">ترقية مستخدم لخبير</h2>
        {msg && <p className="text-sm text-green-600 mb-3">{msg}</p>}
        <form onSubmit={promote} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">المستخدم</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">— اختر مستخدماً —</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.nameAr || 'بدون اسم') + ' — ' + c.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">المسمّى (اختياري)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استشاري بيئي أول"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">التخصصات</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => setSpecs((prev) => toggleSpec(prev, s.key))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    specs.includes(s.key)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {s.labelAr}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !userId}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'جاري...' : 'ترقية لخبير'}
          </button>
        </form>
      </div>

      {/* Experts list */}
      <h2 className="font-bold text-gray-800 mb-4">الخبراء الحاليون</h2>
      {loading ? (
        <p className="text-sm text-gray-400 py-8 text-center">جاري التحميل...</p>
      ) : experts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          لا يوجد خبراء بعد.
        </div>
      ) : (
        <div className="space-y-4">
          {experts.map((ex) => (
            <div key={ex.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{ex.user.nameAr || ex.user.email}</p>
                  <p className="text-xs text-gray-400">
                    {ex.user.email}
                    {ex.title ? ` · ${ex.title}` : ''}
                  </p>
                </div>
                <span className={ex.isActive ? 'sp-badge-green' : 'sp-badge-gray'}>
                  {ex.isActive ? 'نشط' : 'موقوف'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {SPECIALIZATIONS.map((s) => {
                  const on = ex.specializations.includes(s.key)
                  return (
                    <button
                      key={s.key}
                      onClick={() =>
                        patchExpert(ex.id, {
                          specializations: on
                            ? ex.specializations.filter((k) => k !== s.key)
                            : [...ex.specializations, s.key],
                        })
                      }
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        on
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {s.labelAr}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => patchExpert(ex.id, { isActive: !ex.isActive })}
                  className="text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg"
                >
                  {ex.isActive ? 'إيقاف' : 'تفعيل'}
                </button>
                <button
                  onClick={() => patchExpert(ex.id, { demote: true })}
                  className="text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg"
                >
                  إلغاء صفة الخبير
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-gray-400">
        التخصصات تُستخدم لاقتراح الخبير الأنسب عند إسناد الحالات (في صفحة حالات الخبراء).
      </p>
    </div>
  )
}
