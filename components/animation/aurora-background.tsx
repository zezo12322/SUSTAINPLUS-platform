/**
 * Decorative animated background for dark hero / CTA sections.
 *
 * Layers a panning mesh-gradient, a drifting dot grid, two organic morphing
 * blobs and (optionally) a slow rotating conic spotlight. Purely presentational
 * — drop it as the first child of a `relative overflow-hidden` section, before
 * the content layer. All motion is disabled under prefers-reduced-motion.
 */
export function AuroraBackground({
  mesh = true,
  grid = true,
  conic = false,
  blobs = true,
  intensity = 'normal',
}: {
  mesh?: boolean
  grid?: boolean
  conic?: boolean
  blobs?: boolean
  /** `soft` dials opacity down for busy photo backgrounds. */
  intensity?: 'soft' | 'normal' | 'bold'
}) {
  const meshOpacity = intensity === 'soft' ? 'opacity-40' : intensity === 'bold' ? 'opacity-90' : 'opacity-70'
  const gridOpacity = intensity === 'soft' ? 'opacity-[0.10]' : 'opacity-[0.18]'
  const blobOpacity = intensity === 'soft' ? 'opacity-60' : 'opacity-100'

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {mesh && <div className={`bg-aurora-mesh absolute inset-0 ${meshOpacity}`} />}
      {grid && <div className={`bg-dot-grid absolute inset-0 ${gridOpacity}`} />}
      {conic && (
        <div className="bg-conic-spotlight absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-50" />
      )}
      {blobs && (
        <div className={blobOpacity}>
          <div className="animate-blob absolute -top-24 start-[-4rem] h-[42vh] w-[42vh] bg-gold-500/25 blur-3xl" />
          <div
            className="animate-blob absolute -bottom-24 end-[-4rem] h-[46vh] w-[46vh] bg-primary-400/30 blur-3xl"
            style={{ animationDelay: '-7s' }}
          />
        </div>
      )}
    </div>
  )
}
