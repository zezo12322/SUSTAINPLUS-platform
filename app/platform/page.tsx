import Link from 'next/link'
import { PlatformHeader } from '@/components/layout/platform-header'
import { PlatformFooter } from '@/components/layout/platform-footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'منصة الاستشارات البيئية الذكية',
  description: 'احصل على إجابات فورية لأسئلتك البيئية من منصة ساستين بلس، مدعومة بقاعدة معرفة مراجعة من خبراء بيئيين.',
}

const features = [
  {
    icon: 'fa-brain',
    title: 'ذكاء اصطناعي بيئي متخصص',
    desc: 'نظام استشاري ذكي مدرَّب على قاعدة معرفة ساستين بلس واللوائح البيئية المصرية.',
  },
  {
    icon: 'fa-book-open',
    title: 'قاعدة معرفة مراجعة',
    desc: 'كل إجابة مستندة إلى محتوى مراجع ومحدَّث من متخصصي ساستين بلس.',
  },
  {
    icon: 'fa-user-tie',
    title: 'تصعيد سهل للخبراء',
    desc: 'للحالات المعقدة التي تحتاج رأياً رسمياً، يمكنك التواصل المباشر مع خبير بضغطة زر.',
  },
  {
    icon: 'fa-shield-halved',
    title: 'آمن وخاص',
    desc: 'محادثاتك مشفرة وخاصة. لا نشاركها مع أي طرف ثالث.',
  },
  {
    icon: 'fa-clock-rotate-left',
    title: 'سجل المحادثات',
    desc: 'احتفظ بتاريخ استشاراتك كاملاً للرجوع إليها في أي وقت.',
  },
  {
    icon: 'fa-globe',
    title: 'تغطية شاملة',
    desc: 'من الامتثال البيئي إلى تقييم الأثر البيئي، نغطي جميع مجالات البيئة والاستدامة.',
  },
]

const categories = [
  { icon: 'fa-industry', label: 'الامتثال البيئي' },
  { icon: 'fa-trash-can', label: 'إدارة النفايات' },
  { icon: 'fa-wind', label: 'الانبعاثات' },
  { icon: 'fa-droplet', label: 'إدارة المياه' },
  { icon: 'fa-file-lines', label: 'تقييم الأثر البيئي' },
  { icon: 'fa-leaf', label: 'الاستدامة' },
  { icon: 'fa-gavel', label: 'اللوائح المصرية' },
  { icon: 'fa-chart-bar', label: 'تقارير الاستدامة' },
]

export default function ConsultationLanding() {
  return (
    <>
      <PlatformHeader />

      <main>
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0C1D32 0%, #16335C 50%, #1F4A7A 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-20 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">مدعوم بخبرة ساستين بلس وذكاء اصطناعي متخصص</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              استشارتك البيئية
              <br />
              <span className="text-gold-400">في ثوانٍ، لا أيام</span>
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              اطرح أسئلتك البيئية وحصل على إجابات فورية مستندة إلى خبرة متخصصي ساستين بلس.
              من الامتثال البيئي إلى تقييم الأثر، نحن هنا.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="fa-solid fa-rocket" />
                ابدأ مجاناً الآن
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
              >
                <i className="fa-solid fa-tag" />
                عرض الأسعار
              </Link>
            </div>

            <p className="mt-6 text-white/50 text-sm">
              ٣ استشارات مجانية بدون بطاقة ائتمان
            </p>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              نغطي جميع مجالات البيئة
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <i className={`fa-solid ${cat.icon} text-xs`} />
                  {cat.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                لماذا منصة ساستين بلس؟
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                الجمع بين الذكاء الاصطناعي وخبرة المتخصصين يمنحك أفضل استشارة بيئية.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <i className={`fa-solid ${f.icon} text-primary-600 text-lg`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                كيف يعمل النظام؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '١', title: 'اطرح سؤالك', desc: 'اكتب استفسارك البيئي بالعربية أو الإنجليزية باختصار أو تفصيل.', icon: 'fa-pen-to-square' },
                { step: '٢', title: 'يبحث النظام', desc: 'يستعرض قاعدة معرفة ساستين بلس ويولّد إجابة مخصصة لحالتك.', icon: 'fa-magnifying-glass' },
                { step: '٣', title: 'إجابة متخصصة', desc: 'تصلك إجابة مفصلة. وإذا احتجت خبيراً بشرياً، زر التصعيد في متناولك.', icon: 'fa-circle-check' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
                    <i className={`fa-solid ${s.icon} text-white text-xl`} />
                  </div>
                  <p className="text-3xl font-bold text-gold-500 mb-2">{s.step}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ── */}
        <section className="py-8 bg-sp-bg-secondary border-y border-gold-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <i className="fa-solid fa-circle-info text-gold-600" />
              <span className="font-bold text-primary-800 text-sm">تنويه مهم</span>
            </div>
            <p className="text-primary-700 text-sm leading-relaxed">
              ردود المنصة إرشادية وتوعوية فقط، ولا تُعدّ شهادات رسمية أو تراخيص حكومية.
              للحالات التي تستلزم إجراءات قانونية أو تراخيص رسمية، يُرجى التواصل مع متخصصي ساستين بلس مباشرة.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-primary-600">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-white/80 mb-8">
              سجّل حساباً مجانياً واحصل على ٣ استشارات بيئية دون أي تكلفة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-4 rounded-xl transition-colors"
              >
                إنشاء حساب مجاني
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                مشاهدة الباقات
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PlatformFooter />
    </>
  )
}
