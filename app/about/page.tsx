import type { Metadata } from 'next'
import { AboutPage } from '@/components/marketing/pages/about'

export const metadata: Metadata = {
  title: 'About Us | Sustain Plus — Environmental & ESG Experts',
  description:
    'Sustain Plus is a leading environmental and engineering company, aligning projects with the UN SDGs to deliver high-impact water and environmental infrastructure — consulting, EPC, mining exploration, and capacity building across Egypt and the region.',
  alternates: { languages: { en: '/about', ar: '/ar/about' } },
}

export default function Page() {
  return <AboutPage locale="en" />
}
