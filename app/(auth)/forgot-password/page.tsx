'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Step = 'email' | 'reset' | 'done'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const masked = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (res.ok) {
        setStep('reset')
      } else {
        const data = await res.json()
        setError(data.messageAr || 'حدث خطأ. يُرجى المحاولة مجدداً.')
      }
    } catch {
      setError('حدث خطأ في الاتصال.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    setError('')
    setSuccess('')
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      setSuccess('تم إرسال كود جديد على بريدك الإلكتروني.')
    } catch {
      setError('حدث خطأ في الإرسال.')
    } finally {
      setResending(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.')
      return
    }
    if (newPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون ٨ أحرف على الأقل.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.messageAr || 'حدث خطأ. يُرجى المحاولة مجدداً.')
        return
      }
      setStep('done')
    } catch {
      setError('حدث خطأ في الاتصال.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 1: Enter email ──────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fa-solid fa-lock text-3xl text-primary-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
        <p className="text-gray-500 text-sm mb-6">
          أدخل بريدك الإلكتروني وسنرسل لك كود التحقق
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation" />
            {error}
          </div>
        )}

        <form onSubmit={handleSendCode} className="space-y-4 text-right">
          <Input
            id="email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            className="text-left"
            icon={<i className="fa-solid fa-envelope text-sm" />}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            إرسال الكود
          </Button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-400">
          <Link href="/login" className="text-primary-600 font-semibold hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

  // ── Step 2: Enter code + new password ────────────────────────────────────
  if (step === 'reset') {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fa-solid fa-key text-3xl text-primary-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-gray-500 text-sm mb-6">
          أرسلنا كود التحقق إلى{' '}
          <span className="font-medium text-gray-700" dir="ltr">{masked}</span>
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

        <form onSubmit={handleReset} className="space-y-4 text-right">
          {/* OTP input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-right">
              كود التحقق
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="أدخل الكود المكون من ٦ أرقام"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-primary-500"
              autoFocus
            />
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="٨ أحرف على الأقل"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-4 pl-10 text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                <i className={`fa-solid ${showPwd ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <Input
            id="confirmPassword"
            type="password"
            label="تأكيد كلمة المرور"
            placeholder="أعد كتابة كلمة المرور الجديدة"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            loading={loading}
            disabled={code.length !== 6 || !newPassword || !confirmPassword}
            className="w-full"
            size="lg"
          >
            تحديث كلمة المرور
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

  // ── Step 3: Success ───────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <i className="fa-solid fa-circle-check text-3xl text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">تم تحديث كلمة المرور</h1>
      <p className="text-gray-500 text-sm mb-6">
        يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
      </p>

      <Link
        href="/login"
        className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-center"
      >
        تسجيل الدخول الآن
      </Link>
    </div>
  )
}
