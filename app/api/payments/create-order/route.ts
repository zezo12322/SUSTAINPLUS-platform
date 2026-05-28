import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPaymobCheckout, isPaymobConfigured } from '@/lib/paymob'
import { PLANS, CONSULTATION_PACKS, MIN_PAYG_PRICE_PIASTERS } from '@/lib/constants'
import { nanoid } from 'nanoid'

const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('SUBSCRIPTION'),
    planSlug: z.enum(['standard', 'premium', 'business', 'payg']),
  }),
  z.object({
    type: z.literal('CONSULTATION_PACK'),
    packId: z.enum(['pack_1', 'pack_10', 'pack_25']),
  }),
  z.object({
    type: z.literal('PAYG_CONSULTATION'),
  }),
])

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, nameAr: true, nameEn: true, phone: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let amountPiasters: number
    let description: string
    const merchantOrderId = nanoid(16)
    const orderData = parsed.data

    if (orderData.type === 'SUBSCRIPTION') {
      const plan = Object.values(PLANS).find((p) => p.slug === orderData.planSlug)
      if (!plan || !('pricePiasters' in plan) || (plan as any).pricePiasters <= 0) {
        return NextResponse.json({ messageAr: 'الباقة المحددة غير صالحة للدفع.' }, { status: 400 })
      }
      amountPiasters = (plan as any).pricePiasters
      description = `اشتراك ساستين بلس - ${plan.nameAr}`
    } else if (orderData.type === 'CONSULTATION_PACK') {
      const pack = CONSULTATION_PACKS.find((p) => p.id === orderData.packId)
      if (!pack) return NextResponse.json({ messageAr: 'الباقة غير موجودة.' }, { status: 400 })
      amountPiasters = pack.pricePiasters
      if (amountPiasters < MIN_PAYG_PRICE_PIASTERS) {
        return NextResponse.json({ messageAr: 'المبلغ أقل من الحد الأدنى المسموح.' }, { status: 400 })
      }
      description = `${pack.labelAr} - ساستين بلس`
    } else {
      amountPiasters = MIN_PAYG_PRICE_PIASTERS
      description = 'استشارة واحدة - دفع حسب الاستخدام'
    }

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amountPiasters,
        type: orderData.type,
        status: 'PENDING',
        description,
        metadata: { merchantOrderId, ...orderData },
      },
    })

    // If Paymob not configured, return a test/dev response
    if (!isPaymobConfigured()) {
      return NextResponse.json({
        checkoutUrl: null,
        orderId: null,
        paymentId: payment.id,
        messageAr: 'بوابة الدفع غير مُهيأة بعد. يُرجى إضافة مفاتيح Paymob في ملف البيئة.',
        devMode: true,
      })
    }

    const nameParts = (user.nameAr || user.nameEn || 'مستخدم').split(' ')
    const checkout = await createPaymobCheckout({
      amountCents: amountPiasters,
      merchantOrderId,
      description,
      customerEmail: user.email,
      customerFirstName: nameParts[0],
      customerLastName: nameParts.slice(1).join(' ') || 'NA',
      customerPhone: user.phone || '+20000000000',
    })

    // Update payment with Paymob order ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { paymobOrderId: checkout.orderId },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PAYMENT_CREATE_ORDER',
        details: { paymentId: payment.id, type: orderData.type, amountPiasters },
      },
    })

    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      orderId: checkout.orderId,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ messageAr: 'حدث خطأ في معالجة طلب الدفع.' }, { status: 500 })
  }
}
