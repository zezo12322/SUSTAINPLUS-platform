'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MarketingDict, Locale } from '@/lib/marketing'

export function MarketingHeader({ dict, locale }: { dict: MarketingDict; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || '/'
  const home = locale === 'ar' ? '/ar' : '/'

  // Same page in the other language.
  const otherLangHref =
    locale === 'ar'
      ? pathname.replace(/^\/ar(?=\/|$)/, '') || '/'
      : '/ar' + (pathname === '/' ? '' : pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      dir={dict.dir}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={home} className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scrolled ? '/logo-color.png' : '/logo-on-dark.png'}
              alt="Sustain Plus"
              className="object-contain h-9 lg:h-11 w-auto transition"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {dict.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/platform"
              className="hidden sm:inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-4 lg:px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              {dict.cta.consult}
              <i className={`fa-solid ${dict.dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`} />
            </Link>

            <Link
              href={otherLangHref}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                scrolled
                  ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <i className="fa-solid fa-globe text-xs" />
              {dict.langSwitchLabel}
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'} text-lg`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {dict.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/platform"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-primary-700 text-white font-semibold px-4 py-3 rounded-lg"
            >
              {dict.cta.consult}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
