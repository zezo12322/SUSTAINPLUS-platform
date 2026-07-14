import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Admin guard for API routes / server actions.
 * Re-checks role + active flag against the DB (not the JWT), so a demoted or
 * deactivated admin loses access immediately — no need to wait for re-login.
 * Returns the admin's user id, or null if not an active admin.
 */
export async function requireAdmin(): Promise<{ adminId: string } | null> {
  const session = await auth()
  const id = session?.user?.id
  if (!id) return null

  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true, isActive: true },
  })
  if (!user || user.role !== 'ADMIN' || !user.isActive) return null

  return { adminId: id }
}

/** Count of currently active ADMIN accounts — used to prevent removing the last admin. */
export async function activeAdminCount(): Promise<number> {
  return prisma.user.count({ where: { role: 'ADMIN', isActive: true } })
}
