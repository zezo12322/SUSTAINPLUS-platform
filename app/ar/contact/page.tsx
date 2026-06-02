import type { Metadata } from 'next'
import { ContactPage } from '@/components/marketing/pages/contact'

export const metadata: Metadata = {
  title: 'تواصل معنا | ساستين بلس — تحدث مع خبراء البيئة والحوكمة البيئية',
  description:
    'تواصل مع ساستين بلس للاستشارات البيئية، والهندسة والبنية التحتية المائية (EPC)، واستكشاف التعدين، ودراسات تقييم الأثر البيئي والتصاريح والتدريب — أو احصل على استشارة بيئية فورية بالذكاء الاصطناعي. مقرنا الإسكندرية، مصر.',
  alternates: { languages: { en: '/contact', ar: '/ar/contact' } },
}

export default function Page() {
  return <ContactPage locale="ar" />
}
