import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/users', req.url))
  }

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id }, select: { isActive: true } })
  if (user) {
    await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: user.isActive ? 'USER_DEACTIVATE' : 'USER_ACTIVATE',
        details: { targetUserId: id },
      },
    })
  }

  return NextResponse.redirect(new URL('/admin/users', req.url))
}
