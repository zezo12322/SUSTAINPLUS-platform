import { describe, it, expect, vi, beforeEach } from 'vitest'
import crypto from 'crypto'

const TEST_SECRET = 'test-hmac-secret-key'

// Must run before module imports so paymob.ts reads the right values at init time
vi.hoisted(() => {
  process.env.PAYMOB_HMAC_SECRET = 'test-hmac-secret-key'
  process.env.PAYMOB_API_KEY = 'test-api-key'
  process.env.PAYMOB_INTEGRATION_ID_CARD = '12345'
  process.env.PAYMOB_IFRAME_ID = '99999'
})

vi.mock('axios')

import { verifyPaymobHmac, createPaymobCheckout } from '@/lib/paymob'
import axios from 'axios'

beforeEach(() => {
  vi.clearAllMocks()
})

function buildParams(): Record<string, string> {
  return {
    amount_cents: '3500',
    created_at: '2024-01-01T00:00:00',
    currency: 'EGP',
    error_occured: 'false',
    has_parent_transaction: 'false',
    id: '123456',
    integration_id: '12345',
    is_3d_secure: 'true',
    is_auth: 'false',
    is_capture: 'false',
    is_refunded: 'false',
    is_standalone_payment: 'true',
    is_voided: 'false',
    order: '999',
    owner: '111',
    pending: 'false',
    source_data_pan: '1234',
    source_data_sub_type: 'MasterCard',
    source_data_type: 'card',
    success: 'true',
  }
}

function computeExpectedHmac(params: Record<string, string>): string {
  const concat = [
    params.amount_cents, params.created_at, params.currency, params.error_occured,
    params.has_parent_transaction, params.id, params.integration_id, params.is_3d_secure,
    params.is_auth, params.is_capture, params.is_refunded, params.is_standalone_payment,
    params.is_voided, params.order, params.owner, params.pending,
    params.source_data_pan, params.source_data_sub_type, params.source_data_type, params.success,
  ].join('')
  return crypto.createHmac('sha512', TEST_SECRET).update(concat).digest('hex')
}

describe('verifyPaymobHmac', () => {
  it('returns true for correctly signed payload', () => {
    const params = buildParams()
    const hmac = computeExpectedHmac(params)
    expect(verifyPaymobHmac(params, hmac)).toBe(true)
  })

  it('returns false when payload is tampered (amount changed)', () => {
    const params = buildParams()
    const hmac = computeExpectedHmac(params)
    params.amount_cents = '99999'
    expect(verifyPaymobHmac(params, hmac)).toBe(false)
  })

  it('returns false for wrong HMAC string', () => {
    const params = buildParams()
    expect(verifyPaymobHmac(params, 'completely-wrong-hmac')).toBe(false)
  })

  it('returns false for empty HMAC string', () => {
    const params = buildParams()
    expect(verifyPaymobHmac(params, '')).toBe(false)
  })
})

describe('createPaymobCheckout', () => {
  it('calls auth, createOrder, and paymentKey endpoints in sequence', async () => {
    const mockPost = vi.fn()
      .mockResolvedValueOnce({ data: { token: 'auth-token-123' } })
      .mockResolvedValueOnce({ data: { id: 'order-456' } })
      .mockResolvedValueOnce({ data: { token: 'payment-token-789' } })
    ;(axios as any).post = mockPost

    const result = await createPaymobCheckout({
      amountCents: 3500,
      merchantOrderId: 'merchant-order-001',
      description: 'استشارة بيئية',
      customerEmail: 'customer@test.com',
      customerFirstName: 'Ahmed',
      customerLastName: 'Ali',
      customerPhone: '+201234567890',
    })

    expect(mockPost).toHaveBeenCalledTimes(3)
    expect(mockPost.mock.calls[0][0]).toContain('auth/tokens')
    expect(mockPost.mock.calls[1][0]).toContain('ecommerce/orders')
    expect(mockPost.mock.calls[2][0]).toContain('payment_keys')
  })

  it('returns checkoutUrl containing payment token', async () => {
    const mockPost = vi.fn()
      .mockResolvedValueOnce({ data: { token: 'auth-token' } })
      .mockResolvedValueOnce({ data: { id: 'order-123' } })
      .mockResolvedValueOnce({ data: { token: 'pay-token-xyz' } })
    ;(axios as any).post = mockPost

    const result = await createPaymobCheckout({
      amountCents: 85000,
      merchantOrderId: 'order-002',
      description: 'اشتراك شهري',
      customerEmail: 'user@test.com',
      customerFirstName: 'Sara',
      customerLastName: 'Mohamed',
      customerPhone: '+201111111111',
    })

    expect(result.checkoutUrl).toContain('pay-token-xyz')
    expect(result.orderId).toBe('order-123')
    expect(result.paymentToken).toBe('pay-token-xyz')
  })
})
