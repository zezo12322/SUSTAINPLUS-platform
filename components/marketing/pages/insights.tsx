'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { PageBanner } from '@/components/marketing/page-banner'
import { SectionHeading, Eyebrow } from '@/components/marketing/ui'
import { type Locale } from '@/lib/marketing'
import {
  INSIGHTS_DATA,
  INSIGHTS_ORDER,
  INSIGHT_CATEGORY_LABELS,
  type InsightEntry,
} from '@/lib/insights-data'

interface InsightsUI {
  banner: { eyebrow: string; title: string; subtitle: string }
  filterLabel: string
  allLabel: string
  featuredTag: string
  grid: { eyebrow: string; title: string; lead: string; empty: string }
  readArticle: string
  readFull: string
  newsletter: {
    eyebrow: string
    title: string
    body: string
    placeholder: string
    button: string
    consent: string
    success: string
  }
}

const UI: Record<Locale, InsightsUI> = {
  en: {
    banner: {
      eyebrow: 'Insights',
      title: 'Practical sustainability thinking for industry leaders',
      subtitle:
        'Field-tested perspectives from our environmental and engineering experts on water, energy, ESG, regulation, the circular economy, and carbon — written to help you measure, decide, and build with confidence.',
    },
    filterLabel: 'Browse by topic',
    allLabel: 'All',
    featuredTag: 'Featured',
    grid: {
      eyebrow: 'Latest articles',
      title: 'From our experts',
      lead: 'Standards-aligned, practitioner-written analysis grounded in the work we deliver — no greenwashing, no jargon for its own sake.',
      empty: 'No articles in this topic yet — check back soon or browse another topic.',
    },
    readArticle: 'Read article',
    readFull: 'Read the full article',
    newsletter: {
      eyebrow: 'Stay informed',
      title: 'Get our sustainability insights in your inbox',
      body: 'A focused monthly briefing on water, energy, ESG, and decarbonization — written for decision-makers in industry. No spam, unsubscribe anytime.',
      placeholder: 'you@company.com',
      button: 'Subscribe',
      consent:
        'By subscribing you agree to receive occasional emails from Sustain Plus. We respect your privacy.',
      success: 'Thanks — you are on the list. Watch your inbox for our next briefing.',
    },
  },
  ar: {
    banner: {
      eyebrow: 'مقالات',
      title: 'رؤى عملية في الاستدامة لقادة الصناعة',
      subtitle:
        'وجهات نظر مُختبَرة ميدانيًا من خبرائنا البيئيين والهندسيين حول المياه والطاقة والحوكمة البيئية والتشريعات والاقتصاد الدائري والكربون — كُتبت لتساعدك على القياس واتخاذ القرار والبناء بثقة.',
    },
    filterLabel: 'تصفّح حسب الموضوع',
    allLabel: 'الكل',
    featuredTag: 'مقال مميز',
    grid: {
      eyebrow: 'أحدث المقالات',
      title: 'بقلم خبرائنا',
      lead: 'تحليلات مطابقة للمعايير ومكتوبة بأيدي ممارسين ومستندة إلى أعمالنا الفعلية — بلا تجميل بيئي زائف ولا مصطلحات بلا فائدة.',
      empty: 'لا توجد مقالات في هذا الموضوع بعد — عُد قريبًا أو تصفّح موضوعًا آخر.',
    },
    readArticle: 'اقرأ المقال',
    readFull: 'اقرأ المقال كاملًا',
    newsletter: {
      eyebrow: 'ابقَ على اطّلاع',
      title: 'احصل على رؤى الاستدامة في بريدك',
      body: 'نشرة شهرية مركّزة حول المياه والطاقة والحوكمة البيئية وخفض الكربون — مكتوبة لصنّاع القرار في الصناعة. بلا إزعاج، ويمكنك إلغاء الاشتراك في أي وقت.',
      placeholder: 'you@company.com',
      button: 'اشترك',
      consent:
        'بالاشتراك فإنك توافق على تلقّي رسائل بريدية من حين لآخر من ساستين بلس. نحن نحترم خصوصيتك.',
      success: 'شكرًا لك — تم تسجيلك في القائمة. ترقّب نشرتنا القادمة في بريدك.',
    },
  },
}

