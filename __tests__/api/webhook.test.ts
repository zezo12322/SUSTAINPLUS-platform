import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    payment: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/paymob', () => ({
  verifyPaymobHmac: vi.fn(),
}))

import { POST } from '@/app/api/payments/webhook/route'
import { prisma } from '@/lib/prisma'
import { verifyPaymobHmac } from '@/lib/paymob'

function makeWebhookRequest(body: object, hmac = 'test-hmac') {
  return new NextRequest(
    `http://localhost:3001/api/payments/webhook?hmac=${hmac}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

const baseTransaction = {
  id: 'txn-123',
  success: true,
  amount_cents: 3500,
  created_at: '2024-01-01T00:00:00',
  currency: 'EGP',
  order: { id: 'order-999' },
  error_occured: false,
  has_parent_transaction: false,
  integration_id: '12345',
  is_3d_secure: false,
  is_auth: false,
  is_capture: false,
  is_refunded: false,
  is_standalone_payment: true,
  is_voided: false,
  owner: '111',
  pending: false,
  source_data: { pan: '1234', sub_type: 'MasterCard', type: 'card' },
}

const pendingSubscriptionPayment = {
  id: 'pay-1',
  status: 'PENDING',
  userId: 'user-1',
  type: 'SUBSCRIPTION',
  metadata: { planSlug: 'standard' },
  paymobOrderId: 'order-999',
  user: { id: 'user-1' },
}

beforeEach(() => {
  vi.clearAllMocks()
  // The webhook now fails closed: a configured HMAC secret is required.
  process.env.PAYMOB_HMAC_SECRET = 'test-secret'
  vi.mocked(verifyPaymobHmac).mockReturnValue(true)
})

describe('POST /api/payments/webhook', () => {
  it('returns 200 and ignores non-TRANSACTION event types', async () => {
    const res = await POST(makeWebhookRequest({ type: 'TOKEN', obj: {} }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.received).toBe(true)
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('returns 400 when HMAC verification fails', async () => {
    process.env.PAYMOB_HMAC_SECRET = 'secret'
    vi.mocked(verifyPaymobHmac).mockReturnValueOnce(false)

    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: baseTransaction }, 'wrong-hmac'))
    expect(res.status).toBe(400)
  })

  it('returns 500 and does not process when HMAC secret is not configured (fail closed)', async () => {
    delete process.env.PAYMOB_HMAC_SECRET

    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: baseTransaction }))
    expect(res.status).toBe(500)
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('returns 200 when payment record not found', async () => {
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce(null)
    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: baseTransaction }))
    expect(res.status).toBe(200)
  })

  it('returns 200 without transaction for already-processed (non-PENDING) payment', async () => {
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce({
      ...pendingSubscriptionPayment,
      status: 'PAID',
    } as any)

    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: baseTransaction }))
    expect(res.status).toBe(200)
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('calls $transaction for SUBSCRIPTION payment with success=true', async () => {
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce(pendingSubscriptionPayment as any)
    vi.mocked(prisma.$transaction).mockResolvedValueOnce(undefined)

    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: baseTransaction }))
    expect(res.status).toBe(200)
    expect(prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('calls $transaction for CONSULTATION_PACK payment', async () => {
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce({
      ...pendingSubscriptionPayment,
      type: 'CONSULTATION_PACK',
      metadata: { packId: 'pack_10' },
    } as any)
    vi.mocked(prisma.$transaction).mockResolvedValueOnce(undefined)

    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: baseTransaction }))
    expect(res.status).toBe(200)
    expect(prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('marks payment FAILED and creates audit log when success=false', async () => {
    vi.mocked(prisma.payment.findUnique).mockResolvedValueOnce(pendingSubscriptionPayment as any)

    let txPaymentUpdate: any
    vi.mocked(prisma.$transaction).mockImplementationOnce(async (fn: any) => {
      const tx = {
        payment: {
          update: vi.fn().mockImplementation((args: any) => {
            txPaymentUpdate = args
            return Promise.resolve({})
          }),
        },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
        notification: { create: vi.fn().mockResolvedValue({}) },
        subscription: { upsert: vi.fn().mockResolvedValue({}) },
        usageRecord: { upsert: vi.fn().mockResolvedValue({}) },
        plan: { findUnique: vi.fn().mockResolvedValue(null) },
      }
      return fn(tx)
    })

    const failedTxn = { ...baseTransaction, success: false }
    const res = await POST(makeWebhookRequest({ type: 'TRANSACTION', obj: failedTxn }))
    expect(res.status).toBe(200)
    expect(txPaymentUpdate?.data?.status).toBe('FAILED')
  })
})
