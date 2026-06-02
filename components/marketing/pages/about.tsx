import Link from 'next/link'
import { ClientLogoRails } from '@/components/marketing/client-logo-rails'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { PageBanner } from '@/components/marketing/page-banner'
import { SectionHeading, Eyebrow, Card } from '@/components/marketing/ui'
import { CountUp } from '@/components/animation/count-up'
import { AuroraBackground } from '@/components/animation/aurora-background'
import { type Locale } from '@/lib/marketing'
import { COMPANY, ABOUT, STATS, CREDENTIALS } from '@/lib/company'

interface AboutUI {
  banner: { eyebrow: string; title: string }
  who: { eyebrow: string; title: string }
  vm: {
    eyebrow: string
    title: string
    lead: string
    visionLabel: string
    missionLabel: string
  }
  values: { eyebrow: string; title: string; lead: string }
  stats: { eyebrow: string; title: string; lead: string }
  clients: { eyebrow: string; title: string; lead: string; note: string }
  cta: { eyebrow: string; title: string; subtitle: string; button: string }
  sdgCard: { title: string; body: string }
}

const UI: Record<Locale, AboutUI> = {
  en: {
    banner: {
      eyebrow: 'About Sustain Plus',
      title: 'Engineering sustainable communities, aligned with the UN SDGs',
    },
    who: {
      eyebrow: 'Who We Are',
      title: 'A leading environmental and engineering partner',
    },
    vm: {
      eyebrow: 'Vision & Mission',
      title: 'What drives us forward',
      lead: 'A clear purpose and a practical mandate guide everything we design, build, and deliver.',
      visionLabel: 'Our Vision',
      missionLabel: 'Our Mission',
    },
    values: {
      eyebrow: 'What We Stand For',
      title: 'The values behind every project',
      lead: 'Three principles shape how we work with partners, communities, and the environment.',
    },
    stats: {
      eyebrow: 'Our Impact',
      title: 'Capabilities that turn ambition into measurable outcomes',
      lead: 'Across waste, water, and clean energy, our infrastructure delivers tangible results in the markets we serve.',
    },
    clients: {
      eyebrow: 'Trusted Partners',
      title: 'Who we work with',
      lead: 'We partner with leading industrial, energy, FMCG, engineering, and consulting organizations across the region.',
      note: 'Selected partners and clients.',
    },
    cta: {
      eyebrow: 'Get started',
      title: 'Ready to turn sustainability into measurable value?',
      subtitle:
        'Talk to our experts or get an instant environmental consultation powered by our AI platform.',
      button: 'Explore the platform',
    },
    sdgCard: {
      title: 'Aligned with the UN SDGs',
      body: 'We align every project with the UN Sustainable Development Goals to deliver high-impact water and environmental infrastructure solutions.',
    },
  },
  ar: {
    banner: {
      eyebrow: 'عن ساستين بلس',
      title: 'نهندس مجتمعات مستدامة بما يتوافق مع أهداف التنمية المستدامة',
    },
    who: {
      eyebrow: 'من نحن',
      title: 'شريك بيئي وهندسي رائد',
    },
    vm: {
      eyebrow: 'الرؤية والرسالة',
      title: 'ما الذي يقودنا إلى الأمام',
      lead: 'هدف واضح ورسالة عملية يوجّهان كل ما نصممه وننفّذه ونقدّمه.',
      visionLabel: 'رؤيتنا',
      missionLabel: 'رسالتنا',
    },
    values: {
      eyebrow: 'ما نؤمن به',
      title: 'القيم التي تقف خلف كل مشروع',
      lead: 'ثلاثة مبادئ تشكّل أسلوب عملنا مع الشركاء والمجتمعات والبيئة.',
    },
    stats: {
      eyebrow: 'أثرنا',
      title: 'قدرات تحوّل الطموح إلى نتائج قابلة للقياس',
      lead: 'عبر النفايات والمياه والطاقة النظيفة، تحقق بنيتنا التحتية نتائج ملموسة في الأسواق التي نخدمها.',
    },
    clients: {
      eyebrow: 'شركاء موثوقون',
      title: 'من نعمل معهم',
      lead: 'نتشارك مع مؤسسات رائدة في الصناعة والطاقة والسلع الاستهلاكية والهندسة والاستشارات في المنطقة.',
      note: 'نخبة من الشركاء والعملاء.',
    },
    cta: {
      eyebrow: 'ابدأ الآن',
      title: 'جاهز لتحويل الاستدامة إلى قيمة قابلة للقياس؟',
      subtitle: 'تحدث مع خبرائنا أو احصل على استشارة بيئية فورية مدعومة بمنصتنا الذكية.',
      button: 'استكشف المنصة',
    },
    sdgCard: {
      title: 'متوائمون مع أهداف التنمية المستدامة',
      body: 'نوائم كل مشروع مع أهداف التنمية المستدامة للأمم المتحدة لتقديم حلول بنية تحتية مائية وبيئية عالية الأثر.',
    },
  },
}

