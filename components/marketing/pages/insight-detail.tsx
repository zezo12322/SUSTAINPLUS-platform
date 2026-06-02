import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { PageBanner } from '@/components/marketing/page-banner'
import { type Locale } from '@/lib/marketing'
import { INSIGHTS_DATA } from '@/lib/insights-data'

interface DetailUI {
  meta: string
  takeawaysEyebrow: string
  takeawaysTitle: string
  back: string
  cta: { eyebrow: string; title: string; body: string; primary: string; secondary: string }
}

const UI: Record<Locale, DetailUI> = {
  en: {
    meta: 'Insights',
    takeawaysEyebrow: 'In short',
    takeawaysTitle: 'Key takeaways',
    back: 'Back to all insights',
    cta: {
      eyebrow: 'Put it into practice',
      title: 'Turn this insight into action on your project',
      body: 'Talk to our experts or get an instant environmental consultation powered by our AI platform.',
      primary: 'Explore the platform',
      secondary: 'Get consultation',
    },
  },
  ar: {
    meta: 'مقالات',
    takeawaysEyebrow: 'باختصار',
    takeawaysTitle: 'أبرز النقاط',
    back: 'العودة إلى كل المقالات',
    cta: {
      eyebrow: 'طبّقها عمليًا',
      title: 'حوّل هذه الرؤية إلى إجراء على مشروعك',
      body: 'تحدث مع خبرائنا أو احصل على استشارة بيئية فورية مدعومة بمنصتنا الذكية.',
      primary: 'استكشف المنصة',
      secondary: 'احصل على استشارة',
    },
  },
}

export function InsightDetail({ slug, locale }: { slug: string; locale: Locale }) {
  const entry = INSIGHTS_DATA[slug]
  if (!entry) return null

  const t = UI[locale]
  const c = entry[locale]
  const arrow = locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'
  const backArrow = locale === 'ar' ? 'fa-arrow-right' : 'fa-arrow-left'
  const insightsHref = locale === 'ar' ? '/ar/insights' : '/insights'

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={c.categoryLabel}
        title={c.title}
        subtitle={c.excerpt}
      />

      {/* ── ARTICLE META ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 font-semibold text-gold-600">
              <i className={`fa-solid ${entry.icon} text-xs`} />
              {c.categoryLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-calendar text-gray-400 text-xs" />
              {entry.date[locale]}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-clock text-gray-400 text-xs" />
              {entry.readTime[locale]}
            </span>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="space-y-12">
            {c.body.map((sectionBlock, i) => (
              <div key={sectionBlock.heading}>
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-extrabold text-gold-600 leading-none select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-2xl font-bold leading-snug text-gray-900">
                    {sectionBlock.heading}
                  </h2>
                </div>
                <div className="mt-4 space-y-4 ps-0 sm:ps-8">
                  {sectionBlock.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-base leading-relaxed text-gray-600">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* ── KEY TAKEAWAYS ── */}
      <section className="bg-sp-bg-secondary py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              {t.takeawaysEyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-gray-900">
              {t.takeawaysTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {c.takeaways.map((tk) => (
                <li key={tk} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                    <i className="fa-solid fa-check text-xs text-primary-600" />
                  </span>
                  <span className="text-base leading-relaxed text-gray-600">{tk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href={insightsHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-all hover:gap-3"
            >
              <i className={`fa-solid ${backArrow} text-xs`} />
              {t.back}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0C1D32]" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 85% 30%, #2E5A93 0, transparent 45%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <p data-reveal="fade-up" className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            {t.cta.eyebrow}
          </p>
          <h2 data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '100ms' }} className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {t.cta.title}
          </h2>
          <p data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '200ms' }} className="mt-4 text-lg text-white/75 leading-relaxed">{t.cta.body}</p>
          <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '300ms' }} className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/platform"
              className="sheen group inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5"
            >
              {t.cta.primary}
              <i className={`fa-solid ${arrow} text-sm transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5`} />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-lg transition-colors"
            >
              {t.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
