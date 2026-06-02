import type { ReactNode } from 'react'
import { MarketingHeader } from './marketing-header'
import { MarketingFooter } from './marketing-footer'
import { MARKETING, type Locale } from '@/lib/marketing'

/**
 * Shared page chrome for every marketing route.
 * Renders the locale-aware dir wrapper + fixed header + footer.
 * Subpages render their own <PageBanner /> (or hero) as the first child.
 */
export function MarketingShell({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const dict = MARKETING[locale]
  return (
    <div
      dir={dict.dir}
      lang={locale}
      className={`${locale === 'ar' ? 'font-cairo' : 'font-sans'} bg-white text-gray-900 min-h-screen flex flex-col`}
    >
      <MarketingHeader dict={dict} locale={locale} />
      <main className="flex-1">{children}</main>
      <MarketingFooter dict={dict} />
    </div>
  )
}
