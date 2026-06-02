import Link from 'next/link'
import { ClientLogoRails } from './client-logo-rails'
import { MarketingShell } from './marketing-chrome'
import { SectionEyebrow } from './ui'
import { MARKETING, type Locale } from '@/lib/marketing'

// Maps each home service card (by index) to its service detail-page slug.
const SERVICE_SLUGS = [
  'environmental-consulting',
  'environmental-consulting',
  'engineering-water-infrastructure',
  'engineering-water-infrastructure',
  'mining-exploration',
  'permits-training',
] as const

const INSIGHT_IMAGES: Record<string, string> = {
  'roo-desalination': '/images/projects/ras-el-hekma-desalination.jpg',
  'biogas-cogeneration': '/images/projects/blue-ethanol-production.jpg',
  'eia-egypt': '/images/projects/oman-environmental-ranking.jpg',
}

export function MarketingHome({ locale }: { locale: Locale }) {
  const dict = MARKETING[locale]
  const arrow = dict.dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'
  const localePrefix = locale === 'ar' ? '/ar' : ''
  const heroGradient = `linear-gradient(${dict.dir === 'rtl' ? 'to left' : 'to right'}, #0A1626 0%, rgba(10,22,38,0.94) 28%, rgba(10,22,38,0.6) 62%, rgba(10,22,38,0.3) 100%)`

  return (
    <MarketingShell locale={locale}>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section id="home" className="relative overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-[#0A1626]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/hero-industry.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Navy tint + directional fade so the copy side stays solid and the photo reads on the far side */}
          <div className="absolute inset-0 bg-[#0A1626]/55" />
          <div className="absolute inset-0" style={{ background: heroGradient }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-20 lg:pb-28">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Copy */}
              <div className="lg:col-span-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight max-w-3xl">
                  {dict.hero.title}{' '}
                  <span className="text-gold-400">{dict.hero.titleAccent}</span>
                </h1>
                <p className="mt-6 text-lg text-white/75 max-w-xl leading-relaxed">
                  {dict.hero.subtitle}
                </p>

                <div className="mt-9 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors shadow-lg shadow-black/20"
                  >
                    {dict.cta.explore}
                    <i className={`fa-solid ${arrow} text-sm`} />
                  </a>
                  <Link
                    href="/platform"
                    className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-lg border border-white/40 transition-colors"
                  >
                    {dict.cta.consult}
                  </Link>
                </div>

                {/* ISO badges */}
                <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {dict.hero.isoBadges.map((b, i) => (
                    <div
                      key={b.line1 + b.line2}
                      className={`flex flex-col leading-tight ${
                        i > 0 ? 'sm:ps-8 sm:border-s sm:border-white/20' : ''
                      }`}
                    >
                      <span className="text-white font-bold text-sm tracking-wide">{b.line1}</span>
                      <span className="text-white/55 text-xs">{b.line2}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillars */}
              <div className="lg:col-span-4">
                <ul className="space-y-6">
                  {dict.hero.pillars.map((p) => (
                    <li key={p.title} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-11 h-11 rounded-full border border-white/25 bg-white/5 flex items-center justify-center">
                        <i className={`fa-solid ${p.icon} text-gold-400`} />
                      </span>
                      <div>
                        <p className="text-white font-semibold">{p.title}</p>
                        <p className="text-white/60 text-sm leading-snug">{p.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div className="relative border-t border-white/10 bg-[#0A1626]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10 rtl:lg:divide-x-reverse">
                {dict.stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-4 px-2 sm:px-6 py-7">
                    <i className={`fa-solid ${s.icon} text-gold-400 text-2xl sm:text-3xl`} />
                    <div>
                      <p className="text-white text-2xl sm:text-3xl font-extrabold leading-none">{s.value}</p>
                      <p className="text-white/60 text-xs sm:text-sm mt-1">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── SERVICES + CASE STUDY ───────────────── */}
        <section id="services" className="bg-white py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10">
              {/* Services */}
              <div className="lg:col-span-8">
                <SectionEyebrow text={dict.services.eyebrow} />
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {dict.services.items.map((s, i) => (
                    <Link
                      key={s.title}
                      href={`${localePrefix}/services/${SERVICE_SLUGS[i] ?? SERVICE_SLUGS[0]}`}
                      className="group rounded-xl border border-gray-100 bg-white p-5 hover:border-primary-200 hover:shadow-md transition-all"
                    >
                      <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                        <i className={`fa-solid ${s.icon} text-primary-600`} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{s.title}</h3>
                      <p className="text-gray-500 text-xs mt-2 leading-relaxed">{s.meta}</p>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`${localePrefix}/services`}
                  className="mt-8 inline-flex items-center gap-2 text-gold-600 font-semibold text-sm hover:gap-3 transition-all"
                >
                  {dict.services.viewAll}
                  <i className={`fa-solid ${arrow} text-xs`} />
                </Link>
              </div>

              {/* Case study */}
              <div id="case-study" className="lg:col-span-4">
                <SectionEyebrow text={dict.caseStudy.eyebrow} />
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg border border-primary-100 bg-white h-[calc(100%-3.5rem)] flex flex-col">
                  <div className="h-48 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/projects/ras-el-hekma-desalination.jpg"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D32]/70 via-[#0C1D32]/20 to-transparent" />
                    <span className="absolute top-4 start-4 bg-white text-primary-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {dict.caseStudy.tag}
                    </span>
                  </div>
                  <div className="text-primary-950 p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg leading-snug">{dict.caseStudy.title}</h3>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed flex-1">
                      {dict.caseStudy.body}
                    </p>
                    <Link
                      href={`${localePrefix}/case-studies/ras-el-hekma-desalination`}
                      className="mt-5 inline-flex items-center gap-2 text-gold-600 font-semibold text-sm hover:gap-3 transition-all"
                    >
                      {dict.caseStudy.cta}
                      <i className={`fa-solid ${arrow} text-xs`} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── INSIGHTS ───────────────────────── */}
        <section id="insights" className="bg-sp-bg-secondary py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionEyebrow text={dict.insights.eyebrow} />
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">{dict.insights.title}</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {dict.insights.items.map((a) => (
                <Link
                  key={a.title}
                  href={`${localePrefix}/insights/${a.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 relative overflow-hidden bg-primary-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={INSIGHT_IMAGES[a.slug] ?? '/images/hero/hero-industry.jpg'}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1D32]/75 via-[#0C1D32]/20 to-transparent" />
                    <span className="absolute bottom-4 start-4 text-xs font-semibold text-white bg-[#0C1D32]/70 border border-white/15 px-2.5 py-1 rounded-full">
                      {a.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                      {a.title}
                    </h3>
                    <p className="mt-3 text-xs text-gray-400">{a.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── CLIENTS ───────────────────────── */}
        <section id="clients" className="bg-white py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
              {dict.clients.eyebrow}
            </p>
            <div className="mx-auto mt-4 h-px w-24 bg-gold-400" />
            <ClientLogoRails locale={locale} />
          </div>
        </section>

        {/* ───────────────────────── CONTACT CTA ───────────────────────── */}
        <section id="contact" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0C1D32]" />
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 85% 30%, #2E5A93 0, transparent 45%)',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{dict.contact.title}</h2>
            <p className="mt-4 text-white/75 text-lg">{dict.contact.subtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/platform"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
              >
                {dict.contact.cta}
                <i className={`fa-solid ${arrow} text-sm`} />
              </Link>
            </div>
          </div>
        </section>
    </MarketingShell>
  )
}
