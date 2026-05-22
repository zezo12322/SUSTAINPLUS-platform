import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPaymobHmac } from '@/lib/paymob'
import { addMonths } from 'date-fns'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { obj, type } = body

    if (type !== 'TRANSACTION') {
      return NextResponse.json({ received: true })
    }

    const hmac = req.nextUrl.searchParams.get('hmac') || ''
    const transactionData = obj as Record<string, any>

    // Verify HMAC signature
    if (process.env.PAYMOB_HMAC_SECRET) {
      const params = {
        amount_cents: String(transactionData.amount_cents),
        created_at: String(transactionData.created_at),
        currency: String(transactionData.currency),
        error_occured: String(transactionData.error_occured),
        has_parent_transaction: String(transactionData.has_parent_transaction),
        id: String(transactionData.id),
        integration_id: String(transactionData.integration_id),
        is_3d_secure: String(transactionData.is_3d_secure),
        is_auth: String(transactionData.is_auth),
        is_capture: String(transactionData.is_capture),
        is_refunded: String(transactionData.is_refunded),
        is_standalone_payment: String(transactionData.is_standalone_payment),
        is_voided: String(transactionData.is_voided),
        order: String(transactionData.order?.id),
        owner: String(transactionData.owner),
        pending: String(transactionData.pending),
        source_data_pan: String(transactionData.source_data?.pan),
        source_data_sub_type: String(transactionData.source_data?.sub_type),
        source_data_type: String(transactionData.source_data?.type),
        success: String(transactionData.success),
      }

      const valid = verifyPaymobHmac(params, hmac)
      if (!valid) {
        console.error('Invalid Paymob HMAC signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    }

    const paymobOrderId = String(transactionData.order?.id || transactionData.order)
    const success = transactionData.success === true || transactionData.success === 'true'
    const paymobTrxId = String(transactionData.id)

    const payment = await prisma.payment.findUnique({
      where: { paymobOrderId },
      include: { user: true },
    })

    if (!payment) {
      console.log('Payment not found for order:', paymobOrderId)
      return NextResponse.json({ received: true })
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json({ received: true })
    }

    await prisma.$transaction(async (tx) => {
      // Update payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: success ? 'PAID' : 'FAILED',
          paymobTrxId,
        },
      })

      if (!success) {
        await tx.auditLog.create({
          data: {
            userId: payment.userId,
            action: 'PAYMENT_FAILED',
            details: { paymentId: payment.id, paymobTrxId },
          },
        })
        return
      }

      const metadata = payment.metadata as Record<string, any>

      if (payment.type === 'SUBSCRIPTION') {
        const planSlug = metadata?.planSlug as string
        const plan = await tx.plan.findUnique({ where: { slug: planSlug } })
        if (plan) {
          const now = new Date()
          await tx.subscription.upsert({
            where: { userId: payment.userId },
            create: {
              userId: payment.userId,
              planId: plan.id,
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: addMonths(now, 1),
              paymobOrderId,
            },
            update: {
              planId: plan.id,
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: addMonths(now, 1),
              paymobOrderId,
            },
          })
        }
      } else if (payment.type === 'CONSULTATION_PACK') {
        const pack = metadata?.packId as string
        const PACK_COUNTS: Record<string, number> = { pack_1: 1, pack_10: 10, pack_25: 25 }
        const count = PACK_COUNTS[pack] || 1

        const monthYear = new Date().toISOString().slice(0, 7)
        await tx.usageRecord.upsert({
          where: { userId_monthYear: { userId: payment.userId, monthYear } },
          create: { userId: payment.userId, monthYear, paygCredits: count },
          update: { paygCredits: { increment: count } },
        })
      } else if (payment.type === 'PAYG_CONSULTATION') {
        const monthYear = new Date().toISOString().slice(0, 7)
        await tx.usageRecord.upsert({
          where: { userId_monthYear: { userId: payment.userId, monthYear } },
          create: { userId: payment.userId, monthYear, paygCredits: 1 },
          update: { paygCredits: { increment: 1 } },
        })
      }

      // Notify user
      await tx.notification.create({
        data: {
          userId: payment.userId,
          type: 'PAYMENT_SUCCESS',
          titleAr: 'تم الدفع بنجاح',
          bodyAr: `تمت معالجة دفعتك بنجاح. يمكنك الآن الاستفادة من ميزاتك الجديدة.`,
        },
      })

      await tx.auditLog.create({
        data: {
          userId: payment.userId,
          action: 'PAYMENT_SUCCESS',
          details: { paymentId: payment.id, type: payment.type, paymobTrxId },
        },
      })
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
