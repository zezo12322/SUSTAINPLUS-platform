import { type Locale } from '@/lib/marketing'

export interface Partner {
  name: string | Record<Locale, string>
  logo?: string
  note?: string | Record<Locale, string>
}

export const CLIENT_PARTNERS: readonly Partner[] = [
  { name: 'EcoConServ', logo: '/images/partners/ecoconserv.png' },
  { name: 'Enviromaster', logo: '/images/partners/enviromaster.png' },
  { name: 'Yassin El Agamy Office', logo: '/images/partners/yassin-el-agamy.png' },
  { name: 'Multiserv', logo: '/images/partners/multiserv.png' },
  { name: 'Coca-Cola', logo: '/images/partners/coca-cola.png' },
  { name: 'Dubai Knowledge', logo: '/images/partners/dubai-knowledge.png' },
  { name: 'Ethydco', logo: '/images/partners/ethydco-card.png' },
  { name: 'ADNOC', logo: '/images/partners/adnoc-card.png' },
  { name: 'GSK', logo: '/images/partners/gsk-card.png' },
  { name: 'Elaraby Group', logo: '/images/partners/elaraby-group.png' },
  { name: 'Empower Capital', logo: '/images/partners/empower-capital.png' },
  { name: 'Impero Group', logo: '/images/partners/impero-group.png' },
  { name: 'Astrovita', logo: '/images/partners/astrovita.png' },
  { name: 'Petromaint', logo: '/images/partners/petromaint.png' },
  { name: 'Fixbond', logo: '/images/partners/fixbond.png' },
]

export function partnerName(partner: Partner, locale: Locale): string {
  return typeof partner.name === 'string' ? partner.name : partner.name[locale]
}

export function partnerNote(partner: Partner, locale: Locale): string | undefined {
  if (!partner.note) return undefined
  return typeof partner.note === 'string' ? partner.note : partner.note[locale]
}
