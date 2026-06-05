import type { Metadata } from 'next'
import { AboutPage } from '@/components/marketing/pages/about'

export const metadata: Metadata = {
  title: { absolute: 'من نحن | ساستين بلس — خبراء البيئة والحوكمة البيئية' },
  description:
    'ساستين بلس شركة بيئية وهندسية رائدة توائم مشاريعها مع أهداف التنمية المستدامة لتقديم حلول بنية تحتية مائية وبيئية عالية الأثر — استشارات وهندسة EPC واستكشاف تعدين وبناء قدرات في مصر والمنطقة.',
  alternates: { languages: { en: '/about', ar: '/ar/about' } },
}

export default function Page() {
  return <AboutPage locale="ar" />
}
