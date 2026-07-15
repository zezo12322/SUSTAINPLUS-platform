import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: { absolute: 'حالاتي كخبير | ساستين بلس' } }

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'في الانتظار', cls: 'sp-badge-yellow' },
  IN_REVIEW: { label: 'قيد المراجعة', cls: 'sp-badge-yellow' },
  ASSIGNED: { label: 'مُسندة إليك', cls: 'sp-badge-green' },
  IN_PROGRESS: { label: 'جارٍ العمل', cls: 'sp-badge-green' },
  ANSWERED: { label: 'تمت الإجابة', cls: 'sp-badge-green' },
  RESOLVED: { label: 'محلولة', cls: 'sp-badge-gray' },
  CONVERTED_TO_BOOKING: { label: 'محوّلة لحجز', cls: 'sp-badge-gray' },
  CLOSED: { label: 'مغلقة', cls: 'sp-badge-gray' },
}

const PRIORITY_LABELS: Record<string, { label: string; cls: string }> = {
  low: { label: 'منخفض', cls: 'sp-badge-gray' },
  normal: { label: 'عادي', cls: 'sp-badge-yellow' },
  high: { label: 'عاجل', cls: 'sp-badge-red' },
}

export default async function ExpertCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  const { status } = await searchParams

  const cases = await prisma.expertCase.findMany({
    where: {
      assignedExpertId: session!.user!.id,
      ...(status ? { status: status as any } : {}),
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: 80,
    include: {
      user: { select: { nameAr: true, email: true } },
      session: { select: { id: true, titleAr: true } },
      _count: { select: { messages: true } },
    },
  })

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">الحالات المُسندة إليك</h1>
        <p className="text-sm text-gray-400 mt-1">{cases.length} حالة</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {[
          { value: '', label: 'الكل' },
          { value: 'ASSIGNED', label: 'مُسندة' },
          { value: 'IN_PROGRESS', label: 'جارٍ العمل' },
          { value: 'ANSWERED', label: 'تمت الإجابة' },
          { value: 'RESOLVED', label: 'محلولة' },
        ].map((tab) => (
          <a
            key={tab.value}
            href={tab.value ? `?status=${tab.value}` : '?'}
            className={`flex-shrink-0 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              status === tab.value || (!status && !tab.value)
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-primary-300'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {cases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <i className="fa-solid fa-folder-open text-gray-200 text-4xl mb-3" />
          <p className="text-gray-400">لا توجد حالات مُسندة إليك بهذه الحالة.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => {
            const st = STATUS_LABELS[c.status] || { label: c.status, cls: 'sp-badge-gray' }
            const pr = PRIORITY_LABELS[c.priority] || { label: c.priority, cls: 'sp-badge-gray' }
            return (
              <Link
                key={c.id}
                href={`/expert/${c.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={st.cls}>{st.label}</span>
                    <span className={pr.cls}>{pr.label}</span>
                    {c.category && <span className="sp-badge-gray">{c.category}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{formatDateAr(c.createdAt)}</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-user text-primary-600 text-xs" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.user.nameAr || '—'}</p>
                    <p className="text-xs text-gray-400">{c.user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{c.descriptionAr}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1 text-primary-600 font-medium">
                    فتح الحالة
                    <i className="fa-solid fa-arrow-left text-[10px]" />
                  </span>
                  {c._count.messages > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <i className="fa-solid fa-comments" />
                      {c._count.messages}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
