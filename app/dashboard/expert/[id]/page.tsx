import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateTimeAr } from '@/lib/utils'
import { EscalationThread } from '@/components/expert/escalation-thread'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: { absolute: 'طلب التصعيد | ساستين بلس' } }

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'في الانتظار', cls: 'sp-badge-yellow' },
  IN_REVIEW: { label: 'قيد المراجعة', cls: 'sp-badge-yellow' },
  ASSIGNED: { label: 'تم التخصيص', cls: 'sp-badge-green' },
  IN_PROGRESS: { label: 'جارٍ العمل', cls: 'sp-badge-green' },
  ANSWERED: { label: 'تمت الإجابة', cls: 'sp-badge-green' },
  RESOLVED: { label: 'تم الحل', cls: 'sp-badge-gray' },
  CONVERTED_TO_BOOKING: { label: 'محوّل لحجز', cls: 'sp-badge-gray' },
  CLOSED: { label: 'مغلق', cls: 'sp-badge-gray' },
}

export default async function UserEscalationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const c = await prisma.expertCase.findUnique({
    where: { id },
    include: { assignedExpertUser: { select: { nameAr: true, nameEn: true } } },
  })

  if (!c) notFound()
  if (c.userId !== session!.user!.id) redirect('/dashboard/expert')

  const st = STATUS_LABELS[c.status] || { label: c.status, cls: 'sp-badge-gray' }
  const expertName = c.assignedExpertUser?.nameAr || c.assignedExpertUser?.nameEn

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <Link href="/dashboard/expert" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700 mb-4">
        <i className="fa-solid fa-arrow-right text-xs" />
        رجوع لطلباتي
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={st.cls}>{st.label}</span>
          {c.category && <span className="sp-badge-gray">{c.category}</span>}
          <span className="text-xs text-gray-400 mr-auto">{formatDateTimeAr(c.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{c.descriptionAr}</p>
        {expertName && (
          <p className="mt-4 text-xs text-gray-500">
            <i className="fa-solid fa-user-doctor text-primary-500 ms-1" />
            الخبير المسؤول: <span className="font-semibold text-gray-700">{expertName}</span>
          </p>
        )}
      </div>

      <EscalationThread caseId={c.id} viewerRole="user" disabled={c.status === 'CLOSED'} />
    </div>
  )
}
