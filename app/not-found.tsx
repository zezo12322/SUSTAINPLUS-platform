import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-primary-200 mb-4">٤٠٤</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-500 mb-8">
          يبدو أن الصفحة التي تبحث عنها قد نُقلت أو لم تعد موجودة.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  )
}
