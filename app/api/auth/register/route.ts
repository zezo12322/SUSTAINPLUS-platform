import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getMonthYear } from '@/lib/utils'
import { addMonths } from 'date-fns'
import { createOtp } from '@/lib/otp'
import { sendVerificationEmail } from '@/lib/email'
import { isDisposableEmail } from '@/lib/disposable-emails'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nameAr: z.string().min(2).max(100),
  privacyConsent: z.boolean(),
  termsAccepted: z.boolean(),
  fingerprint: z.string().length(64).optional().nullable(),
})

const MAX_REGISTRATIONS_PER_IP_PER_DAY = 3

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { messageAr: 'البيانات المدخلة غير صحيحة.' },
        { status: 400 }
      )
    }

    const { email, password, nameAr, privacyConsent, termsAccepted, fingerprint } = parsed.data

    if (!privacyConsent || !termsAccepted) {
      return NextResponse.json(
        { messageAr: 'يجب الموافقة على الشروط وسياسة الخصوصية.' },
        { status: 400 }
      )
    }

    // 1. Block disposable email domains
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { messageAr: 'يُرجى استخدام بريد إلكتروني حقيقي. لا يُقبل البريد المؤقت.' },
        { status: 400 }
      )
    }

    const ip = getClientIp(req)

    // 2. IP rate limit — max 3 registrations per IP per 24h
    if (ip !== 'unknown') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const recentCount = await prisma.auditLog.count({
        where: {
          action: 'USER_REGISTER',
          ipAddress: ip,
          createdAt: { gte: oneDayAgo },
        },
      })
      if (recentCount >= MAX_REGISTRATIONS_PER_IP_PER_DAY) {
        return NextResponse.json(
          { messageAr: 'تم تجاوز الحد المسموح به لإنشاء الحسابات من هذا الجهاز. يُرجى المحاولة لاحقاً.' },
          { status: 429 }
        )
      }
    }

    // 3. Device fingerprint — block if this device already has an account
    if (fingerprint) {
      const existingDevice = await prisma.user.findFirst({
        where: { deviceFingerprint: fingerprint },
        select: { id: true },
      })
      if (existingDevice) {
        return NextResponse.json(
          { messageAr: 'يوجد حساب مسجّل بالفعل على هذا الجهاز. يُرجى تسجيل الدخول.' },
          { status: 409 }
        )
      }
    }

    // 4. Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { messageAr: 'هذا البريد الإلكتروني مسجّل بالفعل. يُرجى تسجيل الدخول.' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const freePlan = await prisma.plan.findUnique({ where: { slug: 'free' } })

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          nameAr,
          passwordHash,
          privacyConsent,
          termsAccepted,
          role: 'USER',
          deviceFingerprint: fingerprint ?? null,
        },
      })

      if (freePlan) {
        const now = new Date()
        await tx.subscription.create({
          data: {
            userId: user.id,
            planId: freePlan.id,
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd: addMonths(now, 1),
          },
        })
      }

      await tx.usageRecord.create({
        data: {
          userId: user.id,
          monthYear: getMonthYear(),
          consultationsUsed: 0,
        },
      })

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTER',
          ipAddress: ip,
          details: { email: user.email, planSlug: 'free' },
        },
      })
    })

    // Send verification email (non-blocking)
    const createdUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    })
    if (createdUser) {
      createOtp(createdUser.id, 'EMAIL_VERIFY')
        .then((code) => sendVerificationEmail(email.toLowerCase(), nameAr, code))
        .catch(console.error)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { messageAr: 'حدث خطأ في الخادم. يُرجى المحاولة لاحقاً.' },
      { status: 500 }
    )
  }
}
