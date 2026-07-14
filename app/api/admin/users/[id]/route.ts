import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin, activeAdminCount } from '@/lib/admin'

const patchSchema = z.object({
  nameAr: z.string().min(2).max(100).optional(),
  nameEn: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'EXPERT', 'ADMIN']).optional(),
  emailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'بيانات غير صالحة.', errors: parsed.error.errors }, { status: 400 })
  }
  const data = parsed.data

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, isActive: true, email: true },
  })
  if (!target) return NextResponse.json({ messageAr: 'المستخدم غير موجود.' }, { status: 404 })

  // Guard: don't let the last active admin be demoted or deactivated.
  const losingAdmin =
    target.role === 'ADMIN' &&
    ((data.role && data.role !== 'ADMIN') || data.isActive === false)
  if (losingAdmin && (await activeAdminCount()) <= 1) {
    return NextResponse.json(
      { messageAr: 'لا يمكن إزالة آخر مدير نشط في النظام.' },
      { status: 409 }
    )
  }

  // Guard: an admin cannot demote or deactivate their own account (avoid self-lockout).
  if (id === admin.adminId && ((data.role && data.role !== 'ADMIN') || data.isActive === false)) {
    return NextResponse.json(
      { messageAr: 'لا يمكنك تغيير دور حسابك أو تعطيله بنفسك.' },
      { status: 409 }
    )
  }

  // Email uniqueness
  if (data.email && data.email.toLowerCase() !== target.email) {
    const clash = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() }, select: { id: true } })
    if (clash) return NextResponse.json({ messageAr: 'هذا البريد مستخدم بالفعل.' }, { status: 409 })
  }

  // Role change or deactivation must invalidate existing sessions.
  const roleChanged = data.role !== undefined && data.role !== target.role
  const deactivated = data.isActive === false && target.isActive === true

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(data.nameAr !== undefined ? { nameAr: data.nameAr } : {}),
      ...(data.nameEn !== undefined ? { nameEn: data.nameEn } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.email !== undefined ? { email: data.email.toLowerCase() } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
      ...(data.emailVerified !== undefined ? { emailVerified: data.emailVerified } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(roleChanged || deactivated ? { sessionVersion: { increment: 1 } } : {}),
    },
    select: { id: true, email: true, role: true, isActive: true, emailVerified: true },
  })

  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: 'ADMIN_USER_UPDATE',
      details: { targetUserId: id, changes: data },
    },
  })

  return NextResponse.json({ user: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  if (id === admin.adminId) {
    return NextResponse.json({ messageAr: 'لا يمكنك حذف حسابك بنفسك.' }, { status: 409 })
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true, isActive: true, email: true } })
  if (!target) return NextResponse.json({ messageAr: 'المستخدم غير موجود.' }, { status: 404 })

  if (target.role === 'ADMIN' && target.isActive && (await activeAdminCount()) <= 1) {
    return NextResponse.json({ messageAr: 'لا يمكن حذف آخر مدير نشط.' }, { status: 409 })
  }

  // Record the audit entry before deletion (cascades remove related rows).
  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: 'ADMIN_USER_DELETE',
      details: { targetUserId: id, email: target.email, role: target.role },
    },
  })

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
