import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { PageBanner } from '@/components/marketing/page-banner'
import { SectionHeading, IconBadge } from '@/components/marketing/ui'
import { type Locale } from '@/lib/marketing'
import { SERVICES_DATA } from '@/lib/services-data'

interface DetailUI {
  eyebrow: string
  introEyebrow: string
  capsEyebrow: string
  capsTitle: string
  processEyebrow: string
  processTitle: string
  processLead: string
  metricsEyebrow: string
  metricsTitle: string
  back: string
  cta: { title: string; body: string; primary: string; secondary: string }
}

const UI: Record<Locale, DetailUI> = {
  en: {
    eyebrow: 'Our Services',
    introEyebrow: 'Overview',
    capsEyebrow: 'Capabilities',
    capsTitle: 'What this service covers',
    processEyebrow: 'How we deliver',
    processTitle: 'A structured delivery process',
    processLead: 'Every engagement follows a clear, staged path from first study to final outcome.',
    metricsEyebrow: 'Proven performance',
    metricsTitle: 'Results that speak for themselves',
    back: 'Back to all services',
    cta: {
      title: 'Let’s scope your project',
      body: 'Talk to our experts or get an instant environmental consultation powered by our AI platform.',
      primary: 'Explore the platform',
      secondary: 'Get consultation',
    },
  },
  ar: {
    eyebrow: 'خدماتنا',
    introEyebrow: 'نظرة عامة',
    capsEyebrow: 'القدرات',
    capsTitle: 'ما الذي تغطّيه هذه الخدمة',
    processEyebrow: 'كيف ننفّذ',
    processTitle: 'منهجية تنفيذ منظّمة',
    processLead: 'يتبع كل مشروع مساراً واضحاً ومرحلياً من أول دراسة حتى النتيجة النهائية.',
    metricsEyebrow: 'أداء مثبت',
    metricsTitle: 'نتائج تتحدث عن نفسها',
    back: 'العودة إلى كل الخدمات',
    cta: {
      title: 'لنحدّد نطاق مشروعك',
      body: 'تحدث مع خبرائنا أو احصل على استشارة بيئية فورية مدعومة بمنصتنا الذكية.',
      primary: 'استكشف المنصة',
      secondary: 'احصل على استشارة',
    },
  },
}

export function ServiceDetail({ slug, locale }: { slug: string; locale: Locale }) {
  const entry = SERVICES_DATA[slug]
  if (!entry) return null

  const t = UI[locale]
  const c = entry[locale]
  const arrow = locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'
  const backArrow = locale === 'ar' ? 'fa-arrow-right' : 'fa-arrow-left'
  const servicesHref = locale === 'ar' ? '/ar/services' : '/services'
  const contactHref = locale === 'ar' ? '/ar/contact' : '/contact'

  return (
    <MarketingShell locale={locale}>
      <PageBanner locale={locale} eyebrow={t.eyebrow} title={c.title} subtitle={c.summary} />

      {/* ── INTRO ── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-gold-600 uppercase tracking-widest">
            {t.introEyebrow}
          </p>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">{c.intro}</p>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="bg-sp-bg-secondary py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t.capsEyebrow} title={t.capsTitle} center />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {entry.capabilities.map((cap) => {
              const cc = cap[locale]
              return (
                <div
                  key={cc.title}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <IconBadge icon={cap.icon} />
                  <h3 className="mt-5 text-lg font-bold text-gray-900 leading-snug">
                    {cc.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{cc.desc}</p>
                  {cap.highlights && cap.highlights.length > 0 && (
                    <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                      {cap.highlights.map((h) => (
                        <li
                          key={h.en}
                          className="flex items-start gap-2.5 text-sm text-gray-600"
                        >
                          <i className="fa-solid fa-circle-check text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{h[locale]}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS TIMELINE ── */}
      {entry.process && entry.process.length > 0 && (
        <section className="bg-white py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={t.processEyebrow}
              title={t.processTitle}
              lead={t.processLead}
              center
            />

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {entry.process.map((step, i) => {
                const sc = step[locale]
                return (
                  <div
                    key={sc.title}
                    className="relative rounded-2xl border border-gray-100 bg-white p-6 hover:border-primary-200 hover:shadow-md transition-all"
                  >
                    <span className="absolute top-5 end-5 text-4xl font-extrabold text-primary-100 leading-none select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      <i className={`fa-solid ${step.icon} text-primary-600 text-lg`} />
                    </div>
                    <h3 className="mt-5 text-base font-bold text-gray-900 leading-snug">
                      {sc.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">{sc.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── METRICS ── */}
      {entry.metrics && entry.metrics.length > 0 && (
        <section className="bg-sp-bg-secondary py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow={t.metricsEyebrow} title={t.metricsTitle} center />

            <div
              className={`mt-14 grid grid-cols-1 sm:grid-cols-2 ${
                entry.metrics.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2 max-w-3xl mx-auto'
              } gap-6`}
            >
              {entry.metrics.map((m) => (
                <div
                  key={m.en}
                  className="rounded-2xl border border-gray-100 bg-white p-7 text-center hover:shadow-md transition-all"
                >
                  <p className="text-3xl lg:text-4xl font-extrabold text-gold-600 leading-none">
                    {m.value}
                  </p>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{m[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BACK LINK + CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0C1D32]" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 85% 30%, #2E5A93 0, transparent 45%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <h2 data-reveal="fade-up" className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {t.cta.title}
          </h2>
          <p data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '120ms' }} className="mt-4 text-lg text-white/75 leading-relaxed">{t.cta.body}</p>
          <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '240ms' }} className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/platform"
              className="sheen group inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5"
            >
              {t.cta.primary}
              <i className={`fa-solid ${arrow} text-sm transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5`} />
            </Link>
            <Link
              href={contactHref}
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-lg transition-colors"
            >
              {t.cta.secondary}
            </Link>
          </div>
          <div className="mt-10">
            <Link
              href={servicesHref}
              className="inline-flex items-center gap-2 text-gold-400 font-semibold text-sm hover:gap-3 transition-all"
            >
              <i className={`fa-solid ${backArrow} text-xs`} />
              {t.back}
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
