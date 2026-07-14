import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { requireAdmin } from '@/lib/admin'

const schema = z.object({
  // If omitted, a strong temporary password is generated and returned once.
  newPassword: z.string().min(8).max(128).optional(),
})

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join('') + '!9'
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body ?? {})
  if (!parsed.success) {
    return NextResponse.json({ messageAr: 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل.' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!target) return NextResponse.json({ messageAr: 'المستخدم غير موجود.' }, { status: 404 })

  const tempPassword = parsed.data.newPassword ?? generateTempPassword()
  const passwordHash = await hashPassword(tempPassword)

  await prisma.user.update({
    where: { id },
    data: {
      passwordHash,
      // invalidate existing sessions + clear any lockout
      sessionVersion: { increment: 1 },
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: admin.adminId,
      action: 'ADMIN_USER_RESET_PASSWORD',
      details: { targetUserId: id, generated: !parsed.data.newPassword },
    },
  })

  // Return the temp password only when we generated it, so the admin can hand it over.
  return NextResponse.json({
    success: true,
    ...(parsed.data.newPassword ? {} : { tempPassword }),
  })
}
