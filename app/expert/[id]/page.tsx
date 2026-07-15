import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateTimeAr } from '@/lib/utils'
import { ExpertCaseActions } from '@/components/expert/expert-case-actions'
import { EscalationThread } from '@/components/expert/escalation-thread'

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

export default async function ExpertCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const role = (session!.user as any).role

  const c = await prisma.expertCase.findUnique({
    where: { id },
    include: {
      user: { select: { nameAr: true, nameEn: true, email: true, phone: true } },
      session: { include: { messages: { orderBy: { createdAt: 'asc' } } } },
    },
  })

  if (!c) notFound()
  // An expert may only open a case assigned to them; admins may view any.
  if (role !== 'ADMIN' && c.assignedExpertId !== session!.user!.id) redirect('/expert')

  const st = STATUS_LABELS[c.status] || { label: c.status, cls: 'sp-badge-gray' }
  const transcript = c.session?.messages.filter((m) => m.role !== 'SYSTEM') ?? []

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Link href="/expert" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700 mb-4">
        <i className="fa-solid fa-arrow-right text-xs" />
        رجوع للحالات
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className={st.cls}>{st.label}</span>
          {c.category && <span className="sp-badge-gray">{c.category}</span>}
          <span className="text-xs text-gray-400 mr-auto">{formatDateTimeAr(c.createdAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-user text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{c.user.nameAr || c.user.nameEn || '—'}</p>
            <p className="text-xs text-gray-400">
              {c.user.email}
              {c.user.phone ? ` · ${c.user.phone}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* AI summary */}
      {c.aiSummaryAr && (
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 mb-5">
          <p className="text-sm font-bold text-gold-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles" />
            ملخّص الذكاء الاصطناعي
          </p>
          <p className="text-sm text-gold-900 leading-relaxed whitespace-pre-line">{c.aiSummaryAr}</p>
        </div>
      )}

      {/* User's optional note */}
      {c.userNote && (
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-5">
          <p className="text-sm font-bold text-primary-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-note-sticky" />
            ملاحظة العميل
          </p>
          <p className="text-sm text-primary-900 leading-relaxed whitespace-pre-line">{c.userNote}</p>
        </div>
      )}

      {/* User's note / request */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <p className="text-sm font-bold text-gray-800 mb-2">طلب العميل</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{c.descriptionAr}</p>
      </div>

      {/* Read-only AI consultation transcript */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-primary-600" />
          سجل المحادثة مع المساعد الذكي
          <span className="text-xs font-normal text-gray-400">(للقراءة فقط)</span>
        </p>
        {transcript.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            لا توجد محادثة مرتبطة بهذه الحالة.
          </p>
        ) : (
          <div className="space-y-3">
            {transcript.map((m) => {
              const isUser = m.role === 'USER'
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-gray-100 text-gray-800 rounded-tr-none'
                        : 'bg-primary-50 text-primary-900 rounded-tl-none border border-primary-100'
                    }`}
                  >
                    <p className="text-[10px] font-semibold mb-1 opacity-60">
                      {isUser ? 'العميل' : 'المساعد الذكي'}
                    </p>
                    {m.content}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Expert status actions */}
      <div className="mb-5">
        <ExpertCaseActions caseId={c.id} currentStatus={c.status} />
      </div>

      {/* Reply thread with the client */}
      <EscalationThread caseId={c.id} viewerRole="expert" disabled={c.status === 'CLOSED'} />
    </div>
  )
}
