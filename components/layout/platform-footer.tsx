import Link from 'next/link'
import Image from 'next/image'
import { MAIN_SITE_URL } from '@/lib/constants'

export function PlatformFooter() {
  return (
    <footer className="bg-[#0f3d22] text-[#cce5d5] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <div className="inline-block bg-white rounded-xl px-3 py-2">
                <Image src="/logo.png" alt="Sustain Plus" height={32} width={110} className="object-contain" />
              </div>
            </div>
            <p className="text-sm text-[#cce5d5] opacity-80 max-w-sm leading-relaxed">
              منصة استشارات بيئية ذكية مدعومة بخبرة متخصصي ساستين بلس وقاعدة معرفة مراجعة من خبراء معتمدين.
            </p>
            <p className="mt-4 text-xs text-[#cce5d5] opacity-60">
              ⚠️ الردود إرشادية وتوعوية وليست شهادات قانونية رسمية.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">المنصة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors opacity-80">الاستشارة الذكية</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors opacity-80">الأسعار والباقات</Link></li>
              <li><Link href="/trust" className="hover:text-white transition-colors opacity-80">الأمان والخصوصية</Link></li>
              <li><Link href="/dashboard/expert" className="hover:text-white transition-colors opacity-80">التحدث مع خبير</Link></li>
            </ul>
          </div>

          {/* Main site links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">ساستين بلس</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`${MAIN_SITE_URL}/ar/about.html`} className="hover:text-white transition-colors opacity-80">
                  من نحن
                </a>
              </li>
              <li>
                <a href={`${MAIN_SITE_URL}/ar/services.html`} className="hover:text-white transition-colors opacity-80">
                  خدماتنا
                </a>
              </li>
              <li>
                <a href={`${MAIN_SITE_URL}/ar/contact.html`} className="hover:text-white transition-colors opacity-80">
                  تواصل معنا
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors opacity-80">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e5c34] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#cce5d5] opacity-60">
          <p>© {new Date().getFullYear()} ساستين بلس. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/trust" className="hover:opacity-100">سياسة الخصوصية</Link>
            <span>•</span>
            <Link href="/trust#terms" className="hover:opacity-100">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
