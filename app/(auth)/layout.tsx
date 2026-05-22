import Link from 'next/link'
import { MAIN_SITE_URL } from '@/lib/constants'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex flex-col">
      {/* Header */}
      <header className="p-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S+</span>
          </div>
          <span className="text-white font-bold">سستين بلس</span>
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="p-5 text-center text-white/40 text-xs">
        <a href={MAIN_SITE_URL} className="hover:text-white/70 transition-colors">
          العودة للموقع الرئيسي
        </a>
        <span className="mx-2">·</span>
        <Link href="/trust" className="hover:text-white/70 transition-colors">
          سياسة الخصوصية
        </Link>
      </footer>
    </div>
  )
}
