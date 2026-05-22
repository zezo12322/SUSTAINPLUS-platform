import type { Metadata } from 'next'
import '@/app/globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: {
    default: 'منصة الاستشارات البيئية | سستين بلس',
    template: '%s | سستين بلس',
  },
  description:
    'منصة استشارات بيئية ذكية مدعومة بخبرة سستين بلس وقاعدة معرفة مراجعة من متخصصين بيئيين.',
  keywords: ['استشارات بيئية', 'سستين بلس', 'بيئة', 'امتثال بيئي', 'مصر'],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: 'سستين بلس',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

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
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>"
        />
      </head>
      <body className="font-cairo antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
