import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export interface Testimonial {
  _id: string
  fullName: string
  patientRelation: string
  location: string
  image: {
    asset: {
      _id: string
    }
  }
  testimonial: string
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const query = `*[_type == "testimonials"][0...3] | order(_createdAt desc) {
    _id,
    fullName,
    patientRelation,
    location,
    image,
    testimonial
  }`

  try {
    const testimonials = await client.fetch(query)
    return testimonials
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

export function getTestimonialImage(testimonial: Testimonial): string {
  if (testimonial.image?.asset) {
    return urlFor(testimonial.image).width(200).height(200).url() || '/placeholder.jpg'
  }
  return '/placeholder.jpg'
}
