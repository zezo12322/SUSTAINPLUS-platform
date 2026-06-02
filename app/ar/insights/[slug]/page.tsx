import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { InsightDetail } from '@/components/marketing/pages/insight-detail'
import { INSIGHTS_DATA } from '@/lib/insights-data'

export function generateStaticParams() {
  return Object.keys(INSIGHTS_DATA).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const e = INSIGHTS_DATA[slug]
  if (!e) return {}
  return {
    title: e.ar.title + ' — ساستين بلس',
    description: e.ar.excerpt,
    alternates: { languages: { en: `/insights/${slug}`, ar: `/ar/insights/${slug}` } },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!INSIGHTS_DATA[slug]) notFound()
  return <InsightDetail slug={slug} locale="ar" />
}
