import { Suspense } from 'react'
import { sanityClient, TESTIMONIALS_QUERY, TESTIMONIALS_COUNT_QUERY } from '@/sanity/lib/client'
import type { Metadata } from 'next'
import type { Testimonial } from '@/types/testimonial'
import { TestimonialsPageClient } from './TestimonialsPageClient'

export const metadata: Metadata = {
  title: 'Client Testimonials | LivingRite Care',
  description:
    `Read what patients and families say about LivingRite Care's home healthcare services in Nigeria — post-stroke recovery, ICU care, physiotherapy, and more.`,
  keywords: 'LivingRite Care reviews, home healthcare testimonials, Nigeria nursing reviews, patient stories',
}

export const revalidate = 60 // ISR — revalidate every 60 seconds

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = []
  let totalCount = 0

  try {
    ;[testimonials, totalCount] = await Promise.all([
      sanityClient.fetch<Testimonial[]>(TESTIMONIALS_QUERY, {}, { next: { revalidate: 60 } }),
      sanityClient.fetch<number>(TESTIMONIALS_COUNT_QUERY, {}, { next: { revalidate: 60 } }),
    ])
  } catch (err) {
    console.error('[TestimonialsPage] Failed to fetch:', err)
  }

  return (
    <main className="min-h-screen" style={{ background: '#f8feff' }}>
      <Suspense fallback={<div className="py-32 text-center text-gray-400">Loading testimonials…</div>}>
        <TestimonialsPageClient testimonials={testimonials} totalCount={totalCount} />
      </Suspense>
    </main>
  )
}
