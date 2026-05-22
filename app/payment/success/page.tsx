import Link from 'next/link'
import { PlatformHeader } from '@/components/layout/platform-header'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'تم الدفع بنجاح' }

export default function PaymentSuccessPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-circle-check text-green-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع بنجاح!</h1>
          <p className="text-gray-500 mb-7 leading-relaxed">
            تمت معالجة دفعتك بنجاح. يمكنك الآن الاستفادة من ميزاتك الجديدة على المنصة.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/chat/new"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              ابدأ استشارة جديدة
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
