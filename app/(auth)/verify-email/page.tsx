'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const email = session?.user?.email || ''

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.messageAr || 'الكود غير صحيح.')
        return
      }

      await update({ emailVerified: true })
      window.location.href = '/dashboard'
    } catch {
      setError('حدث خطأ. يُرجى المحاولة مجدداً.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' })
      if (res.ok) setSuccess('تم إرسال كود جديد على بريدك الإلكتروني.')
      else setError('حدث خطأ في الإرسال.')
    } catch {
      setError('حدث خطأ في الاتصال.')
    } finally {
      setResending(false)
    }
  }

  const masked = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)

  return (
    <div className="animate-pop-in bg-white rounded-2xl shadow-2xl p-8 text-center">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <i className="fa-solid fa-envelope-circle-check text-3xl text-primary-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">تأكيد بريدك الإلكتروني</h1>
      <p className="text-gray-500 text-sm mb-6">
        أرسلنا كود التأكيد إلى <span className="font-medium text-gray-700" dir="ltr">{masked}</span>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-check" />
          {success}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="أدخل الكود المكون من ٦ أرقام"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-primary-500"
          autoFocus
        />

        <Button type="submit" loading={loading} disabled={code.length !== 6} className="w-full" size="lg">
          تأكيد الحساب
        </Button>
      </form>

      <div className="mt-5 text-sm text-gray-500">
        لم يصلك الكود؟{' '}
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-primary-600 font-semibold hover:underline disabled:opacity-50"
        >
          {resending ? 'جاري الإرسال...' : 'إعادة الإرسال'}
        </button>
      </div>
    </div>
  )
}
