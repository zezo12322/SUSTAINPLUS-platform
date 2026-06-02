'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export function PlatformHeader() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo.png" alt="Sustain Plus" height={38} width={130} className="object-contain" priority />
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/pricing"
              className="px-3 py-2 text-sm text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
            >
              الأسعار
            </Link>
            <Link
              href="/trust"
              className="px-3 py-2 text-sm text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
            >
              الأمان والخصوصية
            </Link>
            <Link
              href="/ar"
              className="px-3 py-2 text-sm text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
            >
              الموقع الرئيسي
            </Link>
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-user text-primary-600 text-xs" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {session.user.name}
                  </span>
                  <i className="fa-solid fa-chevron-down text-xs text-gray-400" />
                </button>

                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fa-solid fa-gauge w-4 text-primary-600" />
                      لوحة التحكم
                    </Link>
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fa-solid fa-comments w-4 text-primary-600" />
                      استشاراتي
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fa-solid fa-credit-card w-4 text-primary-600" />
                      اشتراكي
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket w-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  ابدأ مجاناً
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
