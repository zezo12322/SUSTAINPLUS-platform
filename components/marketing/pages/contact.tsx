'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MarketingShell } from '@/components/marketing/marketing-chrome'
import { PageBanner } from '@/components/marketing/page-banner'
import { SectionHeading } from '@/components/marketing/ui'
import { type Locale } from '@/lib/marketing'
import { COMPANY } from '@/lib/company'

interface ContactContent {
  banner: { eyebrow: string; title: string; subtitle: string }
  form: {
    eyebrow: string
    title: string
    lead: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    companyLabel: string
    companyPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submit: string
    optional: string
    privacy: string
    successTitle: string
    successBody: string
    successAgain: string
  }
  details: {
    title: string
    lead: string
    emailLabel: string
    phoneLabel: string
    officeLabel: string
    hoursLabel: string
    hours: string
    socialLabel: string
    aiNoteTitle: string
    aiNoteBody: string
  }
  ai: {
    eyebrow: string
    title: string
    lead: string
    bullets: { icon: string; text: string }[]
    button: string
    secondary: string
    panelTitle: string
    panelDesc: string
  }
  faq: {
    eyebrow: string
    title: string
    lead: string
    items: { question: string; answer: string }[]
  }
}

const CONTENT: Record<Locale, ContactContent> = {
  en: {
    banner: {
      eyebrow: 'Contact',
      title: "Let's talk about your sustainability goals",
      subtitle:
        'Whether you need environmental consulting, water and energy infrastructure, or compliance and training, our experts are ready to help. Tell us about your project and we will be in touch.',
    },
    form: {
      eyebrow: 'Send a Message',
      title: 'Tell us about your project',
      lead: 'Fill in the form and one of our specialists will get back to you, usually within one business day.',
      nameLabel: 'Full name',
      namePlaceholder: 'Your name',
      emailLabel: 'Work email',
      emailPlaceholder: 'you@company.com',
      companyLabel: 'Company',
      companyPlaceholder: 'Your organization',
      messageLabel: 'How can we help?',
      messagePlaceholder: 'Briefly describe your sustainability, water, or environmental needs…',
      submit: 'Send message',
      optional: 'optional',
      privacy: 'We respect your privacy. Your details are used only to respond to your enquiry.',
      successTitle: 'Thank you — we will be in touch',
      successBody:
        'Your message has reached our team. A specialist will reach out shortly, usually within one business day.',
      successAgain: 'Send another message',
    },
    details: {
      title: 'Reach us directly',
      lead: 'Prefer to talk to us another way? Use any of the channels below.',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      officeLabel: 'Office',
      hoursLabel: 'Working hours',
      hours: 'Sunday – Thursday · 9:00 AM – 5:00 PM (EET)',
      socialLabel: 'Follow us',
      aiNoteTitle: 'Need an answer right now?',
      aiNoteBody:
        'Skip the wait — our AI environmental consultant can answer your questions instantly, any time of day.',
    },
    ai: {
      eyebrow: 'Instant Help',
      title: 'Get an instant AI environmental consultation',
      lead: 'Our AI assistant is trained on environmental standards and ESG frameworks. Ask about carbon footprint, LCA, water, reporting, or compliance and get clear answers in seconds — no appointment needed.',
      bullets: [
        { icon: 'fa-bolt', text: 'Instant answers, available 24/7' },
        { icon: 'fa-shield-halved', text: 'Grounded in recognized standards' },
        { icon: 'fa-comments', text: 'Free your team to escalate complex cases to our experts' },
      ],
      button: 'Start AI consultation',
      secondary: 'Or send us a message above',
      panelTitle: 'AI Environmental Consultant',
      panelDesc:
        'GHG Protocol · ISO 14064 · ISO 14040/44 · ESG reporting — at your fingertips.',
    },
    faq: {
      eyebrow: 'Before You Reach Out',
      title: 'Frequently asked questions',
      lead: 'A few quick answers to help you decide how best to get in touch.',
      items: [
        {
          question: 'How quickly will I hear back?',
          answer:
            'We aim to respond to every enquiry within one business day. For urgent questions, the AI environmental consultant can give you reliable answers instantly, around the clock.',
        },
        {
          question: 'What kind of projects do you take on?',
          answer:
            'Environmental consulting, water and energy infrastructure, mining exploration, and permits and training — from study and design through to long-term operation, aligned with the UN Sustainable Development Goals.',
        },
        {
          question: 'Where are you based?',
          answer:
            'Our office is in Sidi Gaber, Alexandria, Egypt. We support clients across the region, with delivery in Egypt, Oman, and the UAE.',
        },
        {
          question: 'Do you work with clients outside Egypt?',
          answer:
            'Yes. While we are based in Alexandria, we serve clients across the wider region and can engage remotely or on-site depending on the project.',
        },
      ],
    },
  },
  ar: {
    banner: {
      eyebrow: 'تواصل معنا',
      title: 'لنتحدث عن أهدافك في الاستدامة',
      subtitle:
        'سواء كنت بحاجة إلى استشارات بيئية أو بنية تحتية للمياه والطاقة أو امتثال وتدريب، فإن خبراءنا جاهزون لمساعدتك. أخبرنا عن مشروعك وسنتواصل معك.',
    },
    form: {
      eyebrow: 'أرسل رسالة',
      title: 'أخبرنا عن مشروعك',
      lead: 'املأ النموذج وسيعاود أحد متخصصينا التواصل معك، عادةً خلال يوم عمل واحد.',
      nameLabel: 'الاسم بالكامل',
      namePlaceholder: 'اسمك',
      emailLabel: 'البريد الإلكتروني للعمل',
      emailPlaceholder: 'you@company.com',
      companyLabel: 'الشركة',
      companyPlaceholder: 'اسم مؤسستك',
      messageLabel: 'كيف يمكننا مساعدتك؟',
      messagePlaceholder: 'صف باختصار احتياجاتك في الاستدامة أو المياه أو البيئة…',
      submit: 'إرسال الرسالة',
      optional: 'اختياري',
      privacy: 'نحترم خصوصيتك. تُستخدم بياناتك فقط للرد على استفسارك.',
      successTitle: 'شكراً لك — سنتواصل معك قريباً',
      successBody:
        'وصلت رسالتك إلى فريقنا. سيتواصل معك أحد المتخصصين قريباً، عادةً خلال يوم عمل واحد.',
      successAgain: 'إرسال رسالة أخرى',
    },
    details: {
      title: 'تواصل معنا مباشرةً',
      lead: 'تفضّل التواصل بطريقة أخرى؟ استخدم أياً من القنوات التالية.',
      emailLabel: 'البريد الإلكتروني',
      phoneLabel: 'الهاتف',
      officeLabel: 'المكتب',
      hoursLabel: 'ساعات العمل',
      hours: 'الأحد – الخميس · 9:00 صباحاً – 5:00 مساءً (بتوقيت القاهرة)',
      socialLabel: 'تابعنا',
      aiNoteTitle: 'تحتاج إجابة فورية؟',
      aiNoteBody:
        'لا داعي للانتظار — يمكن لمستشارنا البيئي الذكي الإجابة عن أسئلتك فوراً، في أي وقت من اليوم.',
    },
    ai: {
      eyebrow: 'مساعدة فورية',
      title: 'احصل على استشارة بيئية فورية بالذكاء الاصطناعي',
      lead: 'تم تدريب مساعدنا الذكي على المعايير البيئية وأطر الحوكمة البيئية. اسأل عن البصمة الكربونية أو تقييم دورة الحياة أو المياه أو التقارير أو الامتثال واحصل على إجابات واضحة في ثوانٍ — دون موعد مسبق.',
      bullets: [
        { icon: 'fa-bolt', text: 'إجابات فورية ومتاحة على مدار الساعة' },
        { icon: 'fa-shield-halved', text: 'مبنية على معايير معتمدة' },
        { icon: 'fa-comments', text: 'يتيح لفريقك تصعيد الحالات المعقدة إلى خبرائنا' },
      ],
      button: 'ابدأ الاستشارة الذكية',
      secondary: 'أو أرسل لنا رسالة في الأعلى',
      panelTitle: 'المستشار البيئي الذكي',
      panelDesc: 'بروتوكول GHG · ISO 14064 · ISO 14040/44 · تقارير ESG — بين يديك.',
    },
    faq: {
      eyebrow: 'قبل أن تتواصل',
      title: 'الأسئلة الشائعة',
      lead: 'بعض الإجابات السريعة لمساعدتك على اختيار أفضل طريقة للتواصل معنا.',
      items: [
        {
          question: 'كم يستغرق الرد على استفساري؟',
          answer:
            'نحرص على الرد على كل استفسار خلال يوم عمل واحد. وللأسئلة العاجلة، يمكن للمستشار البيئي الذكي تقديم إجابات موثوقة فوراً وعلى مدار الساعة.',
        },
        {
          question: 'ما نوع المشاريع التي تتولّونها؟',
          answer:
            'الاستشارات البيئية، والبنية التحتية للمياه والطاقة، واستكشاف التعدين، والتصاريح والتدريب — من الدراسة والتصميم وصولاً إلى التشغيل طويل الأمد، بما يتوافق مع أهداف التنمية المستدامة للأمم المتحدة.',
        },
        {
          question: 'أين يقع مقركم؟',
          answer:
            'يقع مكتبنا في سيدي جابر بالإسكندرية، مصر. ونخدم العملاء في عموم المنطقة، مع تنفيذ مشاريع في مصر وعُمان والإمارات.',
        },
        {
          question: 'هل تعملون مع عملاء خارج مصر؟',
          answer:
            'نعم. رغم أن مقرنا في الإسكندرية، فإننا نخدم العملاء في عموم المنطقة ويمكننا العمل عن بُعد أو في الموقع حسب طبيعة المشروع.',
        },
      ],
    },
  },
}

