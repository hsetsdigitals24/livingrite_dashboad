import { sanityClient, HOMEPAGE_TESTIMONIALS_QUERY, ABOUT_TESTIMONIALS_QUERY } from '@/sanity/lib/client'
import { TestimonialWidget } from './TestimonialWidget'
import type { Testimonial } from '@/types/testimonial'

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
    const query = variant === 'about' ? ABOUT_TESTIMONIALS_QUERY : HOMEPAGE_TESTIMONIALS_QUERY
    testimonials = await sanityClient.fetch<Testimonial[]>(query, {}, { next: { revalidate: 60 } })
  } catch (err) {
    console.error('[TestimonialWidgetServer] Failed to fetch testimonials:', err)
  }

  return (
    <TestimonialWidget
      testimonials={testimonials}
      title={title}
      subtitle={subtitle}
    />
  )
}