export function AboutPage({ locale }: { locale: Locale }) {
  const t = UI[locale]
  const isAr = locale === 'ar'
  const arrow = isAr ? 'fa-arrow-left' : 'fa-arrow-right'

  const whoWeAre = isAr ? ABOUT.whoWeAreAr : ABOUT.whoWeAreEn
  const vision = isAr ? ABOUT.visionAr : ABOUT.visionEn
  const mission = isAr ? ABOUT.missionAr : ABOUT.missionEn
  const tagline = isAr ? COMPANY.taglineAr : COMPANY.taglineEn

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={t.banner.eyebrow}
        title={t.banner.title}
        subtitle={whoWeAre}
      />

      {/* ───────────────────────── WHO WE ARE ───────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow={t.who.eyebrow} title={t.who.title} />
              <p className="mt-6 text-gray-600 leading-relaxed text-lg">{whoWeAre}</p>
              <p className="mt-4 font-semibold text-primary-700 leading-relaxed">{tagline}</p>
              <div className="mt-6 inline-flex items-start gap-3 rounded-xl border border-gold-500/40 bg-primary-50 px-4 py-3">
                <i className="fa-solid fa-award text-gold-600 mt-0.5" />
                <span className="text-sm text-primary-800 leading-relaxed">
                  {isAr ? CREDENTIALS.ar : CREDENTIALS.en}
                </span>
              </div>
            </div>

            {/* Gradient image block */}
            <div className="lg:col-span-5">
              <div
                className="relative rounded-3xl overflow-hidden shadow-xl min-h-[320px] flex flex-col justify-end p-8"
                style={{
                  background: 'linear-gradient(135deg, #0A1626 0%, #16335C 55%, #2E5A93 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-15 flex items-center justify-center">
                  <i className="fa-solid fa-seedling text-white text-[10rem]" />
                </div>
                <div className="relative">
                  <span className="inline-flex w-12 h-12 rounded-xl bg-white/10 border border-white/20 items-center justify-center mb-5">
                    <i className="fa-solid fa-earth-africa text-gold-400 text-lg" />
                  </span>
                  <h3 className="text-white font-bold text-xl leading-snug">{t.sdgCard.title}</h3>
                  <p className="mt-3 text-white/75 text-sm leading-relaxed">{t.sdgCard.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── VISION & MISSION ───────────────────────── */}
      <section className="bg-sp-bg-secondary py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t.vm.eyebrow}
            title={t.vm.title}
            lead={t.vm.lead}
            center
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <i className="fa-solid fa-binoculars text-primary-600 text-lg" />
              </div>
              <h3 className="mt-5 font-bold text-gray-900 text-lg">{t.vm.visionLabel}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{vision}</p>
            </Card>
            <Card>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <i className="fa-solid fa-bullseye text-primary-600 text-lg" />
              </div>
              <h3 className="mt-5 font-bold text-gray-900 text-lg">{t.vm.missionLabel}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{mission}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CORE VALUES ───────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t.values.eyebrow}
            title={t.values.title}
            lead={t.values.lead}
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABOUT.values.map((v) => {
              const content = isAr ? v.ar : v.en
              return (
                <Card key={content.title}>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <i className={`fa-solid ${v.icon} text-primary-600 text-lg`} />
                  </div>
                  <h3 className="mt-5 font-bold text-gray-900 text-lg">{content.title}</h3>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{content.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────── STATS BAND ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#0C1D32]">
        <AuroraBackground conic />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
              {t.stats.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {t.stats.title}
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed">{t.stats.lead}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div
                key={s.value + s.en}
                data-reveal="fade-up"
                style={{ ['--reveal-delay' as string]: `${i * 110}ms` }}
                className="group rounded-2xl border border-white/15 bg-white/5 p-6 flex items-center gap-4 transition-colors hover:border-gold-400/40 hover:bg-white/[0.08]"
              >
                <i className={`fa-solid ${s.icon} text-gold-400 text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110`} />
                <div>
                  <p className="text-white text-2xl sm:text-3xl font-extrabold leading-none">
                    <CountUp value={s.value} />
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 leading-snug">
                    {isAr ? s.ar : s.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── WHO WE WORK WITH ───────────────────────── */}
      <section id="clients" className="bg-white py-20 lg:py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal="fade-up" className="text-center max-w-2xl mx-auto">
            <Eyebrow>{t.clients.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {t.clients.title}
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">{t.clients.lead}</p>
          </div>

          <ClientLogoRails locale={locale} compact />

          <p className="mt-6 text-center text-xs text-gray-400">{t.clients.note}</p>
        </div>
      </section>

      {/* ───────────────────────── CLOSING CTA ───────────────────────── */}
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
          <p data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '200ms' }} className="mt-4 text-white/75 text-lg leading-relaxed">{t.cta.subtitle}</p>
          <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '300ms' }} className="mt-9 flex justify-center">
            <Link
              href="/platform"
              className="sheen group inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5"
            >
              {t.cta.button}
              <i className={`fa-solid ${arrow} text-sm transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5`} />
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
