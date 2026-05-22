import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getMonthYear } from '@/lib/utils'
import { addMonths } from 'date-fns'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nameAr: z.string().min(2).max(100),
  privacyConsent: z.boolean(),
  termsAccepted: z.boolean(),
})

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

    const { email, password, nameAr, privacyConsent, termsAccepted } = parsed.data

    if (!privacyConsent || !termsAccepted) {
      return NextResponse.json(
        { messageAr: 'يجب الموافقة على الشروط وسياسة الخصوصية.' },
        { status: 400 }
      )
    }

    // Check existing user
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

    // Create user + free subscription in one transaction
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

      // Initialize usage record for current month
      await tx.usageRecord.create({
        data: {
          userId: user.id,
          monthYear: getMonthYear(),
          consultationsUsed: 0,
        },
      })

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTER',
          details: { email: user.email, planSlug: 'free' },
        },
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { messageAr: 'حدث خطأ في الخادم. يُرجى المحاولة لاحقاً.' },
      { status: 500 }
    )
  }
}
