import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ServiceDetail } from '@/components/marketing/pages/service-detail'
import { SERVICES_DATA } from '@/lib/services-data'

export function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const e = SERVICES_DATA[slug]
  if (!e) return {}
  return {
    title: e.ar.title + ' — ساستين بلس',
    description: e.ar.summary,
    alternates: { languages: { en: `/services/${slug}`, ar: `/ar/services/${slug}` } },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SERVICES_DATA[slug]) notFound()
  return <ServiceDetail slug={slug} locale="ar" />
}
