'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PLANS, CONSULTATION_PACKS } from '@/lib/constants'

interface SubscriptionData {
  plan: { slug: string; nameAr: string; pricePiasters: number; consultationsPerMonth: number }
  status: string
  currentPeriodEnd: string
  used: number
  remaining: number
  pct: number
  paygCredits: number
  payments: Array<{
    id: string
    amountPiasters: number
    type: string
    status: string
    createdAt: string
  }>
}

const PLAN_ORDER = ['free', 'payg', 'standard', 'premium', 'business']

function formatEGP(piasters: number) {
  return `${(piasters / 100).toLocaleString('ar-EG')} ج.م`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PAID: { label: 'مدفوع', cls: 'sp-badge-green' },
    PENDING: { label: 'معلق', cls: 'sp-badge-yellow' },
    FAILED: { label: 'فشل', cls: 'sp-badge-red' },
    REFUNDED: { label: 'مسترد', cls: 'sp-badge-gray' },
  }
  const s = map[status] || { label: status, cls: 'sp-badge-gray' }
  return <span className={s.cls}>{s.label}</span>
}

function TypeLabel({ type }: { type: string }) {
  const map: Record<string, string> = {
    SUBSCRIPTION: 'اشتراك',
    PAYG_CONSULTATION: 'دفع حسب الاستخدام',
    CONSULTATION_PACK: 'باقة استشارات',
  }
  return <>{map[type] || type}</>
}

export default function BillingPage() {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null)
  const [packLoading, setPackLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/billing')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  async function handleUpgrade(planSlug: string) {
    setUpgradeLoading(planSlug)
    setMessage('')
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SUBSCRIPTION', planSlug }),
      })
      const result = await res.json()
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        setMessage(result.messageAr || 'حدث خطأ. يُرجى المحاولة لاحقاً.')
      }
    } finally {
      setUpgradeLoading(null)
    }
  }

  async function handleBuyPack(packId: string) {
    setPackLoading(packId)
    setMessage('')
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONSULTATION_PACK', packId }),
      })
      const result = await res.json()
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        setMessage(result.messageAr || 'حدث خطأ.')
      }
    } finally {
      setPackLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">جاري تحميل بيانات الاشتراك...</span>
        </div>
      </div>
    )
  }

  const currentPlanSlug = data?.plan?.slug || 'free'
  const currentPlanIdx = PLAN_ORDER.indexOf(currentPlanSlug)

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">اشتراكي والفواتير</h1>

      {message && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
          {message}
        </div>
      )}

      {/* Current plan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">باقتك الحالية</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{data?.plan?.nameAr || 'مجاني'}</h2>
              <span className="sp-badge-green">
                <i className="fa-solid fa-circle-check" />
                نشط
              </span>
            </div>
            {data?.currentPeriodEnd && (
              <p className="text-xs text-gray-400 mt-1">
                تجديد في {formatDate(data.currentPeriodEnd)}
              </p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-400">الاستشارات</p>
            <p className="text-2xl font-bold text-primary-700">
              {data?.used ?? 0} / {data?.plan?.consultationsPerMonth ?? 3}
            </p>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1 mr-auto">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${data?.pct ?? 0}%` }}
              />
            </div>
            {(data?.paygCredits ?? 0) > 0 && (
              <p className="text-xs font-semibold text-gold-600 mt-2">
                <i className="fa-solid fa-coins ml-1" />
                رصيد مدفوع: {data?.paygCredits} استشارة
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Plan upgrade */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-5">ترقية الباقة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[PLANS.STANDARD, PLANS.PREMIUM, PLANS.BUSINESS].map((plan) => {
            const planIdx = PLAN_ORDER.indexOf(plan.slug)
            const isCurrent = plan.slug === currentPlanSlug
            const isDowngrade = planIdx < currentPlanIdx

            return (
              <div
                key={plan.slug}
                className={`border-2 rounded-xl p-4 transition-all ${
                  isCurrent
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-primary-200'
                }`}
              >
                <p className="font-bold text-gray-800">{plan.nameAr}</p>
                <p className="mt-1 flex items-baseline gap-1 text-lg font-bold text-primary-700">
                  <span>{plan.pricePiasters / 100} ج.م</span>
                  <span className="text-xs font-normal text-gray-400">/شهر</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{plan.consultationsPerMonth} استشارة/شهر</p>
                {isCurrent ? (
                  <span className="mt-3 inline-block w-full text-center text-xs font-semibold text-primary-600 bg-primary-100 py-1.5 rounded-lg">
                    باقتك الحالية
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.slug)}
                    disabled={!!upgradeLoading || isDowngrade}
                    className="mt-3 w-full text-sm font-semibold bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-2 rounded-lg transition-colors"
                  >
                    {upgradeLoading === plan.slug ? 'جاري المعالجة...' : isDowngrade ? 'خفض الباقة' : 'ترقية'}
                  </button>
                )}
              </div>
            )
          })}

          {/* PAYG */}
          <div className="border-2 border-gray-100 hover:border-gold-300 rounded-xl p-4 transition-all">
            <p className="font-bold text-gray-800">{PLANS.PAYG.nameAr}</p>
            <p className="mt-1 flex items-baseline gap-1 text-lg font-bold text-gold-600">
              <span>٣٥ ج.م</span>
              <span className="text-xs font-normal text-gray-400">/استشارة</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">دفع مسبق قبل الاستخدام</p>
            <Link
              href="#packs"
              className="mt-3 inline-block w-full text-center text-sm font-semibold border-2 border-gold-400 text-gold-600 hover:bg-gold-50 py-1.5 rounded-lg transition-colors"
            >
              شحن رصيد
            </Link>
          </div>
        </div>
      </div>

      {/* Consultation packs */}
      <div id="packs" className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-2">استشارات إضافية</h2>
        <p className="text-sm text-gray-400 mb-5">أضف استشارات لباقتك الحالية في أي وقت.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONSULTATION_PACKS.map((pack) => (
            <div key={pack.id} className="border-2 border-gray-100 hover:border-primary-300 rounded-xl p-5 transition-all">
              <p className="text-2xl font-bold text-gray-900">{pack.labelAr}</p>
              <p className="text-xl font-bold text-primary-700 mt-1">
                {pack.pricePiasters / 100} ج.م
              </p>
              <p className="text-xs text-gray-400 mb-4">
                {pack.pricePiasters / 100 / pack.count} ج.م / استشارة
              </p>
              <button
                onClick={() => handleBuyPack(pack.id)}
                disabled={!!packLoading}
                className="w-full text-sm font-semibold bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white py-2 rounded-lg transition-colors"
              >
                {packLoading === pack.id ? 'جاري...' : 'شراء'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          * الحد الأدنى للاستشارة الواحدة ٣٥ جنيهاً مصرياً في جميع الأحوال.
        </p>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-5">سجل المدفوعات</h2>
        {!data?.payments?.length ? (
          <p className="text-center text-gray-400 text-sm py-8">لا توجد مدفوعات بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-gray-400 text-xs border-b border-gray-100">
                  <th className="pb-3 font-medium">النوع</th>
                  <th className="pb-3 font-medium">المبلغ</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 text-gray-700"><TypeLabel type={p.type} /></td>
                    <td className="py-3 font-semibold text-gray-900">{formatEGP(p.amountPiasters)}</td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3 text-gray-400">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
