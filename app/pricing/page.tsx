import Link from 'next/link'
import { PlatformHeader } from '@/components/layout/platform-header'
import { PlatformFooter } from '@/components/layout/platform-footer'
import { PLANS, CONSULTATION_PACKS } from '@/lib/constants'
import { formatPiasters } from '@/lib/utils'
import { AuroraBackground } from '@/components/animation/aurora-background'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الأسعار والباقات',
  description: 'اختر الباقة المناسبة لاحتياجاتك البيئية — من الباقة المجانية إلى باقة الأعمال.',
}

const plans = [
  {
    ...PLANS.FREE,
    isFeatured: false,
    cta: 'ابدأ مجاناً',
    ctaHref: '/register',
    ctaVariant: 'outline' as const,
    priceLabel: 'مجاني',
    priceSub: 'دائماً',
  },
  {
    ...PLANS.PAYG,
    isFeatured: false,
    cta: 'اشحن رصيداً',
    ctaHref: '/register',
    ctaVariant: 'outline' as const,
    priceLabel: '٣٥ ج.م',
    priceSub: 'لكل استشارة',
  },
  {
    ...PLANS.STANDARD,
    isFeatured: false,
    cta: 'اشترك الآن',
    ctaHref: '/register',
    ctaVariant: 'primary' as const,
    priceLabel: '٨٥٠ ج.م',
    priceSub: 'شهرياً',
  },
  {
    ...PLANS.PREMIUM,
    isFeatured: true,
    cta: 'اشترك الآن',
    ctaHref: '/register',
    ctaVariant: 'primary' as const,
    priceLabel: '٢,٢٥٠ ج.م',
    priceSub: 'شهرياً',
  },
  {
    ...PLANS.BUSINESS,
    isFeatured: false,
    cta: 'تواصل معنا',
    ctaHref: '/dashboard/expert',
    ctaVariant: 'outline' as const,
    priceLabel: 'يبدأ من ٤,٥٠٠ ج.م',
    priceSub: 'شهرياً',
  },
]

export default function PricingPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50">

        {/* Header */}
        <section className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 data-reveal="fade-up" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              الأسعار والباقات
            </h1>
            <p data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '100ms' }} className="text-gray-500 text-lg max-w-xl mx-auto">
              اختر الباقة التي تناسب حجم عملك واحتياجاتك البيئية. ابدأ مجاناً وطوّر عند الحاجة.
            </p>
          </div>
        </section>

        {/* Plans grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {plans.map((plan, i) => (
              <div
                key={plan.slug}
                data-reveal="fade-up"
                style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
                className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${
                  plan.isFeatured
                    ? 'border-primary-500 shadow-xl shadow-primary-100'
                    : 'border-gray-100 hover:border-primary-300 hover:shadow-lg'
                }`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3.5 right-1/2 translate-x-1/2 bg-primary-600 text-white text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    الأكثر شيوعاً
                  </div>
                )}

                <div className="mb-4">
                  <h2 className="font-bold text-lg text-gray-900">{plan.nameAr}</h2>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-primary-700">{plan.priceLabel}</span>
                    <span className="text-gray-400 text-sm mr-1">{plan.priceSub}</span>
                  </div>
                  {plan.consultationsPerMonth > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {plan.consultationsPerMonth} استشارة / شهر
                      {plan.maxUsers > 1 && ` · حتى ${plan.maxUsers} مستخدمين`}
                    </p>
                  )}
                </div>

                <ul className="flex-1 space-y-2 mb-6">
                  {plan.featuresAr.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="fa-solid fa-check text-primary-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {'restrictions' in plan && plan.restrictions && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <i className="fa-solid fa-xmark text-gray-300 mt-0.5 flex-shrink-0" />
                        رفع الملفات غير متاح
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <i className="fa-solid fa-xmark text-gray-300 mt-0.5 flex-shrink-0" />
                        تقارير مفصلة غير متاحة
                      </li>
                    </>
                  )}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`w-full text-center font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Extra packs */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div data-reveal="fade-up" className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">استشارات إضافية</h2>
            <p className="text-gray-500 text-sm mb-7">
              أضف استشارات إضافية لأي باقة في أي وقت. الأسعار ثابتة ولا تتغير.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CONSULTATION_PACKS.map((pack, i) => (
                <div
                  key={pack.id}
                  data-reveal="zoom-in"
                  style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
                  className="border-2 border-gray-100 hover:border-primary-300 hover:shadow-md rounded-xl p-5 text-center cursor-pointer"
                >
                  <p className="text-2xl font-bold text-primary-700 mb-1">{pack.labelAr}</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {pack.pricePiasters / 100} ج.م
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {pack.pricePiasters / 100 / pack.count} ج.م للاستشارة
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-gray-400 text-center">
              * الحد الأدنى للاستشارة الواحدة ٣٥ جنيهاً مصرياً في جميع الأحوال.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 data-reveal="fade-up" className="text-xl font-bold text-gray-900 mb-7 text-center">أسئلة شائعة</h2>
          <div className="space-y-4">
            {[
              {
                q: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
                a: 'نعم، يمكنك إلغاء اشتراكك في أي وقت. ستظل مستشاراتك المتبقية متاحة حتى نهاية دورة الفوترة الحالية.',
              },
              {
                q: 'ماذا يحدث عند الوصول لحد الاستشارات؟',
                a: 'عند وصولك للحد الشهري، يمكنك شراء استشارات إضافية، الترقية لباقة أعلى، أو الانتظار حتى بداية الشهر التالي.',
              },
              {
                q: 'هل الردود دقيقة دائماً؟',
                a: 'الردود مستندة إلى قاعدة معرفة مراجعة من خبراء ساستين بلس، غير أنها إرشادية. للحالات المعقدة التي تحتاج رأياً رسمياً، نوصي بتصعيد الأمر لأحد خبرائنا.',
              },
              {
                q: 'ما طرق الدفع المتاحة؟',
                a: 'نقبل الدفع عبر البطاقات الائتمانية والمحافظ الإلكترونية عبر بوابة Paymob الآمنة.',
              },
              {
                q: 'هل يوجد عرض للمؤسسات؟',
                a: 'نعم، باقة الأعمال قابلة للتخصيص للمؤسسات الكبيرة. تواصل معنا لمناقشة احتياجاتك.',
              },
            ].map((faq, i) => (
              <details key={faq.q} data-reveal="fade-up" style={{ ['--reveal-delay' as string]: `${i * 70}ms` }} className="bg-white rounded-xl border border-gray-100 p-5 group hover:border-primary-200 transition-colors">
                <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-800 list-none">
                  {faq.q}
                  <i className="fa-solid fa-chevron-down text-gray-400 text-xs transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-primary-600 py-14 text-center px-4">
          <AuroraBackground conic />
          <h2 data-reveal="fade-up" className="relative text-2xl font-bold text-white mb-4">ابدأ استشارتك البيئية اليوم</h2>
          <p data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '100ms' }} className="relative text-white/80 mb-7">٣ استشارات مجانية بدون بطاقة ائتمان.</p>
          <Link
            href="/register"
            data-reveal="fade-up"
            style={{ ['--reveal-delay' as string]: '200ms' }}
            className="sheen group relative inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            إنشاء حساب مجاني
          </Link>
        </section>
      </main>
      <PlatformFooter />
    </>
  )
}
