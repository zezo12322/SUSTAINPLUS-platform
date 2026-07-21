import { prisma } from '@/lib/prisma'
import { formatDateAr } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AdminUserManager } from './user-manager'
import { SubscriptionControl } from './subscription-control'
import { CreditsControl } from './credits-control'

export const metadata: Metadata = { title: 'تفاصيل المستخدم' }

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: { include: { plan: true } },
      usageRecords: { orderBy: { monthYear: 'desc' }, take: 3 },
      _count: { select: { chatSessions: true, payments: true, expertCases: true } },
    },
  })
  if (!user) notFound()

  const recentAudit = await prisma.auditLog.findMany({
    where: { details: { path: ['targetUserId'], equals: id } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, nameAr: true },
  })

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <Link href="/admin/users" className="text-sm text-primary-600 hover:underline">
          ← رجوع لقائمة المستخدمين
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.nameAr || '—'}</h1>
          <p className="text-sm text-gray-400" dir="ltr">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <span className={user.role === 'ADMIN' ? 'sp-badge-red' : user.role === 'EXPERT' ? 'sp-badge-yellow' : 'sp-badge-gray'}>
            {user.role === 'ADMIN' ? 'مدير' : user.role === 'EXPERT' ? 'خبير' : 'مستخدم'}
          </span>
          <span className={user.isActive ? 'sp-badge-green' : 'sp-badge-red'}>
            {user.isActive ? 'نشط' : 'موقوف'}
          </span>
        </div>
      </div>

      {/* Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="الباقة" value={user.subscription?.plan?.nameAr || 'مجاني'} />
        <Stat label="المحادثات" value={String(user._count.chatSessions)} />
        <Stat label="المدفوعات" value={String(user._count.payments)} />
        <Stat label="حالات الخبراء" value={String(user._count.expertCases)} />
        <Stat label="التوثيق" value={user.emailVerified ? 'موثّق' : 'غير موثّق'} />
        <Stat label="آخر دخول" value={user.lastLoginAt ? formatDateAr(user.lastLoginAt) : '—'} />
        <Stat label="تاريخ التسجيل" value={formatDateAr(user.createdAt)} />
        <Stat label="الاستهلاك (آخر شهر)" value={String(user.usageRecords[0]?.consultationsUsed ?? 0)} />
        <Stat label="رصيد مدفوع" value={String(user.paygCredits)} />
      </div>

      {/* Management form (client) */}
      <AdminUserManager
        user={{
          id: user.id,
          nameAr: user.nameAr,
          nameEn: user.nameEn,
          phone: user.phone,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        }}
      />

      {/* Subscription management */}
      <SubscriptionControl
        userId={user.id}
        plans={plans}
        current={{ planId: user.subscription?.planId ?? null, status: user.subscription?.status ?? null }}
      />

      {/* Manual prepaid-credit top-up */}
      <CreditsControl userId={user.id} current={user.paygCredits} />

      {/* Audit trail */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-gray-700 mb-3">سجل الإجراءات على هذا الحساب</h2>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {recentAudit.length === 0 && (
            <p className="p-4 text-sm text-gray-400">لا يوجد سجل بعد.</p>
          )}
          {recentAudit.map((a) => (
            <div key={a.id} className="p-3 flex items-center justify-between text-sm">
              <span className="text-gray-700">{a.action}</span>
              <span className="text-xs text-gray-400">{formatDateAr(a.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  )
}
