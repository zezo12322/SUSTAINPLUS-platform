import { PlatformHeader } from '@/components/layout/platform-header'
import { PlatformFooter } from '@/components/layout/platform-footer'
import { COMPANY } from '@/lib/company'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'كيف تجمع منصة ساستين بلس بياناتك وتستخدمها وتحميها.',
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user-shield text-primary-600 text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">سياسة الخصوصية</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              آخر تحديث: أغسطس ٢٠٢٦. توضح هذه السياسة كيف تجمع منصة ساستين بلس للاستشارات البيئية بياناتك وتستخدمها وتحميها.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-8">
          <Section title="مقدمة" icon="fa-book-open">
            <p>
              تُشغّل هذه المنصة شركة {COMPANY.fullNameAr} ({COMPANY.nameAr})، ومقرها {COMPANY.addressAr}.
              باستخدامك للمنصة فإنك توافق على جمع بياناتك ومعالجتها وفق ما هو موضح في هذه السياسة.
            </p>
          </Section>

          <Section title="البيانات التي نجمعها" icon="fa-database">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>بيانات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف، وكلمة المرور (مشفّرة).</li>
              <li>بيانات الاستخدام: الاستشارات والرسائل المتبادلة مع النظام أو مع الخبراء، وتاريخ الاشتراك والباقة المختارة.</li>
              <li>بيانات الدفع: تُعالَج جميع المدفوعات عبر بوابة Paymob المعتمدة؛ لا نستقبل أو نخزّن بيانات بطاقتك الائتمانية على خوادمنا.</li>
              <li>بيانات فنية: عنوان الـ IP، نوع المتصفح، وسجلات الدخول لأغراض الأمان ومنع إساءة الاستخدام.</li>
            </ul>
          </Section>

          <Section title="كيف نستخدم بياناتك" icon="fa-gears">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>تقديم الاستشارات البيئية وإدارة حسابك وباقتك.</li>
              <li>معالجة المدفوعات وإصدار الفواتير والإيصالات.</li>
              <li>التواصل معك بخصوص حسابك، أو الدعم الفني، أو تحديثات جوهرية على الخدمة.</li>
              <li>تحسين جودة المنصة وأمانها، والكشف عن الاستخدام غير المشروع.</li>
            </ul>
          </Section>

          <Section title="مشاركة البيانات مع أطراف ثالثة" icon="fa-share-nodes">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>لا نبيع بياناتك لأي طرف ثالث، ولا نشاركها مع شركاء إعلانيين.</li>
              <li>نشارك بيانات الدفع اللازمة فقط مع بوابة Paymob لإتمام عملية الدفع.</li>
              <li>قد نُفصح عن بيانات محدودة إذا طُلب ذلك بموجب القانون أو أمر قضائي في مصر.</li>
              <li>لا نستخدم محادثاتك لتدريب نماذج ذكاء اصطناعي خارجية أو لأغراض تجارية غير متعلقة بالخدمة.</li>
            </ul>
          </Section>

          <Section title="أمان البيانات" icon="fa-lock">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>جميع الاتصالات مشفّرة بـ TLS 1.3 بين متصفحك وخوادمنا.</li>
              <li>كلمات المرور محمية بتشفير bcrypt ولا تُخزَّن بأي شكل قابل للقراءة.</li>
              <li>قاعدة البيانات محمية وغير قابلة للوصول العام، والبيانات مشفّرة أثناء التخزين.</li>
            </ul>
          </Section>

          <Section title="الاحتفاظ بالبيانات وحذف الحساب" icon="fa-trash-can">
            <p>
              نحتفظ ببياناتك طالما ظلّ حسابك نشطاً، أو حسب ما يقتضيه القانون (كسجلات الفوترة). يمكنك طلب حذف حسابك
              وجميع بياناتك الشخصية في أي وقت عبر صفحة الإعدادات أو بمراسلتنا على البريد الإلكتروني أدناه، وسيتم
              الحذف خلال مدة معقولة باستثناء ما يلزم الاحتفاظ به لأغراض قانونية أو محاسبية.
            </p>
          </Section>

          <Section title="حقوقك" icon="fa-user-check">
            <p>يحق لك في أي وقت:</p>
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>الاطلاع على بياناتك الشخصية المخزَّنة لدينا.</li>
              <li>طلب تصحيح أي بيانات غير دقيقة.</li>
              <li>طلب حذف بياناتك أو تقييد معالجتها.</li>
              <li>سحب موافقتك على التواصل التسويقي في أي وقت.</li>
            </ul>
          </Section>

          <Section title="ملفات تعريف الارتباط (Cookies)" icon="fa-cookie-bite">
            <p>
              نستخدم فقط ملفات تعريف الارتباط الضرورية للحفاظ على جلسة تسجيل الدخول وأمان الحساب. لا نستخدم ملفات
              تتبّع إعلانية من أطراف ثالثة.
            </p>
          </Section>

          <Section title="تعديلات على هذه السياسة" icon="fa-file-pen">
            <p>
              قد نُحدّث هذه السياسة من وقت لآخر لمواكبة تطوّر الخدمة أو المتطلبات القانونية. سننشر أي تعديل جوهري على
              هذه الصفحة مع تاريخ التحديث.
            </p>
          </Section>

          <div data-reveal="zoom-in" className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
            <i className="fa-solid fa-envelope text-primary-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">أسئلة حول سياسة الخصوصية؟</h3>
            <p className="text-gray-500 text-sm mb-4">تواصل معنا مباشرة لأي استفسار عن بياناتك أو خصوصيتك.</p>
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
