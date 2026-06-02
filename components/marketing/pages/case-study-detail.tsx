import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { AuroraBackground } from '@/components/animation/aurora-background'
import { PageBanner } from '@/components/marketing/page-banner'
import { type Locale } from '@/lib/marketing'
import { CASE_STUDIES_DATA, type CaseSection } from '@/lib/case-studies-data'

interface DetailStrings {
  backToList: string
  keyFacts: string
  cta: { eyebrow: string; title: string; body: string; primary: string; secondary: string }
}

const UI: Record<Locale, DetailStrings> = {
  en: {
    backToList: 'Back to all case studies',
    keyFacts: 'Key facts',
    cta: {
      eyebrow: 'Work with us',
      title: 'Ready to start a project like this?',
      body: 'Talk to our experts or explore the platform to see how a standards-aligned engagement could deliver measurable results for your organisation.',
      primary: 'Get in touch',
      secondary: 'Explore the platform',
    },
  },
  ar: {
    backToList: 'العودة إلى جميع دراسات الحالة',
    keyFacts: 'حقائق أساسية',
    cta: {
      eyebrow: 'اعمل معنا',
      title: 'جاهز لبدء مشروع مثل هذا؟',
      body: 'تحدّث مع خبرائنا أو استكشف المنصة لترى كيف يمكن لمشروع متوافق مع المعايير أن يحقّق نتائج قابلة للقياس لمؤسستك.',
      primary: 'تواصل معنا',
      secondary: 'استكشف المنصة',
    },
  },
}

function Section({ section }: { section: CaseSection }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {section.heading}
      </h2>
      <div className="mt-5 space-y-4">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="text-gray-600 leading-relaxed text-lg">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}

export function CaseStudyDetail({ slug, locale }: { slug: string; locale: Locale }) {
  const cs = CASE_STUDIES_DATA[slug]
  if (!cs) return null

  const c = cs[locale]
  const t = UI[locale]
  const arrow = locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'
  const back = locale === 'ar' ? 'fa-arrow-right' : 'fa-arrow-left'
  const listHref = locale === 'ar' ? '/ar/case-studies' : '/case-studies'

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={c.category}
        title={c.title}
        subtitle={c.subtitle}
      />

      {/* ── BODY ── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Narrative */}
            <div className="lg:col-span-7 space-y-14">
              <Section section={c.overview} />
              <Section section={c.approach} />
              <Section section={c.outcome} />
            </div>

            {/* Sidebar: media + key facts */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="relative rounded-2xl overflow-hidden h-52">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.image}
                    alt={c.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(12,29,50,0.78) 0%, rgba(12,29,50,0.42) 55%, rgba(10,22,38,0.6) 100%)' }}
                  />
                  <span className="absolute top-5 start-5 inline-flex items-center gap-2 bg-white/90 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <i className={`fa-solid ${cs.icon}`} />
                    {c.category}
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-sp-bg-secondary p-6">
                  <p className="text-sm font-semibold text-gold-600 uppercase tracking-widest">
                    {t.keyFacts}
                  </p>
                  <dl className="mt-5 space-y-5">
                    {c.facts.map((fact, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                          <i className={`fa-solid ${fact.icon} text-primary-600`} />
                        </span>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {fact.label}
                          </dt>
                          <dd className="mt-0.5 text-base font-bold text-gray-900 leading-snug">
                            {fact.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </aside>
          </div>

          {/* Back link */}
          <div className="mt-16 border-t border-gray-100 pt-8">
            <Link
              href={listHref}
              className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:gap-3 transition-all"
            >
              <i className={`fa-solid ${back} text-sm`} />
              {t.backToList}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0C1D32]" />
        <AuroraBackground conic />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <p data-reveal="fade-up" className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
            {t.cta.eyebrow}
          </p>
          <h2 data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '100ms' }} className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {t.cta.title}
          </h2>
          <p data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '200ms' }} className="mt-4 text-lg text-white/75 leading-relaxed">{t.cta.body}</p>
          <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '300ms' }} className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={locale === 'ar' ? '/ar/contact' : '/contact'}
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
