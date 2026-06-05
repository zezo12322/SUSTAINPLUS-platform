import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { AuroraBackground } from '@/components/animation/aurora-background'
import { PageBanner } from '@/components/marketing/page-banner'
import { SectionHeading, Card, IconBadge } from '@/components/marketing/ui'
import { type Locale } from '@/lib/marketing'
import { SERVICES_DATA, SERVICES_ORDER } from '@/lib/services-data'

interface ServicesUI {
  banner: { eyebrow: string; title: string; subtitle: string }
  intro: { eyebrow: string; title: string; lead: string }
  learnMore: string
  cta: { eyebrow: string; title: string; body: string; primary: string; secondary: string }
}

const UI: Record<Locale, ServicesUI> = {
  en: {
    banner: {
      eyebrow: 'Our Services',
      title: 'Engineering, consulting, and compliance for a sustainable world',
      subtitle:
        'Five integrated service areas — environmental consulting, environmental awareness, water and energy infrastructure, mining exploration, and permits and training — delivered by our experts from study through to long-term operation.',
    },
    intro: {
      eyebrow: 'What we do',
      title: 'Five service areas, one integrated partner',
      lead: 'Each area pairs deep technical capability with international standards and real project delivery — so you can plan, build, comply, and report with confidence.',
    },
    learnMore: 'Explore this service',
    cta: {
      eyebrow: 'Get started',
      title: 'Ready to turn sustainability into measurable value?',
      body: 'Talk to our experts or get an instant environmental consultation powered by our AI platform.',
      primary: 'Explore the platform',
      secondary: 'Get consultation',
    },
  },
  ar: {
    banner: {
      eyebrow: 'خدماتنا',
      title: 'هندسة واستشارات وامتثال من أجل عالم مستدام',
      subtitle:
        'خمسة مجالات خدمات متكاملة — الاستشارات البيئية، والتوعية البيئية، والبنية التحتية للمياه والطاقة، واستكشاف التعدين، والتصاريح والتدريب — يقدّمها خبراؤنا من مرحلة الدراسة وصولاً إلى التشغيل طويل الأمد.',
    },
    intro: {
      eyebrow: 'ماذا نقدّم',
      title: 'خمسة مجالات خدمات وشريك واحد متكامل',
      lead: 'يجمع كل مجال بين قدرة فنية عميقة ومعايير دولية وتنفيذ مشاريع حقيقي — لتتمكن من التخطيط والبناء والامتثال وإعداد التقارير بثقة.',
    },
    learnMore: 'استكشف هذه الخدمة',
    cta: {
      eyebrow: 'ابدأ الآن',
      title: 'جاهز لتحويل الاستدامة إلى قيمة قابلة للقياس؟',
      body: 'تحدث مع خبرائنا أو احصل على استشارة بيئية فورية مدعومة بمنصتنا الذكية.',
      primary: 'استكشف المنصة',
      secondary: 'احصل على استشارة',
    },
  },
}

export function ServicesPage({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const arrow = locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'
  const base = locale === 'ar' ? '/ar/services' : '/services'
  const contactHref = locale === 'ar' ? '/ar/contact' : '/contact'

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={t.banner.eyebrow}
        title={t.banner.title}
        subtitle={t.banner.subtitle}
      />

      {/* ── SERVICES GRID ── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t.intro.eyebrow}
            title={t.intro.title}
            lead={t.intro.lead}
            center
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES_ORDER.map((slug) => {
              const entry = SERVICES_DATA[slug]
              const c = entry[locale]
              return (
                <Card key={slug} className="flex flex-col">
                  <IconBadge icon={entry.icon} />
                  <h3 className="mt-5 text-xl font-bold text-gray-900 leading-snug">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{c.summary}</p>
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 border-t border-gray-100 pt-5">
                    {entry.cardBullets.map((b) => (
                      <li
                        key={b.en}
                        className="flex items-start gap-2.5 text-sm text-gray-600"
                      >
                        <i className="fa-solid fa-circle-check text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{b[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${base}/${slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-primary-700 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    {t.learnMore}
                    <i className={`fa-solid ${arrow} text-xs`} />
                  </Link>
                </Card>
              )
            })}
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
        </div>
      </section>
    </MarketingShell>
  )
}
