'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animated number counter that runs once when scrolled into view.
 *
 * Accepts the raw display string (e.g. "1,100", "+50", "50+", "1.5 MW") and
 * animates only the numeric core while preserving any prefix/suffix and the
 * original thousands/decimal formatting. Falls back to the static value when
 * there is no number to animate or reduced motion is requested.
 */
export function CountUp({
  value,
  duration = 1800,
  className,
}: {
  value: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(() => freeze(value))
  const done = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const parsed = parse(value)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!parsed || reduce || !('IntersectionObserver' in window)) {
      setDisplay(value)
      return
    }

    const { prefix, target, suffix, decimals, grouped } = parsed

    const run = () => {
      if (done.current) return
      done.current = true
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        const current = target * eased
        setDisplay(prefix + format(current, decimals, grouped) + suffix)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            io.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

// Initial render shows 0 (animated path) or the raw value (static path).
function freeze(value: string): string {
  const parsed = parse(value)
  if (!parsed) return value
  return parsed.prefix + format(0, parsed.decimals, parsed.grouped) + parsed.suffix
}

interface Parsed {
  prefix: string
  suffix: string
  target: number
  decimals: number
  grouped: boolean
}

function parse(value: string): Parsed | null {
  const match = value.match(/[\d.,]*\d/)
  if (!match) return null
  const raw = match[0]
  const numeric = raw.replace(/,/g, '')
  const target = Number(numeric)
  if (!Number.isFinite(target)) return null
  const dot = numeric.indexOf('.')
  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice((match.index ?? 0) + raw.length),
    target,
    decimals: dot === -1 ? 0 : numeric.length - dot - 1,
    grouped: raw.includes(','),
  }
}

function format(n: number, decimals: number, grouped: boolean): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  })
}
