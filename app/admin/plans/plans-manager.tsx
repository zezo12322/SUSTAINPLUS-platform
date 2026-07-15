'use client'

import { useEffect, useState } from 'react'

type Plan = {
  id: string
  slug: string
  nameAr: string
  nameEn: string
  pricePiasters: number
  consultationsPerMonth: number
  maxUsers: number
  featuresAr: string[]
  featuresEn: string[]
  isActive: boolean
  sortOrder: number
  _count?: { subscriptions: number }
}

const empty = {
  slug: '', nameAr: '', nameEn: '', pricePiasters: 0, consultationsPerMonth: 0,
  maxUsers: 1, featuresAr: '', featuresEn: '', isActive: true, sortOrder: 0,
}

export function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null) // plan id or 'new'
  const [form, setForm] = useState<typeof empty>(empty)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/plans')
    const data = await res.json()
    setPlans(data.plans || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function startNew() { setForm(empty); setEditing('new'); setMsg(null) }
  function startEdit(p: Plan) {
    setForm({
      slug: p.slug, nameAr: p.nameAr, nameEn: p.nameEn, pricePiasters: p.pricePiasters,
      consultationsPerMonth: p.consultationsPerMonth, maxUsers: p.maxUsers,
      featuresAr: p.featuresAr.join('\n'), featuresEn: p.featuresEn.join('\n'),
      isActive: p.isActive, sortOrder: p.sortOrder,
    })
    setEditing(p.id); setMsg(null)
  }

  async function save() {
    setBusy(true); setMsg(null)
    const payload = {
      ...form,
      pricePiasters: Number(form.pricePiasters),
      consultationsPerMonth: Number(form.consultationsPerMonth),
      maxUsers: Number(form.maxUsers),
      sortOrder: Number(form.sortOrder),
      featuresAr: form.featuresAr.split('\n').map((s) => s.trim()).filter(Boolean),
      featuresEn: form.featuresEn.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    const isNew = editing === 'new'
    const res = await fetch(isNew ? '/api/admin/plans' : `/api/admin/plans/${editing}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? payload : { ...payload, slug: undefined }),
    })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) { setMsg(data.messageAr || 'تعذّر الحفظ.'); return }
    setEditing(null); load()
  }

  async function remove(p: Plan) {
    if (!confirm(`حذف خطة "${p.nameAr}"؟`)) return
    const res = await fetch(`/api/admin/plans/${p.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.messageAr || 'تعذّر الحذف.'); return }
    load()
  }

  const egp = (piasters: number) => piasters < 0 ? 'حسب الاستخدام' : `${(piasters / 100).toFixed(0)} ج.م`
  const quota = (n: number) => n < 0 ? 'حسب الاستخدام' : `${n}/شهر`

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={startNew} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700">
          + خطة جديدة
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">جارِ التحميل...</p>
      ) : (
        <div className="grid gap-3">
          {plans.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{p.nameAr}</span>
                  <span className="text-xs text-gray-400" dir="ltr">{p.slug}</span>
                  {!p.isActive && <span className="sp-badge-gray">معطّلة</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {egp(p.pricePiasters)} · {quota(p.consultationsPerMonth)} · {p._count?.subscriptions ?? 0} مشترك
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">تعديل</button>
                <button onClick={() => remove(p)} className="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-3">{editing === 'new' ? 'خطة جديدة' : 'تعديل الخطة'}</h3>
            {msg && <div className="text-sm bg-red-50 text-red-600 rounded-lg px-3 py-2 mb-3">{msg}</div>}
            <div className="grid sm:grid-cols-2 gap-3">
              {editing === 'new' && <F label="المعرّف (slug)"><input className={inp} dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></F>}
              <F label="الاسم عربي"><input className={inp} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></F>
              <F label="الاسم إنجليزي"><input className={inp} dir="ltr" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></F>
              <F label="السعر (قرش، -1 لحسب الاستخدام)"><input type="number" className={inp} value={form.pricePiasters} onChange={(e) => setForm({ ...form, pricePiasters: e.target.value as any })} /></F>
              <F label="استشارات/شهر (-1 لحسب الاستخدام)"><input type="number" className={inp} value={form.consultationsPerMonth} onChange={(e) => setForm({ ...form, consultationsPerMonth: e.target.value as any })} /></F>
              <F label="أقصى مستخدمين"><input type="number" className={inp} value={form.maxUsers} onChange={(e) => setForm({ ...form, maxUsers: e.target.value as any })} /></F>
              <F label="الترتيب"><input type="number" className={inp} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value as any })} /></F>
              <F label="مميزات (عربي، سطر لكل ميزة)"><textarea className={inp} rows={3} value={form.featuresAr} onChange={(e) => setForm({ ...form, featuresAr: e.target.value })} /></F>
              <F label="مميزات (إنجليزي)"><textarea className={inp} rows={3} dir="ltr" value={form.featuresEn} onChange={(e) => setForm({ ...form, featuresEn: e.target.value })} /></F>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 mt-3">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> مفعّلة
            </label>
            <div className="flex gap-2 mt-4">
              <button onClick={save} disabled={busy} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">حفظ</button>
              <button onClick={() => setEditing(null)} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500'
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>{children}</div>
}
