import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { toTestimonial, type Testimonial, type TestimonialWithService } from '@/types/testimonial'
import { TestimonialsPageClient } from './TestimonialsPageClient'

export const metadata: Metadata = {
  title: 'Client Testimonials | LivingRite Care',
  description:
    `Read what patients and families say about LivingRite Care's home healthcare services in Nigeria — post-stroke recovery, ICU care, physiotherapy, and more.`,
  keywords: 'LivingRite Care reviews, home healthcare testimonials, Nigeria nursing reviews, patient stories',
}

export const revalidate = 60 // ISR — revalidate every 60 seconds

const PAGE_SIZE = 9

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1'))

  let testimonials: Testimonial[] = []
  let totalCount = 0
  let avgRating = '0'

  try {
    const where = { status: 'APPROVED' as const }
    const [rows, total, ratingRows] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: { service: { select: { id: true, title: true } } },
        orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({ where, select: { rating: true } }),
    ])

    testimonials = (rows as unknown as TestimonialWithService[]).map(toTestimonial)
    totalCount = total
    if (ratingRows.length) {
      avgRating = (ratingRows.reduce((s, r) => s + r.rating, 0) / ratingRows.length).toFixed(1)
    }
  } catch (err) {
    console.error('[TestimonialsPage] Failed to fetch:', err)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <main className="min-h-screen" style={{ background: '#f8feff' }}>
      <TestimonialsPageClient
        testimonials={testimonials}
        totalCount={totalCount}
        avgRating={avgRating}
        page={page}
        totalPages={totalPages}
      />
    </main>
  )
}
