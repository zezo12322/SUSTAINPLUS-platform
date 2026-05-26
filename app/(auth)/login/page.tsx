'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
      } else {
        router.push(redirect)
        router.refresh()
      }
    } catch {
      setError('حدث خطأ. يُرجى المحاولة مجدداً.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">تسجيل الدخول</h1>
        <p className="text-gray-400 text-sm">أهلاً بعودتك إلى منصة الاستشارات البيئية</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-right bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

        <Button type="submit" loading={loading} className="w-full" size="lg">
          تسجيل الدخول
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="text-primary-600 font-semibold hover:underline">
          إنشاء حساب مجاني
        </Link>
      </div>

      <div className="mt-3 text-center">
        <Link href="/trust" className="text-xs text-gray-400 hover:text-gray-600">
          سياسة الخصوصية والشروط
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
