'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ManagedUser = {
  id: string
  nameAr: string | null
  nameEn: string | null
  phone: string | null
  email: string
  role: 'USER' | 'EXPERT' | 'ADMIN'
  emailVerified: boolean
  isActive: boolean
}

export function AdminUserManager({ user }: { user: ManagedUser }) {
  const router = useRouter()
  const [form, setForm] = useState({
    nameAr: user.nameAr ?? '',
    nameEn: user.nameEn ?? '',
    phone: user.phone ?? '',
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
  })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function save() {
    setBusy(true); setMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: form.nameAr.trim() || undefined,
          nameEn: form.nameEn.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim().toLowerCase(),
          role: form.role,
          emailVerified: form.emailVerified,
          isActive: form.isActive,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.messageAr || 'تعذّر الحفظ.' }); return }
      setMsg({ type: 'ok', text: 'تم الحفظ.' })
      router.refresh()
    } catch { setMsg({ type: 'err', text: 'خطأ في الاتصال.' }) } finally { setBusy(false) }
  }

  async function resetPassword() {
    if (!confirm('إعادة تعيين كلمة المرور؟ سيتم توليد كلمة مرور مؤقتة وإنهاء جلسات المستخدم الحالية.')) return
    setBusy(true); setMsg(null); setTempPassword(null)
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset-password`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.messageAr || 'تعذّر إعادة التعيين.' }); return }
      setTempPassword(data.tempPassword ?? null)
      setMsg({ type: 'ok', text: 'تم توليد كلمة مرور مؤقتة.' })
    } catch { setMsg({ type: 'err', text: 'خطأ في الاتصال.' }) } finally { setBusy(false) }
  }

  async function remove() {
    if (!confirm('حذف هذا المستخدم نهائياً؟ لا يمكن التراجع.')) return
    setBusy(true); setMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setMsg({ type: 'err', text: data.messageAr || 'تعذّر الحذف.' }); return }
      router.push('/admin/users'); router.refresh()
    } catch { setMsg({ type: 'err', text: 'خطأ في الاتصال.' }) } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h2 className="text-sm font-bold text-gray-700">إدارة الحساب</h2>

      {msg && (
        <div className={`text-sm rounded-lg px-3 py-2 ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}
      {tempPassword && (
        <div className="text-sm rounded-lg px-3 py-2 bg-amber-50 text-amber-800">
          كلمة المرور المؤقتة: <code className="font-mono font-bold" dir="ltr">{tempPassword}</code> — سلّمها للمستخدم الآن، لن تظهر مجدداً.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="الاسم بالعربية"><input className={inp} value={form.nameAr} onChange={(e) => set('nameAr', e.target.value)} /></Field>
        <Field label="الاسم بالإنجليزية"><input className={inp} dir="ltr" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} /></Field>
        <Field label="البريد الإلكتروني"><input className={inp} dir="ltr" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label="الهاتف"><input className={inp} dir="ltr" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
        <Field label="الدور">
          <select className={inp} value={form.role} onChange={(e) => set('role', e.target.value as ManagedUser['role'])}>
            <option value="USER">مستخدم</option>
            <option value="EXPERT">خبير</option>
            <option value="ADMIN">مدير</option>
          </select>
        </Field>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.emailVerified} onChange={(e) => set('emailVerified', e.target.checked)} /> موثّق
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} /> نشط
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
        <button onClick={save} disabled={busy} className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
          حفظ التغييرات
        </button>
        <button onClick={resetPassword} disabled={busy} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          إعادة تعيين كلمة المرور
        </button>
        <button onClick={remove} disabled={busy} className="text-sm px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 ms-auto">
          حذف المستخدم
        </button>
      </div>
    </div>
  )
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
