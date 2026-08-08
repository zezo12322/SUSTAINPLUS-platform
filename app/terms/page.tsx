import { PlatformHeader } from '@/components/layout/platform-header'
import { PlatformFooter } from '@/components/layout/platform-footer'
import { COMPANY } from '@/lib/company'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
  description: 'الشروط والأحكام الخاصة باستخدام منصة ساستين بلس للاستشارات البيئية.',
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div data-reveal="fade-up" className="bg-white rounded-2xl border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
          <i className={`fa-solid ${icon} text-primary-600`} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-3 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-file-contract text-primary-600 text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">الشروط والأحكام</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              آخر تحديث: أغسطس ٢٠٢٦. يُرجى قراءة هذه الشروط بعناية قبل استخدام منصة ساستين بلس.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-8">
          <Section title="القبول بالشروط" icon="fa-check-double">
            <p>
              بتسجيلك واستخدامك لمنصة {COMPANY.nameAr} للاستشارات البيئية، المملوكة لشركة {COMPANY.fullNameAr}،
              فإنك تقرّ بأنك قرأت هذه الشروط وتوافق على الالتزام بها. إن لم توافق على أي بند منها، يُرجى عدم استخدام المنصة.
            </p>
          </Section>

          <Section title="وصف الخدمة" icon="fa-comments">
            <p>
              تقدّم المنصة استشارات بيئية عبر نموذج ذكاء اصطناعي متخصص، مع إمكانية التحويل إلى خبراء بشريين
              للحالات المعقدة. الردود المقدّمة <strong>إرشادية وتوعوية فقط</strong>، ولا تُعدّ شهادات رسمية أو
              تراخيص حكومية أو رأياً قانونياً أو هندسياً معتمداً. للحالات التي تستلزم إجراءات رسمية، يُرجى التواصل
              مباشرة مع متخصصي {COMPANY.nameAr}.
            </p>
          </Section>

          <Section title="التسجيل والأهلية" icon="fa-id-card">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>يجب أن يكون عمرك ١٨ عاماً فأكثر لإنشاء حساب واستخدام المنصة.</li>
              <li>أنت مسؤول عن دقة البيانات التي تقدّمها وعن سرية بيانات دخولك.</li>
              <li>يُحظر إنشاء أكثر من حساب واحد للتحايل على حدود الباقة المجانية.</li>
            </ul>
          </Section>

          <Section title="الباقات والاشتراك والفوترة" icon="fa-credit-card">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>تُحدَّد حدود الاستشارات الشهرية وميزات كل باقة كما هي معروضة في صفحة الأسعار وقت الاشتراك.</li>
              <li>الاشتراكات الشهرية تُجدَّد تلقائياً ما لم يُلغِها المستخدم قبل نهاية الفترة الحالية.</li>
              <li>باقة الدفع لكل استشارة تُخصم من رصيد مسبق الشراء عند كل استشارة تُستهلك فعلياً.</li>
              <li>جميع المدفوعات تُعالَج بالجنيه المصري عبر بوابة Paymob المعتمدة من البنك المركزي المصري.</li>
              <li>أسعار الباقات قابلة للتعديل مع إشعار مسبق لا يقل عن ٣٠ يوماً.</li>
              <li>لتفاصيل الاسترداد والإلغاء، راجع{' '}
                <a href="/refund-policy" className="text-primary-600 hover:underline font-medium">سياسة الاسترجاع والإلغاء</a>.
              </li>
            </ul>
          </Section>

          <Section title="الاستخدام المقبول" icon="fa-shield-halved">
            <p>يُحظر استخدام المنصة في أي مما يلي:</p>
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>أي غرض غير مشروع أو نشر معلومات مضللة عمداً.</li>
              <li>محاولة الوصول غير المصرّح به لأنظمتنا، أو استخراج البيانات آلياً (scraping) دون إذن.</li>
              <li>إساءة استخدام نظام الاستشارات لأغراض تجارية غير مصرّح بها في باقتك.</li>
              <li>انتحال شخصية أي فرد أو جهة، أو تحميل محتوى ينتهك حقوق الملكية الفكرية للغير.</li>
            </ul>
          </Section>

          <Section title="الملكية الفكرية" icon="fa-copyright">
            <p>
              جميع حقوق الملكية الفكرية المتعلقة بالمنصة، بما في ذلك التصميم والمحتوى وقاعدة المعرفة، مملوكة لشركة
              {' '}{COMPANY.nameAr} أو للجهات المرخِّصة لها. لا يجوز نسخ أو إعادة نشر أو استغلال أي جزء منها تجارياً
              دون إذن كتابي مسبق.
            </p>
          </Section>

          <Section title="إخلاء المسؤولية وحدودها" icon="fa-triangle-exclamation">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>ردود الذكاء الاصطناعي إرشادية وقد تحتوي أخطاءً؛ لا نضمن دقتها الكاملة في جميع الحالات.</li>
              <li>{COMPANY.nameAr} غير مسؤولة عن أي قرارات اتُّخذت اعتماداً حصرياً على ردود المنصة دون الرجوع لخبير متخصص.</li>
              <li>لا نتحمّل مسؤولية أي أضرار غير مباشرة أو تبعية ناتجة عن استخدام المنصة، إلى أقصى حد يسمح به القانون المصري.</li>
            </ul>
          </Section>

          <Section title="تعليق الحساب وإنهاؤه" icon="fa-user-slash">
            <p>
              نحتفظ بالحق في تعليق أو إنهاء أي حساب ينتهك هذه الشروط أو سياسات الاستخدام المقبول، مع إخطار المستخدم
              حيثما أمكن. يمكنك أنت أيضاً إغلاق حسابك في أي وقت من صفحة الإعدادات.
            </p>
          </Section>

          <Section title="القانون الحاكم" icon="fa-scale-balanced">
            <p>
              تخضع هذه الشروط وتُفسَّر وفقاً لقوانين جمهورية مصر العربية، وتختص محاكم الإسكندرية بالفصل في أي نزاع
              ينشأ عنها.
            </p>
          </Section>

          <div data-reveal="zoom-in" className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
            <i className="fa-solid fa-envelope text-primary-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">أسئلة حول الشروط والأحكام؟</h3>
            <p className="text-gray-500 text-sm mb-4">تواصل معنا مباشرة لأي استفسار.</p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              <i className="fa-solid fa-envelope" />
              {COMPANY.email}
            </a>
          </div>
        </div>
      </main>
      <PlatformFooter />
    </>
  )
}
