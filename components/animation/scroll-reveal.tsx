'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Global scroll-reveal observer.
 *
 * Mount once inside a shell/layout. It finds every element carrying a
 * `data-reveal` attribute and adds `.is-revealed` when it scrolls into view
 * (the CSS in globals.css handles the actual transition). Server components
 * stay server components — they just add `data-reveal="fade-up"` and an
 * optional inline `--reveal-delay` for stagger.
 *
 * Honours `prefers-reduced-motion` by revealing everything immediately, and
 * re-scans on route change so freshly-rendered pages animate too.
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Re-query after the new route paints.
    const id = window.requestAnimationFrame(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)'),
      )

      if (reduce || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-revealed'))
        return
      }

      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed')
              obs.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )

      els.forEach((el) => {
        // Anything already in view on load reveals on the next frame so the
        // entrance still plays instead of snapping in.
        io.observe(el)
      })

      // Stash for cleanup.
      ;(window as unknown as { __spReveal?: IntersectionObserver }).__spReveal = io
    })

    return () => {
      window.cancelAnimationFrame(id)
      const io = (window as unknown as { __spReveal?: IntersectionObserver }).__spReveal
      io?.disconnect()
    }
  }, [pathname])

  return null
}
