import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { PageBanner } from '@/components/marketing/page-banner'
import { SectionHeading } from '@/components/marketing/ui'
import { type Locale } from '@/lib/marketing'
import { CASE_STUDIES_DATA, CASE_STUDIES_ORDER, caseHref } from '@/lib/case-studies-data'

interface UIStrings {
  banner: { eyebrow: string; title: string; subtitle: string }
  intro: { eyebrow: string; title: string; lead: string }
  featuredLabel: string
  readCase: string
  cta: { eyebrow: string; title: string; body: string; primary: string; secondary: string }
}

const UI: Record<Locale, UIStrings> = {
  en: {
    banner: {
      eyebrow: 'Case Studies',
      title: 'Real projects across consulting, engineering, and training',
      subtitle:
        'From a national environmental ranking and high-efficiency desalination to low-carbon fuel innovation and capacity building for global organisations — work where sustainability becomes measurable.',
    },
    intro: {
      eyebrow: 'Selected work',
      title: 'Results our clients can stand behind',
      lead: 'Each engagement pairs deep technical expertise with practical delivery — spanning environmental consulting, sustainable engineering, and leadership training across the region.',
    },
    featuredLabel: 'Featured project',
    readCase: 'Read the case study',
    cta: {
      eyebrow: 'Your project next',
      title: 'Let’s turn your sustainability goals into measurable results',
      body: 'Talk to our experts or explore the platform to see how a Sustain Plus engagement could look for your organisation.',
      primary: 'Get in touch',
      secondary: 'Explore the platform',
    },
  },
  ar: {
    banner: {
      eyebrow: 'دراسات الحالة',
      title: 'مشاريع حقيقية عبر الاستشارات والهندسة والتدريب',
      subtitle:
        'من رفع التصنيف البيئي الوطني وتحلية المياه عالية الكفاءة إلى ابتكار الوقود منخفض الكربون وبناء قدرات المؤسسات العالمية — أعمال تصبح فيها الاستدامة قابلة للقياس.',
    },
    intro: {
      eyebrow: 'أعمال مختارة',
      title: 'نتائج يثق بها عملاؤنا',
      lead: 'يجمع كل مشروع بين خبرة تقنية عميقة وتنفيذ عملي — يمتد عبر الاستشارات البيئية والهندسة المستدامة وتدريب القيادات في المنطقة.',
    },
    featuredLabel: 'مشروع مميَّز',
    readCase: 'اقرأ دراسة الحالة',
    cta: {
      eyebrow: 'مشروعك التالي',
      title: 'لنحوّل أهداف استدامتك إلى نتائج قابلة للقياس',
      body: 'تحدّث مع خبرائنا أو استكشف المنصة لترى كيف يمكن أن يبدو مشروع مع ساستين بلس لمؤسستك.',
      primary: 'تواصل معنا',
      secondary: 'استكشف المنصة',
    },
  },
}

export function CaseStudiesPage({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const arrow = locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'

  const featuredSlug = 'ras-el-hekma-desalination'
  const featured = CASE_STUDIES_DATA[featuredSlug]
  const restSlugs = CASE_STUDIES_ORDER.filter((s) => s !== featuredSlug)

  const f = featured[locale]

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={t.banner.eyebrow}
        title={t.banner.title}
        subtitle={t.banner.subtitle}
      />

      {/* ── INTRO + FEATURED + GRID ── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t.intro.eyebrow}
            title={t.intro.title}
            lead={t.intro.lead}
            center
          />

          {/* Featured (large) card */}
          <Link
            href={caseHref(featuredSlug, locale)}
            data-reveal="fade-up"
            className="mt-14 group block rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[16rem] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={f.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(12,29,50,0.82) 0%, rgba(12,29,50,0.45) 60%, rgba(10,22,38,0.65) 100%)' }}
                />
                <span className="absolute top-5 start-5 inline-flex items-center gap-2 bg-white/90 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <i className={`fa-solid ${featured.icon}`} />
                  {f.category}
                </span>
                <span className="absolute bottom-5 start-5 inline-flex items-center gap-2 bg-gold-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  <i className="fa-solid fa-star" />
                  {t.featuredLabel}
                </span>
              </div>
              <div className="p-8 lg:p-10 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                  {f.title}
                </h3>
                <p className="mt-4 text-gray-500 leading-relaxed flex-1">{f.summary}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-primary-700 font-semibold text-sm border-t border-gray-100 pt-6 group-hover:gap-3 transition-all">
                  {t.readCase}
                  <i className={`fa-solid ${arrow} text-xs`} />
                </span>
              </div>
            </div>
          </Link>

          {/* Remaining cases grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restSlugs.map((slug, i) => {
              const cs = CASE_STUDIES_DATA[slug]
              const c = cs[locale]
              return (
                <Link
                  key={slug}
                  href={caseHref(slug, locale)}
                  data-reveal="fade-up"
                  style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
                  className="group rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-primary-300 hover:shadow-lg flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cs.image}
                      alt={c.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, rgba(12,29,50,0.35) 0%, rgba(12,29,50,0.78) 100%)' }}
                    />
                    <span className="absolute top-4 start-4 inline-flex items-center gap-1.5 bg-white/90 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full">
                      <i className={`fa-solid ${cs.icon}`} />
                      {c.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed flex-1">{c.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-primary-700 font-semibold text-sm group-hover:gap-3 transition-all">
                      {t.readCase}
                      <i className={`fa-solid ${arrow} text-xs`} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-sp-bg-secondary py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-600 font-semibold uppercase tracking-widest text-sm">
            {t.cta.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {t.cta.title}
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">{t.cta.body}</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={locale === 'ar' ? '/ar/contact' : '/contact'}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors shadow-lg shadow-black/10"
            >
              {t.cta.primary}
              <i className={`fa-solid ${arrow} text-sm`} />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center justify-center gap-2 border border-primary-600 text-primary-700 hover:bg-primary-50 font-semibold px-7 py-3.5 rounded-lg transition-colors"
            >
              {t.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
