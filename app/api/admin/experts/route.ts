import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: any) {
  return session?.user && (session.user as any).role === 'ADMIN'
}

export async function GET() {
  const session = await auth()
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [experts, candidates] = await Promise.all([
    prisma.expert.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, nameAr: true, email: true, role: true } } },
    }),
    prisma.user.findMany({
      where: { role: 'USER', isActive: true },
      select: { id: true, nameAr: true, email: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ])

  return NextResponse.json({ experts, candidates })
}

const createSchema = z.object({
  userId: z.string().min(1),
  title: z.string().max(120).optional(),
  specializations: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const parsed = createSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })

  const { userId, title, specializations, languages } = parsed.data

  // Only a regular USER may be promoted — never clobber an ADMIN's role.
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (!target) return NextResponse.json({ messageAr: 'المستخدم غير موجود.' }, { status: 404 })
  if (target.role === 'ADMIN') return NextResponse.json({ messageAr: 'لا يمكن تغيير دور مسؤول.' }, { status: 400 })

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { role: 'EXPERT' } }),
    prisma.expert.upsert({
      where: { userId },
      create: { userId, title, specializations, languages, isActive: true },
      update: { title, specializations, languages, isActive: true },
    }),
  ])

  await prisma.notification.create({
    data: {
      userId,
      type: 'ROLE_EXPERT',
      titleAr: 'تم تفعيلك كخبير',
      bodyAr: 'تم منحك صلاحية الخبير. افتح مساحة الخبير لمتابعة الحالات المُسندة إليك.',
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
