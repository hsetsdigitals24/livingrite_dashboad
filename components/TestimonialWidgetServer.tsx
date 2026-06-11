import { prisma } from '@/lib/prisma'
import { TestimonialWidget } from './TestimonialWidget'
import { toTestimonial, type Testimonial, type TestimonialWithService } from '@/types/testimonial'

interface TestimonialWidgetServerProps {
  variant?: 'homepage' | 'about'
  title?: string
  subtitle?: string
}

export async function TestimonialWidgetServer({
  variant = 'homepage',
  title,
  subtitle,
}: TestimonialWidgetServerProps) {
  let testimonials: Testimonial[] = []

  try {
    const rows = await prisma.testimonial.findMany({
      where: { status: 'APPROVED', showOnWidget: true },
      include: { service: { select: { id: true, title: true } } },
      orderBy: [
        { featured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 6,
    })
    testimonials = (rows as unknown as TestimonialWithService[]).map(toTestimonial)
  } catch (err) {
    console.error('[TestimonialWidgetServer] Failed to fetch testimonials:', err)
  }

  // Both the homepage and About widgets share the same curated `showOnWidget` set;
  // `variant` only affects the default heading copy.
  return (
    <TestimonialWidget
      testimonials={testimonials}
      title={title}
      subtitle={subtitle}
    />
  )
}
