import axios from 'axios'
import crypto from 'crypto'

const PAYMOB_API_URL = 'https://accept.paymob.com/api'
const API_KEY = process.env.PAYMOB_API_KEY!
const HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!
const INTEGRATION_ID_CARD = process.env.PAYMOB_INTEGRATION_ID_CARD!
const IFRAME_ID = process.env.PAYMOB_IFRAME_ID!

export interface PaymobOrderItem {
  name: string
  amount_cents: number
  description: string
  quantity: number
}

export interface PaymobCreateOrderResult {
  checkoutUrl: string
  orderId: string
  paymentToken: string
}

// Step 1: Authenticate and get auth token
async function getAuthToken(): Promise<string> {
  const response = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
    api_key: API_KEY,
  })
  return response.data.token
}

// Step 2: Create order
async function createOrder(
  authToken: string,
  amountCents: number,
  items: PaymobOrderItem[],
  merchantOrderId: string
): Promise<string> {
  const response = await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`, {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: 'EGP',
    merchant_order_id: merchantOrderId,
    items,
  })
  return response.data.id
}

// Step 3: Get payment key
async function getPaymentKey(
  authToken: string,
  orderId: string,
  amountCents: number,
  billingData: Record<string, string>
): Promise<string> {
  const response = await axios.post(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: billingData,
    currency: 'EGP',
    integration_id: INTEGRATION_ID_CARD,
    lock_order_when_paid: true,
  })
  return response.data.token
}

// Full flow: authenticate → create order → get payment key → return iframe URL
export async function createPaymobCheckout(params: {
  amountCents: number
  merchantOrderId: string
  description: string
  customerEmail: string
  customerFirstName: string
  customerLastName: string
  customerPhone: string
}): Promise<PaymobCreateOrderResult> {
  const {
    amountCents,
    merchantOrderId,
    description,
    customerEmail,
    customerFirstName,
    customerLastName,
    customerPhone,
  } = params

  const authToken = await getAuthToken()

  const items: PaymobOrderItem[] = [
    {
      name: description,
      amount_cents: amountCents,
      description,
      quantity: 1,
    },
  ]

  const orderId = await createOrder(authToken, amountCents, items, merchantOrderId)

  const billingData = {
    apartment: 'NA',
    email: customerEmail,
    floor: 'NA',
    first_name: customerFirstName || 'Customer',
    street: 'NA',
    building: 'NA',
    phone_number: customerPhone || '+20000000000',
    shipping_method: 'NA',
    postal_code: 'NA',
    city: 'Cairo',
    country: 'EG',
    last_name: customerLastName || 'NA',
    state: 'Cairo',
  }

  const paymentToken = await getPaymentKey(
    authToken,
    String(orderId),
    amountCents,
    billingData
  )

  const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`

  return {
    checkoutUrl,
    orderId: String(orderId),
    paymentToken,
  }
}

// Verify webhook HMAC signature
export function verifyPaymobHmac(
  params: Record<string, string>,
  receivedHmac: string
): boolean {
  const concatenation = [
    params.amount_cents,
    params.created_at,
    params.currency,
    params.error_occured,
    params.has_parent_transaction,
    params.id,
    params.integration_id,
    params.is_3d_secure,
    params.is_auth,
    params.is_capture,
    params.is_refunded,
    params.is_standalone_payment,
    params.is_voided,
    params.order,
    params.owner,
    params.pending,
    params.source_data_pan,
    params.source_data_sub_type,
    params.source_data_type,
    params.success,
  ].join('')

  const calculated = crypto
    .createHmac('sha512', HMAC_SECRET)
    .update(concatenation)
    .digest('hex')

  return calculated === receivedHmac
}

export function isPaymobConfigured(): boolean {
  return !!(
    process.env.PAYMOB_API_KEY &&
    process.env.PAYMOB_HMAC_SECRET &&
    process.env.PAYMOB_INTEGRATION_ID_CARD &&
    process.env.PAYMOB_IFRAME_ID
  )
}