export function ContactPage({ locale }: { locale: Locale }) {
  const c = CONTENT[locale]
  const isAr = locale === 'ar'
  const arrow = isAr ? 'fa-arrow-left' : 'fa-arrow-right'
  const [submitted, setSubmitted] = useState(false)

  const address = isAr ? COMPANY.addressAr : COMPANY.address

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <MarketingShell locale={locale}>
      <PageBanner
        locale={locale}
        eyebrow={c.banner.eyebrow}
        title={c.banner.title}
        subtitle={c.banner.subtitle}
      />

      {/* ───────────────────────── FORM + DETAILS ───────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT — Contact form */}
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow={c.form.eyebrow}
                title={c.form.title}
                lead={c.form.lead}
              />

              <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                      <i className="fa-solid fa-circle-check text-primary-600 text-3xl" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900">
                      {c.form.successTitle}
                    </h3>
                    <p className="mt-3 text-gray-500 leading-relaxed max-w-md mx-auto">
                      {c.form.successBody}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 inline-flex items-center justify-center gap-2 text-primary-700 font-semibold text-sm hover:gap-3 transition-all"
                    >
                      <i className="fa-solid fa-rotate-left text-xs" />
                      {c.form.successAgain}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          {c.form.nameLabel}
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          placeholder={c.form.namePlaceholder}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          {c.form.emailLabel}
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder={c.form.emailPlaceholder}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {c.form.companyLabel}{' '}
                        <span className="font-normal text-gray-400">({c.form.optional})</span>
                      </label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        placeholder={c.form.companyPlaceholder}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {c.form.messageLabel}
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        placeholder={c.form.messagePlaceholder}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      {c.form.submit}
                      <i className={`fa-solid ${arrow} text-sm`} />
                    </button>

                    <p className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                      <i className="fa-solid fa-lock mt-0.5" />
                      <span>{c.form.privacy}</span>
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT — Contact details (real) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-100 bg-sp-bg-secondary p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900">{c.details.title}</h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{c.details.lead}</p>

                <ul className="mt-7 space-y-5">
                  {/* Email */}
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                      <i className="fa-solid fa-envelope text-primary-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {c.details.emailLabel}
                      </p>
                      <a
                        href={`mailto:${COMPANY.email}`}
                        dir="ltr"
                        className="mt-0.5 block font-semibold text-gray-900 hover:text-primary-700 transition-colors break-words text-start"
                      >
                        {COMPANY.email}
                      </a>
                    </div>
                  </li>

                  {/* Phones (two real numbers) */}
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                      <i className="fa-solid fa-phone text-primary-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {c.details.phoneLabel}
                      </p>
                      {COMPANY.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          dir="ltr"
                          className="mt-0.5 block font-semibold text-gray-900 hover:text-primary-700 transition-colors text-start"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </li>

                  {/* Office address */}
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                      <i className="fa-solid fa-location-dot text-primary-600" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {c.details.officeLabel}
                      </p>
                      <p className="mt-0.5 font-semibold text-gray-900 leading-relaxed">
                        {address}
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-7 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {c.details.hoursLabel}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-700">{c.details.hours}</p>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {c.details.socialLabel}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={COMPANY.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-colors"
                    >
                      <i className="fa-brands fa-facebook-f" />
                    </a>
                    <a
                      href={COMPANY.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-colors"
                    >
                      <i className="fa-brands fa-linkedin-in" />
                    </a>
                  </div>
                </div>
              </div>

              {/* AI quick-answer note */}
              <div className="mt-6 rounded-2xl bg-[#0C1D32] p-6 text-white">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <i className="fa-solid fa-robot text-gold-400" />
                  </span>
                  <div>
                    <h3 className="font-bold leading-snug">{c.details.aiNoteTitle}</h3>
                    <p className="mt-2 text-sm text-white/75 leading-relaxed">
                      {c.details.aiNoteBody}
                    </p>
                    <Link
                      href="/platform"
                      className="mt-4 inline-flex items-center gap-2 text-gold-400 font-semibold text-sm hover:gap-3 transition-all"
                    >
                      {c.ai.button}
                      <i className={`fa-solid ${arrow} text-xs`} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section className="bg-sp-bg-secondary py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={c.faq.eyebrow}
            title={c.faq.title}
            lead={c.faq.lead}
            center
          />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {c.faq.items.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-7 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <i className="fa-solid fa-circle-question text-primary-600" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 leading-snug">{item.question}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── AI CONSULTATION ───────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow={c.ai.eyebrow} title={c.ai.title} lead={c.ai.lead} />

              <ul className="mt-8 space-y-4">
                {c.ai.bullets.map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mt-0.5">
                      <i className={`fa-solid ${b.icon} text-primary-600 text-sm`} />
                    </span>
                    <span className="text-gray-600 leading-relaxed">{b.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href="/platform"
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors"
                >
                  {c.ai.button}
                  <i className={`fa-solid ${arrow} text-sm`} />
                </Link>
                <span className="text-sm text-gray-400">{c.ai.secondary}</span>
              </div>
            </div>

            {/* Gradient panel */}
            <div className="lg:col-span-6">
              <div
                className="relative rounded-3xl overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-end p-8"
                style={{
                  background: 'linear-gradient(135deg, #0A1626 0%, #16335C 55%, #2E5A93 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-15 flex items-center justify-center">
                  <i className="fa-solid fa-comments text-white text-[9rem]" />
                </div>
                <div className="relative">
                  <span className="inline-flex w-12 h-12 rounded-xl bg-white/10 border border-white/20 items-center justify-center mb-5">
                    <i className="fa-solid fa-robot text-gold-400 text-lg" />
                  </span>
                  <h3 className="text-white font-bold text-xl leading-snug">
                    {c.ai.panelTitle}
                  </h3>
                  <p className="mt-3 text-white/75 text-sm leading-relaxed">{c.ai.panelDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  )
}
