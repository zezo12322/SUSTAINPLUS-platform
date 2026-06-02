import type { Metadata } from 'next'
import { InsightsPage } from '@/components/marketing/pages/insights'

export const metadata: Metadata = {
  title: 'Insights — Sustain Plus',
  description:
    'Practical sustainability insights from our environmental and engineering experts: SWRO desalination, biogas cogeneration, LCA & EPD, Environmental Impact Assessment in Egypt, municipal waste to RDF, and industrial decarbonization.',
  alternates: { languages: { en: '/insights', ar: '/ar/insights' } },
}

export default function Page() {
  return <InsightsPage locale="en" />
}
