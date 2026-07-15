import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: any) {
  return session?.user && (session.user as any).role === 'ADMIN'
}

const patchSchema = z.object({
  title: z.string().max(120).optional(),
  specializations: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  demote: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const expert = await prisma.expert.findUnique({ where: { id }, select: { userId: true } })
  if (!expert) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ messageAr: 'بيانات غير صالحة.' }, { status: 400 })

  // Demote: revoke EXPERT role and deactivate the profile (kept for history).
  if (parsed.data.demote) {
    await prisma.$transaction([
      prisma.user.update({ where: { id: expert.userId }, data: { role: 'USER' } }),
      prisma.expert.update({ where: { id }, data: { isActive: false } }),
      // Unassign their still-open cases so a demoted expert loses access and the
      // cases return to the queue for reassignment.
      prisma.expertCase.updateMany({
        where: {
          assignedExpertId: expert.userId,
          status: { notIn: ['RESOLVED', 'CLOSED', 'CONVERTED_TO_BOOKING'] },
        },
        data: { assignedExpertId: null, status: 'PENDING' },
      }),
    ])
    return NextResponse.json({ ok: true, demoted: true })
  }

  const { title, specializations, languages, isActive } = parsed.data
  await prisma.expert.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(specializations ? { specializations } : {}),
      ...(languages ? { languages } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  })

  return NextResponse.json({ ok: true })
}
