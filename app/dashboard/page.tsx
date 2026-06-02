import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getMonthYear, formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'لوحة التحكم' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id
  const monthYear = getMonthYear()

  const [user, usage, recentSessions, openCases] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { plan: true } } },
    }),
    prisma.usageRecord.findUnique({ where: { userId_monthYear: { userId, monthYear } } }),
    prisma.chatSession.findMany({
      where: { userId, isActive: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    }),
    prisma.expertCase.count({
      where: { userId, status: { in: ['PENDING', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS'] } },
    }),
  ])

  const plan = user?.subscription?.plan
  const used = usage?.consultationsUsed ?? 0
  const limit = plan?.consultationsPerMonth ?? 3
  const remaining = Math.max(0, limit - used)
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  function usageClass(p: number) {
    if (p >= 90) return 'high'
    if (p >= 70) return 'medium'
    return 'low'
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          أهلاً، {user?.nameAr || session.user.name} 👋
        </h1>
        <p className="text-sm text-gray-400">هذا ملخص نشاطك الشهري على المنصة.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {/* Consultations used */}
        <div data-reveal="fade-up" className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-medium text-gray-500">الاستشارات المستخدمة</p>
            <i className="fa-solid fa-comments text-primary-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{used} / {limit}</p>
          <div className="usage-bar mt-2">
            <div className={`usage-bar-fill ${usageClass(pct)}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{remaining} متبقية هذا الشهر</p>
        </div>

        {/* Plan */}
        <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '90ms' }} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-medium text-gray-500">الباقة الحالية</p>
            <i className="fa-solid fa-star text-gold-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{plan?.nameAr || 'مجاني'}</p>
          <Link href="/dashboard/billing" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            {plan?.slug === 'free' ? 'ترقية الباقة' : 'إدارة الاشتراك'}
          </Link>
        </div>

        {/* Sessions */}
        <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '180ms' }} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-medium text-gray-500">المحادثات</p>
            <i className="fa-solid fa-message text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{recentSessions.length}</p>
          <Link href="/dashboard/chat" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            عرض الكل
          </Link>
        </div>

        {/* Expert cases */}
        <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '270ms' }} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm font-medium text-gray-500">حالات الخبراء</p>
            <i className="fa-solid fa-user-tie text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{openCases}</p>
          <Link href="/dashboard/expert" className="text-xs text-primary-600 hover:underline mt-1 inline-block">
            {openCases > 0 ? 'متابعة الحالات' : 'تصعيد لخبير'}
          </Link>
        </div>
      </div>

      {/* Limit warning */}
      {pct >= 80 && (
        <div className={`rounded-xl border px-5 py-4 mb-6 flex items-center justify-between gap-4 ${
          pct >= 100 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <i className={`fa-solid fa-triangle-exclamation ${pct >= 100 ? 'text-red-500' : 'text-amber-500'}`} />
            <p className={`text-sm font-medium ${pct >= 100 ? 'text-red-700' : 'text-amber-700'}`}>
              {pct >= 100
                ? 'لقد استنفدت جميع استشاراتك الشهرية.'
                : `لديك ${remaining} استشارة متبقية فقط هذا الشهر.`}
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            ترقية الباقة
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div data-reveal="fade-up" className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">إجراءات سريعة</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/chat/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <i className="fa-solid fa-plus text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">استشارة جديدة</p>
                <p className="text-xs text-gray-400">اطرح سؤالاً بيئياً جديداً</p>
              </div>
              <i className="fa-solid fa-chevron-left text-gray-300 mr-auto transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-primary-400" />
            </Link>

            <Link
              href="/dashboard/expert"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                <i className="fa-solid fa-user-tie text-gold-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">تصعيد لخبير</p>
                <p className="text-xs text-gray-400">للحالات المعقدة والرسمية</p>
              </div>
              <i className="fa-solid fa-chevron-left text-gray-300 mr-auto transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-primary-400" />
            </Link>

            <Link
              href="/dashboard/billing"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <i className="fa-solid fa-arrow-up text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">ترقية الباقة</p>
                <p className="text-xs text-gray-400">احصل على استشارات أكثر</p>
              </div>
              <i className="fa-solid fa-chevron-left text-gray-300 mr-auto transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-primary-400" />
            </Link>
          </div>
        </div>

        {/* Recent sessions */}
        <div data-reveal="fade-up" style={{ ['--reveal-delay' as string]: '120ms' }} className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">آخر المحادثات</h2>
            <Link href="/dashboard/chat" className="text-xs text-primary-600 hover:underline">
              عرض الكل
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-regular fa-comments text-gray-200 text-3xl mb-3" />
              <p className="text-gray-400 text-sm">لا توجد محادثات بعد.</p>
              <Link
                href="/dashboard/chat/new"
                className="mt-3 inline-block text-sm text-primary-600 font-medium hover:underline"
              >
                ابدأ استشارتك الأولى
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/chat/${s.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-comment-dots text-gray-400 text-xs" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {s.titleAr || 'محادثة بدون عنوان'}
                    </p>
                    <p className="text-xs text-gray-400">{formatDateAr(s.updatedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
