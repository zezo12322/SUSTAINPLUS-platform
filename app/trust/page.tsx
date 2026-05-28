import { PlatformHeader } from '@/components/layout/platform-header'
import { PlatformFooter } from '@/components/layout/platform-footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الأمان والخصوصية',
  description: 'كيف تحمي ساستين بلس بياناتك ومحادثاتك على منصة الاستشارات البيئية.',
}

export default function TrustPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-shield-halved text-primary-600 text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              الأمان والخصوصية
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              ثقتك هي أساس عملنا. نلتزم بأعلى معايير الأمان وحماية بياناتك.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-8">

          {/* Data security */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-lock text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">أمان البيانات</h2>
            </div>
            <ul className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                جميع الاتصالات مشفرة بـ TLS 1.3 بين متصفحك وخوادمنا.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                كلمات المرور محمية بتشفير bcrypt (معامل تكلفة 12) ولا تُخزن بأي شكل قابل للقراءة.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                قاعدة البيانات محمية وغير قابلة للوصول العام. البيانات مشفرة في حالة التخزين.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                مفاتيح API وبيانات الدفع لا تُخزن على خوادمنا — نتعامل مع بوابة Paymob المعتمدة مباشرة.
              </li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-eye-slash text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">الخصوصية</h2>
            </div>
            <ul className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                لا نبيع بياناتك لأي طرف ثالث، ولا نشاركها مع شركاء إعلانيين.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                محادثاتك خاصة لك. لا يطلع عليها إلا فريق الدعم الفني عند الضرورة القصوى لحل مشكلة فنية، وبموافقتك.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                لا نستخدم محادثاتك لتدريب نماذج الذكاء الاصطناعي أو لأغراض تجارية خارجية.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                يمكنك طلب حذف حسابك وجميع بياناتك في أي وقت عبر صفحة الإعدادات.
              </li>
            </ul>
          </div>

          {/* AI Transparency */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-circle-info text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">شفافية الذكاء الاصطناعي</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-5">
              <p className="text-amber-800 font-bold text-sm mb-2">⚠️ تنويه قانوني مهم</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                ردود منصة الاستشارات <strong>إرشادية وتوعوية فقط</strong>، ولا تُعدّ:
                شهادات رسمية، تراخيص حكومية، قرارات إدارية، أو رأياً قانونياً معتمداً.
                للحالات التي تستلزم إجراءات رسمية، يُرجى التواصل مع متخصصي ساستين بلس.
              </p>
            </div>
            <ul className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                الأسئلة البسيطة تُعالَج بنموذج ذكاء اصطناعي سريع ومتخصص.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                الأسئلة المعقدة والتقنية تُحوَّل تلقائياً لنموذج أكثر تقدماً.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                الحالات الحساسة (التراخيص، الغرامات، الإجراءات القانونية) تُقترح فيها دائماً الإحالة لخبير بشري.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                لا ندّعي الحصول على شهادات ISO 27001 أو ISO/IEC 42001 أو SOC 2 أو أي اعتماد حكومي ما لم يُعلن رسمياً.
              </li>
            </ul>
          </div>

          {/* Access control */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-users-gear text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">التحكم في الوصول</h2>
            </div>
            <ul className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                نظام صلاحيات متعدد المستويات (مستخدم، خبير، مدير) مع فصل كامل بين الأدوار.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                تحديد معدل الطلبات (Rate Limiting) للحماية من الاستخدام المفرط وهجمات brute-force.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                سجل تدقيق كامل (Audit Log) لكل العمليات الحساسة على المنصة.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                التحقق من صحة جميع المدخلات والبيانات على مستوى الخادم لمنع الحقن وهجمات XSS.
              </li>
            </ul>
          </div>

          {/* Payment security */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-credit-card text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">أمان المدفوعات</h2>
            </div>
            <ul className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                جميع المدفوعات تُعالَج عبر بوابة Paymob المعتمدة من البنك المركزي المصري.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                لا نخزن بيانات بطاقاتك الائتمانية على خوادمنا إطلاقاً.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                التحقق من HMAC لجميع إشعارات الدفع الواردة من Paymob لمنع التزوير.
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-0.5 flex-shrink-0" />
                لا تُفعَّل الاستشارات المدفوعة إلا بعد التأكيد الكامل للدفع.
              </li>
            </ul>
          </div>

          {/* Terms anchor */}
          <div id="terms" className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">الشروط والأحكام</h2>
            <div className="prose prose-sm max-w-none text-gray-600 space-y-4 leading-relaxed">
              <p>بتسجيلك واستخدامك لمنصة ساستين بلس للاستشارات البيئية، فإنك توافق على ما يلي:</p>
              <ol className="list-decimal list-inside space-y-2 mr-4">
                <li>الردود المقدمة إرشادية وتوعوية ولا تُغني عن الاستشارة القانونية أو الهندسية الرسمية.</li>
                <li>حدود الاستشارات الشهرية محددة وفق الباقة المختارة ولا يمكن تجاوزها دون دفع إضافي.</li>
                <li>يُحظر استخدام المنصة لأغراض غير مشروعة أو لنشر معلومات مضللة.</li>
                <li>ساستين بلس غير مسؤولة عن أي قرارات اتُّخذت اعتماداً حصرياً على ردود المنصة دون الرجوع لخبير متخصص.</li>
                <li>نحتفظ بالحق في تعليق الحسابات التي تنتهك سياسات الاستخدام.</li>
                <li>أسعار الباقات قابلة للتعديل مع إشعار مسبق لا يقل عن ٣٠ يوماً.</li>
              </ol>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
            <i className="fa-solid fa-envelope text-primary-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">أسئلة حول الخصوصية والأمان؟</h3>
            <p className="text-gray-500 text-sm mb-4">
              تواصل مع فريق ساستين بلس مباشرة للاستفسار عن أي جانب من جوانب حماية بياناتك.
            </p>
            <a
              href="mailto:info@sustainplus-eg.com"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              <i className="fa-solid fa-envelope" />
              info@sustainplus-eg.com
            </a>
          </div>
        </div>
      </main>
      <PlatformFooter />
    </>
  )
}
