import Link from 'next/link'
import Image from 'next/image'
import { MAIN_SITE_URL } from '@/lib/constants'
import { BackgroundPathsLayer } from '@/components/ui/background-paths'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex flex-col">
      {/* Animated brand background */}
      <BackgroundPathsLayer strokes={['#c8a368', '#8ba2c4']} className="z-0 opacity-60" />

      {/* Header */}
      <header className="relative z-10 p-5">
        <Link href="/" className="inline-flex items-center">
          <div className="bg-white rounded-xl px-3 py-1.5">
            <Image src="/logo.png" alt="Sustain Plus" height={30} width={105} className="object-contain" priority />
          </div>
        </Link>
      </header>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-5 text-center text-white/40 text-xs">
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
