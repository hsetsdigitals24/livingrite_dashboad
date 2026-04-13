import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'f9ykqc2a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

// ─── GROQ queries ──────────────────────────────────────────────────────────────

/** All published testimonials for the full page (paginated via slice) */
export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(featured desc, publishedAt desc) {
    _id,
    clientName,
    "slug": slug.current,
    clientRole,
    clientLocation,
    avatarUrl,
    avatarImage { asset->{ url } },
    quote,
    shortQuote,
    rating,
    serviceReceived,
    publishedAt,
    isVerified,
    featured,
    tags,
    mediaItems[] {
      mediaType,
      driveUrl,
      caption
    }
  }
`

/** Total count for pagination */
export const TESTIMONIALS_COUNT_QUERY = `
  count(*[_type == "testimonial"])
`

/** Widget: featured for homepage */
export const HOMEPAGE_TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && featuredOnHomepage == true] | order(featured desc, publishedAt desc) [0..5] {
    _id,
    clientName,
    "slug": slug.current,
    clientRole,
    clientLocation,
    avatarUrl,
    avatarImage { asset->{ url } },
    shortQuote,
    quote,
    rating,
    serviceReceived,
    isVerified,
    featured
  }
`

/** Widget: featured for about page */
export const ABOUT_TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && featuredOnAbout == true] | order(featured desc, publishedAt desc) [0..5] {
    _id,
    clientName,
    "slug": slug.current,
    clientRole,
    clientLocation,
    avatarUrl,
    avatarImage { asset->{ url } },
    shortQuote,
    quote,
    rating,
    serviceReceived,
    isVerified,
    featured
  }
`

/** Single testimonial by slug (not used yet but useful) */
export const TESTIMONIAL_BY_SLUG_QUERY = `
  *[_type == "testimonial" && slug.current == $slug][0] {
    _id,
    clientName,
    "slug": slug.current,
    clientRole,
    clientLocation,
    avatarUrl,
    avatarImage { asset->{ url } },
    quote,
    shortQuote,
    rating,
    serviceReceived,
    publishedAt,
    isVerified,
    featured,
    tags,
    seoDescription,
    mediaItems[] { mediaType, driveUrl, caption }
  }
`
