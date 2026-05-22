import Link from 'next/link'
import { PlatformHeader } from '@/components/layout/platform-header'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'تم إلغاء الدفع' }

export default function PaymentCancelPage() {
  return (
    <>
      <PlatformHeader />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-circle-xmark text-red-400 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم إلغاء الدفع</h1>
          <p className="text-gray-500 mb-7 leading-relaxed">
            لم تكتمل عملية الدفع. لا تقلق — لم يُخصم أي مبلغ من حسابك.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/billing"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              المحاولة مجدداً
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              العودة للوحة التحكم
            </Link>
          </div>
          <p className="mt-5 text-xs text-gray-400">
            إذا واجهت أي مشكلة في الدفع، تواصل مع فريق الدعم عبر{' '}
            <a href="mailto:info@sustainplus-eg.com" className="text-primary-600 hover:underline">
              info@sustainplus-eg.com
            </a>
          </p>
        </div>
      </main>
    </>
  )
}
