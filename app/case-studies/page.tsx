import type { Metadata } from 'next'
import { CaseStudiesPage } from '@/components/marketing/pages/case-studies'

export const metadata: Metadata = {
  title: { absolute: 'Case Studies — Sustain Plus' },
  description:
    'Real projects across consulting, engineering, and training: lifting Oman’s environmental performance ranking from 145th to 50th, a high-efficiency SWRO/ROO desalination plant at Ras El Hekma, Blue Ethanol low-carbon biofuel, Ethydco’s polyethylene LCA & EPD, and carbon-capture and sustainability training for ADNOC and GSK.',
  alternates: { languages: { en: '/case-studies', ar: '/ar/case-studies' } },
}

export default function Page() {
  return <CaseStudiesPage locale="en" />
}
