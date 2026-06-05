'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Adapted from a 21st.dev metal-button. Rebranded to Sustain Plus
// navy/gold palette and kept dependency-free (no framer-motion / cva).
type ColorVariant = 'default' | 'navy' | 'success' | 'error' | 'gold' | 'bronze'

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant
  /** When set, the button navigates as a Next.js Link instead of acting as a <button>. */
  href?: string
}

const colorVariants: Record<
  ColorVariant,
  { outer: string; inner: string; button: string; textColor: string; textShadow: string }
> = {
  default: {
    outer: 'bg-gradient-to-b from-[#000] to-[#A0A0A0]',
    inner: 'bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]',
    button: 'bg-gradient-to-b from-[#B9B9B9] to-[#969696]',
    textColor: 'text-white',
    textShadow: '[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]',
  },
  // Brand navy metal
  navy: {
    outer: 'bg-gradient-to-b from-[#081320] to-[#3a5685]',
    inner: 'bg-gradient-to-b from-[#dbe2ee] via-[#0C1D32] to-[#bac8dd]',
    button: 'bg-gradient-to-b from-[#284169] to-[#0C1D32]',
    textColor: 'text-white',
    textShadow: '[text-shadow:_0_-1px_0_rgb(8_19_32_/_100%)]',
  },
  success: {
    outer: 'bg-gradient-to-b from-[#005A43] to-[#7CCB9B]',
    inner: 'bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]',
    button: 'bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]',
    textColor: 'text-[#FFF7F0]',
    textShadow: '[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]',
  },
  error: {
    outer: 'bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]',
    inner: 'bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]',
    button: 'bg-gradient-to-b from-[#F08D8F] to-[#A45253]',
    textColor: 'text-[#FFF7F0]',
    textShadow: '[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]',
  },
  // Brand gold metal
  gold: {
    outer: 'bg-gradient-to-b from-[#8f6a35] to-[#e3cba6]',
    inner: 'bg-gradient-to-b from-[#FFFBEF] via-[#6d5129] to-[#f1e6d3]',
    button: 'bg-gradient-to-b from-[#e3cba6] to-[#AF8443]',
    textColor: 'text-[#3a2c12]',
    textShadow: '[text-shadow:_0_1px_0_rgb(255_251_239_/_60%)]',
  },
  bronze: {
    outer: 'bg-gradient-to-b from-[#864813] to-[#E9B486]',
    inner: 'bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]',
    button: 'bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]',
    textColor: 'text-[#FFF7F0]',
    textShadow: '[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]',
  },
}

const metalButtonStyles = (variant: ColorVariant, isPressed: boolean, isHovered: boolean, isTouch: boolean) => {
  const colors = colorVariants[variant]
  const transition = 'all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)'
  return {
    wrapper: cn('relative inline-flex transform-gpu rounded-md p-[1.25px] will-change-transform', colors.outer),
    wrapperStyle: {
      transform: isPressed ? 'translateY(2.5px) scale(0.99)' : 'translateY(0) scale(1)',
      boxShadow: isPressed
        ? '0 1px 2px rgba(0,0,0,0.15)'
        : isHovered && !isTouch
          ? '0 4px 12px rgba(0,0,0,0.12)'
          : '0 3px 8px rgba(0,0,0,0.08)',
      transition,
      transformOrigin: 'center center',
    },
    inner: cn('absolute inset-[1px] transform-gpu rounded-lg will-change-transform', colors.inner),
    innerStyle: { transition, transformOrigin: 'center center', filter: isHovered && !isPressed && !isTouch ? 'brightness(1.05)' : 'none' },
    button: cn(
      'relative z-10 m-[1px] inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-md px-6 py-2 text-sm leading-none font-semibold will-change-transform outline-none',
      colors.button,
      colors.textColor,
      colors.textShadow,
    ),
    buttonStyle: {
      transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      transition,
      transformOrigin: 'center center',
      filter: isHovered && !isPressed && !isTouch ? 'brightness(1.02)' : 'none',
    },
  }
}

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => (
  <div
    className={cn(
      'pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300',
      isPressed ? 'opacity-20' : 'opacity-0',
    )}
  >
    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-neutral-100 to-transparent" />
  </div>
)

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = 'gold', href, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isTouch, setIsTouch] = React.useState(false)

    React.useEffect(() => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }, [])

    const v = metalButtonStyles(variant, isPressed, isHovered, isTouch)

    const handlers = {
      onMouseDown: () => setIsPressed(true),
      onMouseUp: () => setIsPressed(false),
      onMouseLeave: () => { setIsPressed(false); setIsHovered(false) },
      onMouseEnter: () => { if (!isTouch) setIsHovered(true) },
      onTouchStart: () => setIsPressed(true),
      onTouchEnd: () => setIsPressed(false),
      onTouchCancel: () => setIsPressed(false),
    }

    const inner = (
      <>
        <ShineEffect isPressed={isPressed} />
        {children || 'Button'}
        {isHovered && !isPressed && !isTouch && (
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-transparent to-white/5" />
        )}
      </>
    )

    return (
      <div className={v.wrapper} style={v.wrapperStyle}>
        <div className={v.inner} style={v.innerStyle} />
        {href ? (
          <Link href={href} className={cn(v.button, 'no-underline', className)} style={v.buttonStyle} {...handlers}>
            {inner}
          </Link>
        ) : (
          <button ref={ref} className={cn(v.button, className)} style={v.buttonStyle} {...props} {...handlers}>
            {inner}
          </button>
        )}
      </div>
    )
  },
)
MetalButton.displayName = 'MetalButton'
