'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-primary-200 mb-4">!</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ غير متوقع</h1>
        <p className="text-gray-500 mb-8">
          نعتذر عن هذا الخطأ. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            حاول مرة أخرى
          </button>
          <Link
            href="/"
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
