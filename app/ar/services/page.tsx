import type { Metadata } from 'next'
import { ServicesPage } from '@/components/marketing/pages/services'

export const metadata: Metadata = {
  title: 'خدماتنا — ساستين بلس',
  description:
    'من الاستشارات البيئية وESG (البصمة الكربونية، LCA، EPD، تقارير GRI) إلى الهندسة والبنية التحتية المائية (تحلية SWRO/ROO، بيوغاز، تحويل النفايات إلى RDF بنظام EPC)، واستكشاف التعدين، ودراسات EIA والتصاريح وتدريب HSE.',
  alternates: { languages: { en: '/services', ar: '/ar/services' } },
}

export default function Page() {
  return <ServicesPage locale="ar" />
}
