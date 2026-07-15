import { prisma } from '@/lib/prisma'
import { formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'سجل التدقيق' }

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>
}) {
  const { action, page } = await searchParams
  const currentPage = parseInt(page || '1')
  const perPage = 50
  const skip = (currentPage - 1) * perPage

  const where = action ? { action } : {}

  const [logs, total, actions] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: { user: { select: { email: true, nameAr: true } } },
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ distinct: ['action'], select: { action: true }, orderBy: { action: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / perPage)
  const buildUrl = (p: Record<string, string | undefined>) => {
    const q = new URLSearchParams()
    Object.entries({ action, page: '1', ...p }).forEach(([k, v]) => { if (v) q.set(k, v) })
    return `/admin/audit?${q.toString()}`
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">سجل التدقيق</h1>
        <p className="text-sm text-gray-400">{total} إجراء مسجّل</p>
      </div>

      {/* Action filter */}
      <div className="flex flex-wrap gap-1 mb-4 text-xs">
        <a href={buildUrl({ action: undefined })}
          className={`px-3 py-1 rounded-full border ${!action ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'}`}>الكل</a>
        {actions.map((a) => (
          <a key={a.action} href={buildUrl({ action: a.action })}
            className={`px-3 py-1 rounded-full border font-mono ${action === a.action ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'}`}>
            {a.action}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-right text-gray-500 text-xs">
                <th className="px-4 py-3 font-semibold">الإجراء</th>
                <th className="px-4 py-3 font-semibold">المنفِّذ</th>
                <th className="px-4 py-3 font-semibold">التفاصيل</th>
                <th className="px-4 py-3 font-semibold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">لا يوجد سجل.</td></tr>
              )}
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/50 align-top">
                  <td className="px-4 py-3"><span className="font-mono text-xs text-gray-700">{l.action}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{l.user?.email || l.userId || 'النظام'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-md">
                    <code className="break-all" dir="ltr">{l.details ? JSON.stringify(l.details) : '—'}</code>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDateAr(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
            {currentPage > 1 && <a href={buildUrl({ page: String(currentPage - 1) })} className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">السابق</a>}
            <span className="px-3 py-1 text-sm text-gray-400">{currentPage} / {totalPages}</span>
            {currentPage < totalPages && <a href={buildUrl({ page: String(currentPage + 1) })} className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">التالي</a>}
          </div>
        )}
      </div>
    </div>
  )
}
