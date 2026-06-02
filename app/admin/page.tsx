import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getMonthYear, formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'لوحة الإدارة' }

export default async function AdminDashboard() {
  const monthYear = getMonthYear()

  const [
    totalUsers,
    activeSubscriptions,
    freeUsers,
    totalConsultationsThisMonth,
    pendingExpertCases,
    recentPayments,
    failedPayments,
    recentUsers,
    kbStats,
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.subscription.count({ where: { status: 'ACTIVE', plan: { slug: { not: 'free' } } } }),
    prisma.subscription.count({ where: { plan: { slug: 'free' } } }),
    prisma.usageRecord.aggregate({
      where: { monthYear },
      _sum: { consultationsUsed: true },
    }),
    prisma.expertCase.count({ where: { status: { in: ['PENDING', 'IN_REVIEW', 'ASSIGNED', 'IN_PROGRESS'] } } }),
    prisma.payment.findMany({
      where: { status: 'PAID' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { nameAr: true, email: true } } },
    }),
    prisma.payment.count({ where: { status: 'FAILED' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, nameAr: true, email: true, createdAt: true, role: true },
    }),
    prisma.knowledgeEntry.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  // Revenue this month
  const revenueThisMonth = await prisma.payment.aggregate({
    where: {
      status: 'PAID',
      createdAt: { gte: new Date(`${monthYear}-01`) },
    },
    _sum: { amountPiasters: true },
  })

  const totalRevenue = await prisma.payment.aggregate({
    where: { status: 'PAID' },
    _sum: { amountPiasters: true },
  })

  const kbStatusMap = kbStats.reduce((acc, s) => {
    acc[s.status] = s._count
    return acc
  }, {} as Record<string, number>)

  const statsCards = [
    { label: 'إجمالي المستخدمين', value: totalUsers, icon: 'fa-users', color: 'bg-blue-50 text-blue-600' },
    { label: 'اشتراكات نشطة', value: activeSubscriptions, icon: 'fa-star', color: 'bg-gold-50 text-gold-600' },
    { label: 'مستخدمو الباقة المجانية', value: freeUsers, icon: 'fa-user', color: 'bg-gray-50 text-gray-600' },
    { label: 'استشارات هذا الشهر', value: totalConsultationsThisMonth._sum.consultationsUsed ?? 0, icon: 'fa-comments', color: 'bg-primary-50 text-primary-600' },
    { label: 'حالات خبراء معلقة', value: pendingExpertCases, icon: 'fa-user-tie', color: 'bg-gold-50 text-gold-600' },
    { label: 'مدفوعات فاشلة', value: failedPayments, icon: 'fa-exclamation-triangle', color: 'bg-red-50 text-red-600' },
    { label: 'إيرادات الشهر (ج.م)', value: `${((revenueThisMonth._sum.amountPiasters ?? 0) / 100).toLocaleString('ar-EG')}`, icon: 'fa-money-bill', color: 'bg-primary-50 text-primary-600' },
    { label: 'إجمالي الإيرادات (ج.م)', value: `${((totalRevenue._sum.amountPiasters ?? 0) / 100).toLocaleString('ar-EG')}`, icon: 'fa-chart-line', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
        <p className="text-sm text-gray-400">نظرة عامة على المنصة — {formatDateAr(new Date())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {statsCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <i className={`fa-solid ${s.icon} text-sm`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent payments */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">آخر المدفوعات</h2>
            <Link href="/admin/payments" className="text-xs text-primary-600 hover:underline">عرض الكل</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">لا توجد مدفوعات بعد.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-gray-400 text-xs border-b border-gray-100">
                    <th className="pb-2 font-medium">المستخدم</th>
                    <th className="pb-2 font-medium">المبلغ</th>
                    <th className="pb-2 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5">
                        <p className="font-medium text-gray-700">{p.user.nameAr || 'بدون اسم'}</p>
                        <p className="text-xs text-gray-400">{p.user.email}</p>
                      </td>
                      <td className="py-2.5 font-semibold text-gray-900">
                        {(p.amountPiasters / 100).toLocaleString('ar-EG')} ج.م
                      </td>
                      <td className="py-2.5 text-gray-400 text-xs">{formatDateAr(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          {/* KB stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-4">قاعدة المعرفة</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">منشورة</span>
                <span className="font-semibold text-green-700">{kbStatusMap.PUBLISHED || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">مسودة</span>
                <span className="font-semibold text-amber-700">{kbStatusMap.DRAFT || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">مؤرشفة</span>
                <span className="font-semibold text-gray-500">{kbStatusMap.ARCHIVED || 0}</span>
              </div>
            </div>
            <Link
              href="/admin/knowledge-base"
              className="mt-4 w-full block text-center text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 py-2 rounded-lg transition-colors font-medium"
            >
              إدارة قاعدة المعرفة
            </Link>
          </div>

          {/* Admin links */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-3">إجراءات سريعة</h2>
            <div className="space-y-2">
              <Link href="/admin/users" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 p-2 rounded-lg hover:bg-gray-50">
                <i className="fa-solid fa-users text-primary-500 w-4" />
                إدارة المستخدمين
              </Link>
              <Link href="/admin/expert-cases" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 p-2 rounded-lg hover:bg-gray-50">
                <i className="fa-solid fa-briefcase text-gold-500 w-4" />
                حالات الخبراء ({pendingExpertCases})
              </Link>
              <Link href="/admin/knowledge-base" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 p-2 rounded-lg hover:bg-gray-50">
                <i className="fa-solid fa-book text-blue-500 w-4" />
                قاعدة المعرفة
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent users */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">أحدث المستخدمين</h2>
          <Link href="/admin/users" className="text-xs text-primary-600 hover:underline">عرض الكل</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-2 font-medium">الاسم</th>
                <th className="pb-2 font-medium">البريد</th>
                <th className="pb-2 font-medium">الدور</th>
                <th className="pb-2 font-medium">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 font-medium text-gray-700">{u.nameAr || '—'}</td>
                  <td className="py-2.5 text-gray-500">{u.email}</td>
                  <td className="py-2.5">
                    <span className={u.role === 'ADMIN' ? 'sp-badge-red' : u.role === 'EXPERT' ? 'sp-badge-yellow' : 'sp-badge-gray'}>
                      {u.role === 'ADMIN' ? 'مدير' : u.role === 'EXPERT' ? 'خبير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-400 text-xs">{formatDateAr(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
