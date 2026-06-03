import type { Metadata } from 'next'
import '@/app/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ScrollReveal } from '@/components/animation/scroll-reveal'

export const metadata: Metadata = {
  title: {
    default: 'منصة الاستشارات البيئية | ساستين بلس',
    template: '%s | ساستين بلس',
  },
  description:
    'منصة استشارات بيئية ذكية مدعومة بخبرة ساستين بلس وقاعدة معرفة مراجعة من متخصصين بيئيين.',
  keywords: ['استشارات بيئية', 'ساستين بلس', 'بيئة', 'امتثال بيئي', 'مصر'],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'ساستين بلس',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800;900&family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className="font-tajawal antialiased">
        <SessionProvider>
          <ScrollReveal />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
