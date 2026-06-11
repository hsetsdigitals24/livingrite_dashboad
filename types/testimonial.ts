/**
 * Frontend-facing testimonial shape.
 * Mirrors the Prisma `Testimonial` model with the `service` relation flattened
 * to `serviceName` for display.
 */
export interface Testimonial {
  id: string
  clientName: string
  clientTitle?: string | null
  clientLocation?: string | null
  clientImage?: string | null
  rating: number
  content: string
  shortQuote?: string | null
  videoUrl?: string | null
  featured?: boolean
  showOnWidget?: boolean
  serviceName?: string | null
}

/** Shape returned by Prisma queries that `include: { service: true }`. */
export interface TestimonialWithService {
  id: string
  clientName: string
  clientTitle: string | null
  clientLocation: string | null
  clientImage: string | null
  rating: number
  content: string
  shortQuote: string | null
  videoUrl: string | null
  featured: boolean
  showOnWidget: boolean
  service?: { id: string; title: string } | null
}

/** Map a Prisma testimonial (with service relation) to the frontend shape. */
export function toTestimonial(t: TestimonialWithService): Testimonial {
  return {
    id: t.id,
    clientName: t.clientName,
    clientTitle: t.clientTitle,
    clientLocation: t.clientLocation,
    clientImage: t.clientImage,
    rating: t.rating,
    content: t.content,
    shortQuote: t.shortQuote,
    videoUrl: t.videoUrl,
    featured: t.featured,
    showOnWidget: t.showOnWidget,
    serviceName: t.service?.title ?? null,
  }
}
