import type { NextRequest } from 'next/server'

/**
 * Lightweight in-memory fixed-window rate limiter.
 *
 * Suitable for the current single-instance Azure B1 deployment. If the app is
 * ever scaled to multiple instances, swap the Map for a shared store
 * (Redis / Upstash) — the `rateLimit` signature is designed to stay the same.
 */

type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()
let lastSweep = 0

function sweep(now: number) {
  // Opportunistic cleanup so the Map can't grow unbounded.
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  retryAfter: number // seconds until the window resets
}

/**
 * Consume one token for `key`. Returns ok:false when the window limit is hit.
 */
export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const bucket = store.get(key)
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { ok: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }

  bucket.count += 1
  return { ok: true, retryAfter: 0 }
}

/** Best-effort client IP from proxy headers (Cloudflare → Azure ARR). */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
