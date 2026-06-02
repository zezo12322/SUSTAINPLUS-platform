'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

async function computeFingerprint(): Promise<string | null> {
  try {
    const parts = [
      navigator.userAgent,
      navigator.language,
      `${screen.width}x${screen.height}x${screen.colorDepth}`,
      String(navigator.hardwareConcurrency || ''),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ]
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.font = '14px Arial'
        ctx.fillText('sustainplus', 2, 14)
        parts.push(canvas.toDataURL().slice(-30))
      }
    } catch {}
    const raw = parts.join('|')
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return null
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const fingerprintRef = useRef<string | null>(null)

  useEffect(() => {
    computeFingerprint().then(fp => { fingerprintRef.current = fp })
  }, [])

  const [form, setForm] = useState({
    nameAr: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.')
      return
    }
    if (form.password.length < 8) {
      setError('كلمة المرور يجب أن تكون ٨ أحرف على الأقل.')
      return
    }
    if (!agree) {
      setError('يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.')
      return
    }

    setLoading(true)
    try {
      const fp = fingerprintRef.current ?? await computeFingerprint()

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: form.nameAr.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          privacyConsent: agree,
          termsAccepted: agree,
          fingerprint: fp,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.messageAr || 'حدث خطأ. يُرجى المحاولة مجدداً.')
        return
      }

      // Auto sign-in then go to email verification
      await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      })

      router.push('/verify-email')
      router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال. يُرجى المحاولة مجدداً.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-pop-in bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">إنشاء حساب مجاني</h1>
        <p className="text-gray-400 text-sm">٣ استشارات بيئية مجانية في انتظارك</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="nameAr"
          type="text"
          label="الاسم"
          placeholder="اسمك الكامل"
          value={form.nameAr}
          onChange={update('nameAr')}
          required
          icon={<i className="fa-solid fa-user text-sm" />}
        />

        <Input
          id="email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@company.com"
          value={form.email}
          onChange={update('email')}
          required
          dir="ltr"
          className="text-left"
          icon={<i className="fa-solid fa-envelope text-sm" />}
        />

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
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

        <Input
          id="confirmPassword"
          type="password"
          label="تأكيد كلمة المرور"
          placeholder="أعد كتابة كلمة المرور"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          required
        />

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-600">
            أوافق على{' '}
            <Link href="/trust#terms" className="text-primary-600 hover:underline font-medium">
              الشروط والأحكام
            </Link>{' '}
            و{' '}
            <Link href="/trust" className="text-primary-600 hover:underline font-medium">
              سياسة الخصوصية
            </Link>
          </span>
        </label>

        <Button type="submit" loading={loading} disabled={!agree} className="w-full" size="lg">
          إنشاء الحساب
        </Button>
      </form>

      {/* Disclaimer */}
      <div className="mt-5 bg-gray-50 rounded-lg p-3 text-xs text-gray-400 text-center leading-relaxed">
        ردود المنصة إرشادية وليست شهادات رسمية أو تراخيص حكومية.
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        لديك حساب بالفعل؟{' '}
        <Link href="/login" className="text-primary-600 font-semibold hover:underline">
          تسجيل الدخول
        </Link>
      </div>
    </div>
  )
}
