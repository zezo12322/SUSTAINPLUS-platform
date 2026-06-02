import type { ReactNode } from 'react'

/** Small uppercase gold label used above section headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-semibold text-gold-600 uppercase tracking-widest">
      {children}
    </p>
  )
}

/** Section heading with the brand accent bar (matches the homepage). */
export function SectionEyebrow({ text }: { text: string }) {
  return (
    <div data-reveal="fade-up" className="flex items-center gap-3">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{text}</h2>
      <span className="block h-1 w-10 rounded-full bg-gold-500" />
    </div>
  )
}

/** Centered section heading: small eyebrow + big title + optional lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
}: {
  eyebrow?: string
  title: string
  lead?: string
  center?: boolean
}) {
  return (
    <div data-reveal="fade-up" className={center ? 'text-center max-w-2xl mx-auto' : ''}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        {title}
      </h2>
      {lead && <p className="mt-4 text-gray-500 leading-relaxed">{lead}</p>}
    </div>
  )
}

/** Standard white rounded card. */
export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      data-reveal="fade-up"
      className={`rounded-2xl border border-gray-100 bg-white p-6 hover:border-primary-300 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  )
}

/** Circular icon badge in brand navy. */
export function IconBadge({ icon }: { icon: string }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
      <i className={`fa-solid ${icon} text-primary-600 text-lg`} />
    </div>
  )
}
