import { prisma } from '@/lib/prisma'
import { formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'إدارة المستخدمين' }

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const currentPage = parseInt(page || '1')
  const perPage = 20
  const skip = (currentPage - 1) * perPage

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' as const } },
          { nameAr: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: {
        subscription: { include: { plan: true } },
        _count: { select: { chatSessions: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-sm text-gray-400">{total} مستخدم إجمالاً</p>
        </div>
      </div>

      {/* Search */}
      <form className="mb-5">
        <div className="relative max-w-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="البحث بالاسم أو البريد..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i className="fa-solid fa-magnifying-glass text-sm" />
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-right text-gray-500 text-xs">
                <th className="px-4 py-3 font-semibold">المستخدم</th>
                <th className="px-4 py-3 font-semibold">الباقة</th>
                <th className="px-4 py-3 font-semibold">الدور</th>
                <th className="px-4 py-3 font-semibold">المحادثات</th>
                <th className="px-4 py-3 font-semibold">الحالة</th>
                <th className="px-4 py-3 font-semibold">تاريخ التسجيل</th>
                <th className="px-4 py-3 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{u.nameAr || '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                      {u.subscription?.plan?.nameAr || 'مجاني'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={
                      u.role === 'ADMIN' ? 'sp-badge-red' :
                      u.role === 'EXPERT' ? 'sp-badge-yellow' : 'sp-badge-gray'
                    }>
                      {u.role === 'ADMIN' ? 'مدير' : u.role === 'EXPERT' ? 'خبير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u._count.chatSessions}</td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? 'sp-badge-green' : 'sp-badge-red'}>
                      {u.isActive ? 'نشط' : 'موقوف'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDateAr(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <AdminUserActions userId={u.id} isActive={u.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`?page=${p}${q ? `&q=${q}` : ''}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                  p === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminUserActions({
  userId,
  isActive,
}: {
  userId: string
  isActive: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={`/admin/users/${userId}`}
        className="text-xs px-2 py-1 rounded text-primary-600 hover:bg-primary-50 font-medium"
      >
        تفاصيل
      </a>
      <form action={`/api/admin/users/${userId}/toggle`} method="POST">
        <button
          type="submit"
          className={`text-xs px-2 py-1 rounded ${
            isActive
              ? 'text-red-600 hover:bg-red-50'
              : 'text-green-600 hover:bg-green-50'
          }`}
        >
          {isActive ? 'إيقاف' : 'تفعيل'}
        </button>
      </form>
    </div>
  )
}