/** Distinct canonical categories in display order. */
const CATEGORY_ORDER: InsightEntry['category'][] = (() => {
  const seen = new Set<InsightEntry['category']>()
  const out: InsightEntry['category'][] = []
  for (const slug of INSIGHTS_ORDER) {
    const cat = INSIGHTS_DATA[slug].category
    if (!seen.has(cat)) {
      seen.add(cat)
      out.push(cat)
    }
  }
  return out
})()

export function InsightsPage({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const arrow = locale === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'
  const base = locale === 'ar' ? '/ar/insights' : '/insights'

  const [activeCategory, setActiveCategory] = useState<'All' | InsightEntry['category']>('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Featured = the first article in display order.
  const featuredSlug = INSIGHTS_ORDER[0]
  const featured = INSIGHTS_DATA[featuredSlug]
  const featuredContent = featured[locale]

  // Remaining articles, filtered by the active category chip.
  const gridSlugs = INSIGHTS_ORDER.filter((slug) => slug !== featuredSlug).filter((slug) =>
    activeCategory === 'All' ? true : INSIGHTS_DATA[slug].category === activeCategory,
  )

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={t.banner.eyebrow}
        title={t.banner.title}
        subtitle={t.banner.subtitle}
      />

      {/* ───────────────── CATEGORY FILTER + FEATURED ───────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter chips */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Eyebrow>{t.filterLabel}</Eyebrow>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeCategory === 'All'
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {t.allLabel}
              </button>
              {CATEGORY_ORDER.map((cat) => {
                const active = cat === activeCategory
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700'
                    }`}
                  >
                    {INSIGHT_CATEGORY_LABELS[locale][cat]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Featured article */}
          <Link
            href={`${base}/${featuredSlug}`}
            className="group mt-10 grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md lg:grid-cols-2"
          >
            <div
              className="relative min-h-[260px] lg:min-h-[400px]"
              style={{ background: featured.gradient }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <i className={`fa-solid ${featured.icon} text-7xl text-white`} />
              </div>
              <span className="absolute top-5 start-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-800">
                {t.featuredTag}
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-600">
                  {featuredContent.categoryLabel}
                </span>
                <span className="text-xs text-gray-400">{featured.readTime[locale]}</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-700 lg:text-3xl">
                {featuredContent.title}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500">{featuredContent.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-400">{featured.date[locale]}</span>
                <span className="inline-flex items-center gap-2 font-semibold text-primary-700 transition-all group-hover:gap-3">
                  {t.readFull}
                  <i className={`fa-solid ${arrow} text-xs`} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ───────────────── ARTICLE GRID ───────────────── */}
      <section className="bg-sp-bg-secondary py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t.grid.eyebrow} title={t.grid.title} lead={t.grid.lead} />

          {gridSlugs.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
              {t.grid.empty}
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {gridSlugs.map((slug) => {
                const entry = INSIGHTS_DATA[slug]
                const c = entry[locale]
                return (
                  <Link
                    key={slug}
                    href={`${base}/${slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="relative h-44" style={{ background: entry.gradient }}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <i className={`fa-solid ${entry.icon} text-5xl text-white`} />
                      </div>
                      <span className="absolute top-4 start-4 rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-600">
                        {c.categoryLabel}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{entry.date[locale]}</span>
                        <span className="text-gray-300">•</span>
                        <span>{entry.readTime[locale]}</span>
                      </div>
                      <h3 className="mt-3 font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
                        {c.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                        {c.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-all group-hover:gap-3">
                        {t.readArticle}
                        <i className={`fa-solid ${arrow} text-xs`} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ───────────────── NEWSLETTER ───────────────── */}
      <section className="relative overflow-hidden bg-[#0C1D32]">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 85% 25%, #2E5A93 0, transparent 45%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">
            {t.newsletter.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            {t.newsletter.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/75">
            {t.newsletter.body}
          </p>

          {subscribed ? (
            <div className="mx-auto mt-8 inline-flex max-w-md items-center gap-3 rounded-lg border border-gold-400/40 bg-white/10 px-6 py-4 text-start">
              <i className="fa-solid fa-circle-check text-xl text-gold-400" />
              <span className="text-sm font-medium text-white">{t.newsletter.success}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {t.newsletter.placeholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/50 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-primary-400"
              >
                {t.newsletter.button}
                <i className={`fa-solid ${arrow} text-sm`} />
              </button>
            </form>
          )}

          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-white/50">
            {t.newsletter.consent}
          </p>
        </div>
      </section>
    </MarketingShell>
  )
}
