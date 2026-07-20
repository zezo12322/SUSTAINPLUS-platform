import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public health probe. Reports only up/down status — no user counts, env-var
 * presence, or raw DB error strings (those leaked infra details previously).
 * Uses the shared Prisma singleton instead of a new client per request.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', prisma: { status: 'ok' } })
  } catch (err) {
    // Log details server-side only; never return them to the caller.
    console.error('Health check DB error:', err)
    return NextResponse.json({ status: 'degraded', prisma: { status: 'error' } })
  }
}
