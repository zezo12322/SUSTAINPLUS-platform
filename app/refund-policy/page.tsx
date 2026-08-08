import { PlatformHeader } from '@/components/layout/platform-header'
import { PlatformFooter } from '@/components/layout/platform-footer'
import { COMPANY } from '@/lib/company'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الاسترجاع والإلغاء',
  description: 'سياسة استرداد المدفوعات وإلغاء الاشتراك في منصة ساستين بلس للاستشارات البيئية.',
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

export default function RefundPolicyPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-100 py-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-rotate-left text-primary-600 text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">سياسة الاسترجاع والإلغاء</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              آخر تحديث: أغسطس ٢٠٢٦. توضح هذه الصفحة كيفية إلغاء الاشتراك واسترداد المدفوعات على منصة ساستين بلس.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-8">
          <Section title="عام" icon="fa-circle-info">
            <p>
              جميع المدفوعات على المنصة بالجنيه المصري وتُعالَج عبر بوابة الدفع الإلكتروني Paymob المعتمدة من
              البنك المركزي المصري. لا نخزّن بيانات بطاقتك على خوادمنا، وأي استرداد يُعاد إلى وسيلة الدفع نفسها
              التي تم بها السداد.
            </p>
          </Section>

          <Section title="إلغاء الاشتراك الشهري" icon="fa-calendar-xmark">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>يمكنك إلغاء تجديد اشتراكك الشهري في أي وقت من صفحة &quot;اشتراكي&quot; في لوحة التحكم، أو بمراسلتنا.</li>
              <li>عند الإلغاء، يظل اشتراكك ساري المفعول حتى نهاية الفترة المدفوعة الحالية، دون تجديد تلقائي بعدها.</li>
              <li>لا نرد قيمة الأيام المتبقية من الفترة الشهرية الحالية عند الإلغاء الاختياري من قِبل المستخدم.</li>
            </ul>
          </Section>

          <Section title="استرداد الاشتراكات الشهرية" icon="fa-money-bill-transfer">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>يحق لك طلب استرداد كامل خلال ٣ أيام من تاريخ الدفع إذا لم تستهلك أياً من استشارات الباقة بعد.</li>
              <li>بمجرد استخدام استشارة واحدة على الأقل من الباقة المدفوعة، لا يكون الاشتراك قابلاً للاسترداد لبقية تلك الفترة.</li>
              <li>في حال خطأ في الفوترة (خصم مكرر، أو مبلغ غير صحيح)، يُرد المبلغ بالكامل فور التحقق من الخطأ.</li>
            </ul>
          </Section>

          <Section title="باقة الدفع لكل استشارة والرصيد المسبق" icon="fa-wallet">
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>الرصيد المستهلك فعلياً مقابل استشارة تم تسليم ردّها غير قابل للاسترداد.</li>
              <li>إذا فشلت المنصة تقنياً في إنتاج رد لاستشارة ما، يُعاد رصيدها تلقائياً لحسابك دون الحاجة لطلب.</li>
              <li>يمكن استرداد الرصيد غير المستخدم بالكامل خلال ٣٠ يوماً من تاريخ الشراء بناءً على طلب يُرسَل إلى بريد الدعم.</li>
            </ul>
          </Section>

          <Section title="كيفية طلب الاسترداد" icon="fa-paper-plane">
            <p>
              أرسل طلب الاسترداد على البريد الإلكتروني أدناه مع ذكر بريد حسابك وتاريخ العملية ورقم الفاتورة إن وجد.
              تتم مراجعة الطلبات ومعالجة المبالغ المستحقة خلال ما يصل إلى ١٤ يوم عمل، حسب سياسات بنك أو محفظة
              الدفع الخاصة بك.
            </p>
          </Section>

          <Section title="المنازعات المصرفية (Chargebacks)" icon="fa-hand">
            <p>
              نشجّعك على التواصل معنا مباشرةً لحل أي خلاف حول الفوترة قبل فتح نزاع مصرفي مع البنك المُصدر للبطاقة،
              حيث يمكننا غالباً حل المشكلة بشكل أسرع من خلال قنوات الدعم لدينا.
            </p>
          </Section>

          <div data-reveal="zoom-in" className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
            <i className="fa-solid fa-envelope text-primary-600 text-2xl mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">تحتاج استرداد أو لديك استفسار حول الفوترة؟</h3>
            <p className="text-gray-500 text-sm mb-4">راسل فريق الدعم وسنرد عليك في أقرب وقت.</p>
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
