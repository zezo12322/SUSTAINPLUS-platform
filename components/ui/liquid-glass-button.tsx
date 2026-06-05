'use client'

import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Adapted from a 21st.dev liquid-glass button. Tailwind v3 compatible
// (no v4-only utilities) and brand-aware. Exports LiquidButton only —
// the project already has its own base Button in ./button.
const liquidButtonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-primary hover:scale-105 duration-300',
        light: 'bg-transparent text-white hover:scale-105 duration-300',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-4 text-xs gap-1.5',
        lg: 'h-10 rounded-md px-6',
        xl: 'h-12 rounded-md px-8',
        xxl: 'h-14 rounded-md px-10 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'xxl' },
  },
)

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {
  /** When set, renders as a Next.js Link for navigation. */
  href?: string
}

function LiquidButton({ className, variant, size, href, children, ...props }: LiquidButtonProps) {
  const sharedClassName = cn('relative', liquidButtonVariants({ variant, size, className }))
  const inner = (
    <>
      <div
        className="absolute inset-0 z-0 h-full w-full rounded-md transition-all
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.5),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.4),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(175,132,67,0.25)]"
      />
      <div
        className="absolute inset-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
        style={{ backdropFilter: 'url("#sp-container-glass")' }}
      />
      <div className="pointer-events-none z-10 flex items-center gap-2">{children}</div>
      <GlassFilter />
    </>
  )

  if (href) {
    return (
      <Link href={href} data-slot="liquid-button" className={cn(sharedClassName, 'no-underline')}>
        {inner}
      </Link>
    )
  }

  return (
    <button data-slot="liquid-button" className={sharedClassName} {...props}>
      {inner}
    </button>
  )
}

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter id="sp-container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves={1} seed={1} result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation={2} result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale={70} xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation={4} result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export { LiquidButton, liquidButtonVariants }
