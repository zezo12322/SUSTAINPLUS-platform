import { prisma } from '@/lib/prisma'
import { formatPiasters, formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'
import { PaymentActions } from './payment-actions'

export const metadata: Metadata = { title: 'المدفوعات' }

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING:  { label: 'معلّق',   className: 'bg-yellow-100 text-yellow-800' },
  PAID:     { label: 'مدفوع',  className: 'bg-green-100  text-green-800'  },
  FAILED:   { label: 'فاشل',   className: 'bg-red-100    text-red-800'    },
  REFUNDED: { label: 'مُسترد', className: 'bg-gray-100   text-gray-700'   },
}

const TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION:         'اشتراك',
  PAYG_CONSULTATION:    'استشارة PAYG',
  CONSULTATION_PACK:    'باقة استشارات',
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>
}) {
  const { status, type, page } = await searchParams
  const currentPage = parseInt(page || '1')
  const perPage = 25
  const skip = (currentPage - 1) * perPage

  const where: Record<string, unknown> = {}
  if (status && ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(status)) {
    where.status = status
  }
  if (type && ['SUBSCRIPTION', 'PAYG_CONSULTATION', 'CONSULTATION_PACK'].includes(type)) {
    where.type = type
  }

  const [payments, total, stats] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: { user: { select: { nameAr: true, email: true } } },
    }),
    prisma.payment.count({ where }),
    prisma.payment.groupBy({
      by: ['status'],
      _count: true,
      _sum: { amountPiasters: true },
    }),
  ])

  const totalPages = Math.ceil(total / perPage)

  const paidStats   = stats.find(s => s.status === 'PAID')
  const pendingStats = stats.find(s => s.status === 'PENDING')
  const failedStats = stats.find(s => s.status === 'FAILED')
  const totalRevenue = paidStats?._sum?.amountPiasters ?? 0

  const buildUrl = (params: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { status, type, page: '1', ...params }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/admin/payments?${p.toString()}`
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">المدفوعات</h1>
        <p className="text-sm text-gray-400">{total} معاملة إجمالاً</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">إجمالي الإيرادات</p>
          <p className="text-lg font-bold text-primary-700">{formatPiasters(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">مدفوعات ناجحة</p>
          <p className="text-lg font-bold text-green-600">{paidStats?._count ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">في الانتظار</p>
          <p className="text-lg font-bold text-yellow-600">{pendingStats?._count ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">فاشلة</p>
          <p className="text-lg font-bold text-red-600">{failedStats?._count ?? 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-500 ml-1">الحالة:</span>
          {[undefined, 'PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((s) => (
            <a
              key={s ?? 'all'}
              href={buildUrl({ status: s, page: '1' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                status === s || (!status && !s)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              }`}
            >
              {s ? STATUS_LABELS[s].label : 'الكل'}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-500 ml-1">النوع:</span>
          {[undefined, 'SUBSCRIPTION', 'PAYG_CONSULTATION', 'CONSULTATION_PACK'].map((t) => (
            <a
              key={t ?? 'all'}
              href={buildUrl({ type: t, page: '1' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                type === t || (!type && !t)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              }`}
            >
              {t ? TYPE_LABELS[t] : 'الكل'}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-right px-4 py-3 font-semibold text-gray-500">المستخدم</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500">المبلغ</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500">النوع</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500">الحالة</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500">رقم الطلب</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500">التاريخ</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    لا توجد مدفوعات مطابقة
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const st = STATUS_LABELS[payment.status]
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {payment.user.nameAr || '—'}
                        </p>
                        <p className="text-xs text-gray-400">{payment.user.email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {formatPiasters(payment.amountPiasters)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {TYPE_LABELS[payment.type]}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {payment.paymobOrderId ? (
                          <span className="text-xs font-mono text-gray-500">
                            {payment.paymobOrderId}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDateAr(payment.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <PaymentActions paymentId={payment.id} status={payment.status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              صفحة {currentPage} من {totalPages}
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <a
                  href={buildUrl({ page: String(currentPage - 1) })}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  السابق
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={buildUrl({ page: String(currentPage + 1) })}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  التالي
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
