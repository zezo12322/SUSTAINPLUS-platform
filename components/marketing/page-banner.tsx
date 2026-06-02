import type { Locale } from '@/lib/marketing'
import { AuroraBackground } from '@/components/animation/aurora-background'

/**
 * Dark-navy page banner used as the top of every marketing subpage.
 * Sits under the fixed header and matches the homepage hero treatment
 * (industrial photo + navy directional fade).
 */
export function PageBanner({
  locale,
  eyebrow,
  title,
  subtitle,
}: {
  locale: Locale
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const gradient = `linear-gradient(${dir === 'rtl' ? 'to left' : 'to right'}, #0A1626 0%, rgba(10,22,38,0.92) 40%, rgba(10,22,38,0.7) 100%)`

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A1626]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/hero-industry.jpg"
        alt=""
        aria-hidden="true"
        className="hero-bg-zoom absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0A1626]/55" />
      <div className="absolute inset-0" style={{ background: gradient }} />
      {/* Living animated background */}
      <AuroraBackground intensity="soft" conic />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-16 lg:pb-20">
        {eyebrow && (
          <p className="hero-rise text-gold-400 font-semibold uppercase tracking-widest text-sm mb-3">
            {eyebrow}
          </p>
        )}
        <h1
          className="hero-rise text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-3xl"
          style={{ ['--hero-delay' as string]: '110ms' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="hero-rise mt-5 text-lg text-white/75 max-w-2xl leading-relaxed"
            style={{ ['--hero-delay' as string]: '230ms' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
