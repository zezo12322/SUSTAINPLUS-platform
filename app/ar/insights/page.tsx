import type { Metadata } from 'next'
import { InsightsPage } from '@/components/marketing/pages/insights'

export const metadata: Metadata = {
  title: 'مقالات — ساستين بلس',
  description:
    'رؤى عملية في الاستدامة من خبرائنا البيئيين والهندسيين: تحلية المياه بالتناضح العكسي SWRO، والتوليد المشترك بالغاز الحيوي، وتقييم دورة الحياة وإعلان المنتج البيئي، وتقييم الأثر البيئي في مصر، وتحويل النفايات البلدية إلى وقود RDF، وخفض الكربون الصناعي.',
  alternates: { languages: { en: '/insights', ar: '/ar/insights' } },
}

export default function Page() {
  return <InsightsPage locale="ar" />
}
