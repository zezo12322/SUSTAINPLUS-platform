import type { Metadata } from 'next'
import { ServicesPage } from '@/components/marketing/pages/services'

export const metadata: Metadata = {
  title: 'Services — Sustain Plus',
  description:
    'From environmental consulting & ESG (carbon footprint, LCA, EPD, GRI reporting) to engineering & water infrastructure (SWRO/ROO desalination, biogas, waste-to-RDF EPC), mining exploration, and EIA, permits & HSE training.',
  alternates: { languages: { en: '/services', ar: '/ar/services' } },
}

export default function Page() {
  return <ServicesPage locale="en" />
}
