import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.notification.count({ where: { userId: session.user.id, isRead: false } }),
  ])

  return NextResponse.json({ notifications, unreadCount })
}

const patchSchema = z.object({ id: z.string().optional(), all: z.boolean().optional() })

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })

  const { id, all } = parsed.data
  if (all) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })
  } else if (id) {
    // Scope by userId so a user can only mark their own notification read.
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { isRead: true },
    })
  }

  return NextResponse.json({ ok: true })
}

// TODO: notify via channel service (email / WhatsApp) — out of scope for V1.
