import { prisma } from '@/lib/prisma'
import { formatDateAr } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'حالات الخبراء' }

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'في الانتظار', cls: 'sp-badge-yellow' },
  IN_REVIEW: { label: 'قيد المراجعة', cls: 'sp-badge-yellow' },
  ASSIGNED: { label: 'مخصص', cls: 'sp-badge-green' },
  IN_PROGRESS: { label: 'جارٍ العمل', cls: 'sp-badge-green' },
  RESOLVED: { label: 'محلول', cls: 'sp-badge-gray' },
  CLOSED: { label: 'مغلق', cls: 'sp-badge-gray' },
}

const PRIORITY_LABELS: Record<string, { label: string; cls: string }> = {
  low: { label: 'منخفض', cls: 'sp-badge-gray' },
  normal: { label: 'عادي', cls: 'sp-badge-yellow' },
  high: { label: 'عاجل', cls: 'sp-badge-red' },
}

export default async function AdminExpertCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  const cases = await prisma.expertCase.findMany({
    where: status ? { status: status as any } : {},
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: 50,
    include: {
      user: { select: { nameAr: true, email: true } },
      session: { select: { id: true, titleAr: true } },
    },
  })

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">حالات الخبراء</h1>
          <p className="text-sm text-gray-400">{cases.length} حالة</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {[
          { value: '', label: 'الكل' },
          { value: 'PENDING', label: 'في الانتظار' },
          { value: 'IN_REVIEW', label: 'قيد المراجعة' },
          { value: 'ASSIGNED', label: 'مخصص' },
          { value: 'IN_PROGRESS', label: 'جارٍ العمل' },
          { value: 'RESOLVED', label: 'محلول' },
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

      {/* Cases */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <i className="fa-solid fa-briefcase text-gray-200 text-4xl mb-3" />
          <p className="text-gray-400">لا توجد حالات بهذه الحالة.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => {
            const st = STATUS_LABELS[c.status] || { label: c.status, cls: 'sp-badge-gray' }
            const pr = PRIORITY_LABELS[c.priority] || { label: c.priority, cls: 'sp-badge-gray' }
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={st.cls}>{st.label}</span>
                    <span className={pr.cls}>{pr.label}</span>
                    {c.category && (
                      <span className="sp-badge-gray">{c.category}</span>
                    )}
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

                <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
                  {c.descriptionAr}
                </p>

                {c.adminNotes && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">ملاحظات الخبير</p>
                    <p className="text-sm text-green-800">{c.adminNotes}</p>
                  </div>
                )}

                <UpdateCaseForm
                  caseId={c.id}
                  currentStatus={c.status}
                  currentAssigned={c.assignedExpert || ''}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function UpdateCaseForm({
  caseId,
  currentStatus,
  currentAssigned,
}: {
  caseId: string
  currentStatus: string
  currentAssigned: string
}) {
  return (
    <form
      action={`/api/admin/expert-cases/${caseId}`}
      method="POST"
      className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100"
    >
      <input type="hidden" name="_method" value="PUT" />
      <select
        name="status"
        defaultValue={currentStatus}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
      >
        <option value="PENDING">في الانتظار</option>
        <option value="IN_REVIEW">قيد المراجعة</option>
        <option value="ASSIGNED">مخصص</option>
        <option value="IN_PROGRESS">جارٍ العمل</option>
        <option value="RESOLVED">محلول</option>
        <option value="CLOSED">مغلق</option>
      </select>
      <input
        name="assignedExpert"
        defaultValue={currentAssigned}
        placeholder="اسم الخبير المخصص"
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <button
        type="submit"
        className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
      >
        تحديث
      </button>
    </form>
  )
}
