import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CaseStudyDetail } from '@/components/marketing/pages/case-study-detail'
import { CASE_STUDIES_DATA } from '@/lib/case-studies-data'

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES_DATA).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = CASE_STUDIES_DATA[slug]
  if (!cs) return {}
  return {
    title: { absolute: cs.en.title + ' — Sustain Plus' },
    description: cs.en.summary,
    alternates: {
      languages: { en: `/case-studies/${slug}`, ar: `/ar/case-studies/${slug}` },
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!CASE_STUDIES_DATA[slug]) notFound()
  return <CaseStudyDetail slug={slug} locale="en" />
}
