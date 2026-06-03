'use client'

import { useEffect, useState } from 'react'
import { KB_CATEGORY_LABELS } from '@/lib/constants'

interface KBEntry {
  id: string
  titleAr: string
  category: string
  status: string
  reviewer: string | null
  reviewedAt: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: 'منشور', cls: 'sp-badge-green' },
  DRAFT: { label: 'مسودة', cls: 'sp-badge-yellow' },
  ARCHIVED: { label: 'مؤرشف', cls: 'sp-badge-gray' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

const EMPTY_FORM = {
  titleAr: '',
  titleEn: '',
  contentAr: '',
  contentEn: '',
  category: 'FAQS',
  status: 'DRAFT',
  reviewer: '',
  tags: '',
  sourceNotes: '',
}

export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState<KBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadEntries = () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (filterStatus) params.set('status', filterStatus)
    if (filterCategory) params.set('category', filterCategory)

    fetch(`/api/admin/knowledge-base?${params}`)
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .finally(() => setLoading(false))
  }

  useEffect(loadEntries, [search, filterStatus, filterCategory])

  function openNew() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
    setMessage('')
  }

  function openEdit(entry: KBEntry & { contentAr?: string; contentEn?: string; sourceNotes?: string }) {
    setEditId(entry.id)
    setForm({
      titleAr: entry.titleAr,
      titleEn: '',
      contentAr: (entry as any).contentAr || '',
      contentEn: (entry as any).contentEn || '',
      category: entry.category,
      status: entry.status,
      reviewer: entry.reviewer || '',
      tags: entry.tags.join(', '),
      sourceNotes: (entry as any).sourceNotes || '',
    })
    setShowForm(true)
    setMessage('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }
      const url = editId ? `/api/admin/knowledge-base/${editId}` : '/api/admin/knowledge-base'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.messageAr || 'حدث خطأ.')
      } else {
        setShowForm(false)
        loadEntries()
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الإدخال؟')) return
    await fetch(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' })
    loadEntries()
  }

  async function quickStatus(id: string, status: string) {
    await fetch(`/api/admin/knowledge-base/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    loadEntries()
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">قاعدة المعرفة</h1>
          <p className="text-sm text-gray-400">{entries.length} إدخال</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-plus" />
          إضافة إدخال
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2 pr-9 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">كل الحالات</option>
          <option value="PUBLISHED">منشور</option>
          <option value="DRAFT">مسودة</option>
          <option value="ARCHIVED">مؤرشف</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">كل التصنيفات</option>
          {Object.entries(KB_CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.ar}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <i className="fa-solid fa-book-open text-gray-200 text-4xl mb-3" />
            <p className="text-gray-400">لا توجد إدخالات. أضف أول إدخال لقاعدة المعرفة.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-right text-gray-500 text-xs">
                  <th className="px-4 py-3 font-semibold">العنوان</th>
                  <th className="px-4 py-3 font-semibold">التصنيف</th>
                  <th className="px-4 py-3 font-semibold">الحالة</th>
                  <th className="px-4 py-3 font-semibold">المراجع</th>
                  <th className="px-4 py-3 font-semibold">آخر تحديث</th>
                  <th className="px-4 py-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map((e) => {
                  const st = STATUS_LABELS[e.status] || { label: e.status, cls: 'sp-badge-gray' }
                  const cat = KB_CATEGORY_LABELS[e.category]
                  return (
                    <tr key={e.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 max-w-xs truncate">{e.titleAr}</p>
                        {e.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {e.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{cat?.ar || e.category}</td>
                      <td className="px-4 py-3"><span className={st.cls}>{st.label}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{e.reviewer || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(e.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(e as any)}
                            className="text-xs p-1.5 text-primary-600 hover:bg-primary-50 rounded"
                            title="تعديل"
                          >
                            <i className="fa-solid fa-pen" />
                          </button>
                          {e.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => quickStatus(e.id, 'PUBLISHED')}
                              className="text-xs p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="نشر"
                            >
                              <i className="fa-solid fa-check" />
                            </button>
                          )}
                          {e.status === 'PUBLISHED' && (
                            <button
                              onClick={() => quickStatus(e.id, 'ARCHIVED')}
                              className="text-xs p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                              title="أرشفة"
                            >
                              <i className="fa-solid fa-archive" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="text-xs p-1.5 text-red-500 hover:bg-red-50 rounded"
                            title="حذف"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">
                {editId ? 'تعديل إدخال' : 'إضافة إدخال جديد'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            {message && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان (عربي)*</label>
                  <input
                    value={form.titleAr}
                    onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان (إنجليزي)</label>
                  <input
                    value={form.titleEn}
                    onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">التصنيف*</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(KB_CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.ar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الحالة</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="DRAFT">مسودة</option>
                    <option value="PUBLISHED">منشور</option>
                    <option value="ARCHIVED">مؤرشف</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">المراجع</label>
                  <input
                    value={form.reviewer}
                    onChange={(e) => setForm((p) => ({ ...p, reviewer: e.target.value }))}
                    placeholder="اسم المراجع"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">المحتوى (عربي)*</label>
                <textarea
                  value={form.contentAr}
                  onChange={(e) => setForm((p) => ({ ...p, contentAr: e.target.value }))}
                  required
                  rows={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">المحتوى (إنجليزي)</label>
                <textarea
                  value={form.contentEn}
                  onChange={(e) => setForm((p) => ({ ...p, contentEn: e.target.value }))}
                  rows={4}
                  dir="ltr"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الوسوم (مفصولة بفواصل)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="مثال: امتثال، لوائح، مصر"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">مصدر المعلومات</label>
                  <input
                    value={form.sourceNotes}
                    onChange={(e) => setForm((p) => ({ ...p, sourceNotes: e.target.value }))}
                    placeholder="مصدر، قانون، مرجع..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة الإدخال'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
