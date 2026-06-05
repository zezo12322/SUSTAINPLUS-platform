'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Adapted from a 21st.dev "background paths" hero. Rebranded to the
// Sustain Plus navy/gold palette and made content-agnostic (pass your own
// title + children). Works in both LTR and RTL layouts.

function FloatingPaths({ position, stroke }: { position: number; stroke: string }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" aria-hidden>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={stroke}
            strokeWidth={path.width + 0.4}
            strokeOpacity={0.12 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: [0.4, 0.75, 0.4], pathOffset: [0, 1, 0] }}
            transition={{ duration: 20 + (path.id % 10), repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * Just the animated path lines as an absolutely-positioned background layer —
 * drop inside any `relative overflow-hidden` container (keep your content at
 * `relative z-10`). Defaults suit a LIGHT background; pass light strokes for dark.
 */
export function BackgroundPathsLayer({
  strokes = ['#AF8443', '#16335C'],
  className,
}: {
  strokes?: [string, string]
  className?: string
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <FloatingPaths position={1} stroke={strokes[0]} />
      <FloatingPaths position={-1} stroke={strokes[1]} />
    </div>
  )
}

export function BackgroundPaths({
  title = 'Sustain Plus',
  children,
  className = 'bg-white',
  titleTag: TitleTag = 'h1',
}: {
  title?: string
  children?: ReactNode
  className?: string
  titleTag?: 'h1' | 'h2'
}) {
  const words = title.split(' ')

  return (
    <div className={`relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        {/* gold layer + navy layer drifting opposite directions */}
        <FloatingPaths position={1} stroke="#AF8443" />
        <FloatingPaths position={-1} stroke="#16335C" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Animate whole words (not letters) — splitting letters breaks
              Arabic cursive shaping. */}
          <TitleTag className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.2]">
            {words.map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: wordIndex * 0.12, type: 'spring', stiffness: 150, damping: 25 }}
                className="inline-block mx-2 text-transparent bg-clip-text bg-gradient-to-l from-primary-900 via-primary-700 to-gold-500"
              >
                {word}
              </motion.span>
            ))}
          </TitleTag>

          {children}
        </motion.div>
      </div>
    </div>
  )
}
