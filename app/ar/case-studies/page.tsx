import type { Metadata } from 'next'
import { CaseStudiesPage } from '@/components/marketing/pages/case-studies'

export const metadata: Metadata = {
  title: { absolute: 'دراسات الحالة — ساستين بلس' },
  description:
    'مشاريع حقيقية عبر الاستشارات والهندسة والتدريب: رفع تصنيف الأداء البيئي لسلطنة عُمان من المركز 145 إلى 50، ومحطة تحلية مياه بحر عالية الكفاءة بتقنية SWRO/ROO في رأس الحكمة، والبلو إيثانول كوقود حيوي منخفض الكربون، وتقييم دورة الحياة وتسجيل EPD للبولي إيثيلين لإيثيدكو، وتدريب على احتجاز الكربون والاستدامة لأدنوك وGSK.',
  alternates: { languages: { en: '/case-studies', ar: '/ar/case-studies' } },
}

export default function Page() {
  return <CaseStudiesPage locale="ar" />
}
