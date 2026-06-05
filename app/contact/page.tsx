import type { Metadata } from 'next'
import { ContactPage } from '@/components/marketing/pages/contact'

export const metadata: Metadata = {
  title: { absolute: 'Contact | Sustain Plus — Talk to our ESG & Environmental Experts' },
  description:
    'Get in touch with Sustain Plus for environmental consulting, engineering & water infrastructure (EPC), mining exploration, and EIA, permits & training — or get an instant AI environmental consultation. Based in Alexandria, Egypt.',
  alternates: { languages: { en: '/contact', ar: '/ar/contact' } },
}

export default function Page() {
  return <ContactPage locale="en" />
}
