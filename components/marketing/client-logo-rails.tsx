import { type Locale } from '@/lib/marketing'
import { CLIENT_PARTNERS, partnerName, partnerNote } from '@/lib/partners'

const CLIENT_PARTNER_ROWS = [
  CLIENT_PARTNERS.filter((_, index) => index % 2 === 0),
  CLIENT_PARTNERS.filter((_, index) => index % 2 === 1),
] as const

export function ClientLogoRails({
  locale,
  compact = false,
}: {
  locale: Locale
  compact?: boolean
}) {
  return (
    <div className="client-logo-rails mt-12 space-y-4 overflow-hidden py-4">
      {CLIENT_PARTNER_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex === 0 ? 'primary-row' : 'secondary-row'}
          className={`flex w-max gap-4 sm:gap-5 ${
            rowIndex === 0 ? 'client-logo-rail' : 'client-logo-rail-reverse'
          }`}
          style={{ animationDuration: rowIndex === 0 ? '42s' : '48s' }}
        >
          {[0, 1].map((copyIndex) =>
            row.map((partner, partnerIndex) => {
              const name = partnerName(partner, locale)
              const note = partnerNote(partner, locale)
              const isDuplicate = copyIndex > 0

              return (
                <div
                  key={`${partnerName(partner, 'en')}-${copyIndex}-${partnerIndex}`}
                  aria-hidden={isDuplicate || undefined}
                  className={`shrink-0 rounded-lg border px-5 py-4 flex flex-col items-center justify-center text-center shadow-[0_18px_45px_rgba(12,29,50,0.08)] transition-[border-color,box-shadow] hover:shadow-[0_22px_55px_rgba(12,29,50,0.13)] ${
                    partner.darkCard
                      ? 'bg-primary-900 border-primary-700 hover:border-gold-400'
                      : 'bg-white border-gray-100 hover:border-gold-300'
                  } ${
                    compact
                      ? 'h-[112px] w-[230px] sm:w-[250px]'
                      : 'h-[132px] w-[250px] sm:w-[290px]'
                  }`}
                >
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logo}
                      alt={isDuplicate ? '' : name}
                      className={`w-full object-contain ${
                        compact ? 'max-h-20 max-w-[220px]' : 'max-h-24 max-w-[250px]'
                      }`}
                    />
                  ) : (
                    <>
                      <span className="font-bold text-primary-950 text-sm leading-snug">{name}</span>
                      {note && <span className="mt-1 text-[11px] text-gray-400 leading-snug">{note}</span>}
                    </>
                  )}
                </div>
              )
            }),
          )}
        </div>
      ))}
    </div>
  )
}
