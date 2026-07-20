import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, activeAdminCount } from '@/lib/admin'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.redirect(new URL('/admin/users', req.url))

  const { id } = await params

  // An admin cannot deactivate their own account (self-lockout).
  if (id === admin.adminId) {
    return NextResponse.redirect(new URL('/admin/users?error=self', req.url))
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { isActive: true, role: true } })
  if (!user) return NextResponse.redirect(new URL('/admin/users', req.url))

  // Never deactivate the last remaining active admin.
  if (user.isActive && user.role === 'ADMIN' && (await activeAdminCount()) <= 1) {
    return NextResponse.redirect(new URL('/admin/users?error=last_admin', req.url))
  }

  await prisma.user.update({
    where: { id },
    // Deactivating bumps sessionVersion so the target's live sessions are cut off.
    data: {
      isActive: !user.isActive,
      ...(user.isActive ? { sessionVersion: { increment: 1 } } : {}),
    },
  })
  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: user.isActive ? 'USER_DEACTIVATE' : 'USER_ACTIVATE',
      details: { targetUserId: id },
    },
  })

  return NextResponse.redirect(new URL('/admin/users', req.url))
}
