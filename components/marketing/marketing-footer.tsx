import Link from 'next/link'
import type { MarketingDict } from '@/lib/marketing'
import { COMPANY } from '@/lib/company'

function FooterLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith('#')) {
    return (
      <a href={href} className="text-[#cdd6e3]/75 hover:text-white transition-colors">
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className="text-[#cdd6e3]/75 hover:text-white transition-colors">
      {label}
    </Link>
  )
}

export function MarketingFooter({ dict }: { dict: MarketingDict }) {
  return (
    <footer id="about-footer" className="bg-[#081320] text-[#cdd6e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wide.png" alt="Sustain Plus" className="object-contain h-10 w-auto logo-gold" />
            <p className="mt-5 text-sm text-[#cdd6e3]/75 max-w-sm leading-relaxed">
              {dict.footer.blurb}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-facebook-f text-sm" />
              </a>
              <a
                href={COMPANY.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"
              >
                <i className="fa-brands fa-linkedin-in text-sm" />
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-envelope text-sm" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm">{dict.footer.colServices}</h3>
            <ul className="space-y-2.5 text-sm">
              {dict.footer.services.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm">{dict.footer.colCompany}</h3>
            <ul className="space-y-2.5 text-sm">
              {dict.footer.company.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-xs text-[#cdd6e3]/55">
          <p>© 2026 Sustain Plus. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
