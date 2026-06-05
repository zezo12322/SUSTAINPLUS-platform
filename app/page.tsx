import type { Metadata } from 'next'
import { MarketingHome } from '@/components/marketing/marketing-home'

export const metadata: Metadata = {
  title: { absolute: 'Sustain Plus | Turning Sustainability into Measurable Business Value' },
  description:
    'Sustain Plus helps industries decarbonize, measure environmental impact, and implement ESG strategies — carbon footprint, LCA, ESG reporting, and decarbonization across Egypt and the MENA region.',
  alternates: { languages: { en: '/', ar: '/ar' } },
  openGraph: {
    type: 'website',
    locale: 'en',
    title: 'Sustain Plus | Turning Sustainability into Measurable Business Value',
    description:
      'Decarbonization, carbon footprint, LCA, and ESG reporting for industry.',
  },
}

export default function HomePage() {
  return <MarketingHome locale="en" />
}
