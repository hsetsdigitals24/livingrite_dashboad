export interface TestimonialMediaItem {
  mediaType: 'photo' | 'video'
  driveUrl: string
  caption?: string
}

export interface Testimonial {
  _id: string
  clientName: string
  slug: string
  clientRole?: string
  clientLocation?: string
  avatarUrl?: string
  avatarImage?: { asset?: { url?: string } }
  quote: string
  shortQuote?: string
  rating: number
  serviceReceived?: string
  publishedAt?: string
  isVerified?: boolean
  featured?: boolean
  tags?: string[]
  mediaItems?: TestimonialMediaItem[]
}

export const SERVICE_LABELS: Record<string, string> = {
  'post-stroke': 'Post-Stroke Recovery',
  icu: 'ICU / Critical Care',
  physiotherapy: 'Physiotherapy',
  palliative: 'Palliative Care',
  'home-nursing': 'Home Nursing',
  'wound-care': 'Wound Care',
  other: 'Other',
}
