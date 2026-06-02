import type { Metadata } from 'next'
import { MarketingHome } from '@/components/marketing/marketing-home'

export const metadata: Metadata = {
  title: 'ساستين بلس | نحوّل الاستدامة إلى قيمة تجارية قابلة للقياس',
  description:
    'ساستين بلس تساعد الصناعات على خفض الانبعاثات وقياس الأثر البيئي وتطبيق استراتيجيات ESG — البصمة الكربونية، تقييم دورة الحياة، تقارير الاستدامة، وخفض الكربون في مصر والمنطقة.',
  alternates: { languages: { en: '/', ar: '/ar' } },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    title: 'ساستين بلس | نحوّل الاستدامة إلى قيمة قابلة للقياس',
    description: 'خفض الكربون، البصمة الكربونية، تقييم دورة الحياة، وتقارير ESG للصناعة.',
  },
}

export default function HomePageAr() {
  return <MarketingHome locale="ar" />
}
