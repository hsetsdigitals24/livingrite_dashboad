# SEO Implementation Guide for LivingRite Care Portal

## Overview
This document outlines the SEO optimizations implemented for the LivingRite Care Portal, a Next.js 16 healthcare application.

## Files Created/Modified

### 1. **Sitemap** (`app/sitemap.ts`)
- **Purpose**: Automatically generates XML sitemap for search engines
- **Features**:
  - Dynamic routes for static pages
  - Service-specific pages
  - Blog posts (when integrated with Sanity)
  - Proper `lastModified`, `changeFrequency`, and `priority` attributes
- **Auto-generated at**: `/sitemap.xml`
- **Update/Customize**: 
  - Add/remove routes in the static routes array
  - Adjust priorities based on importance (0.0-1.0)
  - Modify changeFrequency as needed

### 2. **Robots.txt** 
- **Location**: `public/robots.txt` (static) and `app/api/robots/route.ts` (dynamic)
- **Purpose**: Controls search engine crawler access
- **Features**:
  - Allows crawling of public pages
  - Blocks private/admin routes (`/admin`, `/api`, `/auth`, `/caregiver`, `/client`)
  - Prevents duplicate content via parameter filtering
  - Specific rules for major search engines (Googlebot, Bingbot)
  - Rate limiting for aggressive crawlers (MJ12bot, AhrefsBot)
  - References sitemap location
- **Customization**: Update blocked routes, hostnames, or contact info

### 3. **Manifest.json** (`app/manifest.ts` and `public/manifest.json`)
- **Purpose**: Progressive Web App (PWA) support and branding
- **Features**:
  - PWA installation capability
  - App shortcuts (Book Consultation, View Services)
  - Theme colors and app display mode
  - Descriptions for search results
  - Maskable icons support

### 4. **Enhanced Metadata** (`app/layout.tsx`)
- **Features**:
  - Comprehensive Open Graph tags for social sharing
  - Twitter Card integration
  - Proper viewport and theme color meta tags
  - Schema.org structured data inline
  - Apple Web App support
  - Mobile web app metadata
  - DNS prefetch and preconnect optimization
  - Proper language and locale tags
  - Canonical URL
  - Verification tags for Google Search Console
- **Key Sections**:
  ```typescript
  // Open Graph for Facebook, LinkedIn, etc.
  openGraph: { ... }
  
  // Twitter Card for Twitter sharing
  twitter: { ... }
  
  // Robots control
  robots: { ... }
  ```

### 5. **Schema.org Libraries** (`lib/schema.ts`)
Helper functions for structured data:
- `generateOrganizationSchema()`: Company information
- `generateHealthcareServiceSchema()`: Medical business details
- `generateLocalBusinessSchema()`: Local business info with ratings
- `generateFAQSchema()`: FAQ structured data
- `generateBreadcrumbSchema()`: Navigation breadcrumbs
- `generateArticleSchema()`: Blog post/article data
- `generateProductSchema()`: Service/product data

### 6. **SEO Configuration** (`lib/seo-config.ts`)
Centralized configuration with:
- Site metadata (name, description, URLs)
- Social media handles
- Contact information
- Business location details
- Operating hours
- Helper functions for page-level metadata
- Utility functions for common structured data patterns

## How to Use

### For Creating New Pages

**Example: New Service Page**
```typescript
import { Metadata } from 'next';
import { generatePageMetadata, generateServiceSchema, SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Post-ICU Care Services',
  description: 'Comprehensive post-intensive care services...',
  slug: 'services/post-icu',
  keywords: ['post-ICU', 'rehabilitation', 'recovery', 'nursing care'],
});

export default function PostICUPage() {
  const schema = generateServiceSchema({
    name: 'Post-ICU Care',
    description: 'Comprehensive post-intensive care services',
    url: `${SEO_CONFIG.siteUrl}/services/post-icu`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Page content */}
    </>
  );
}
```

### For Blog Posts

**Example: Blog Post Page**
```typescript
import { generatePageMetadata, SEO_CONFIG } from '@/lib/seo-config';
import { generateArticleSchema } from '@/lib/schema';

export const metadata = generatePageMetadata({
  title: 'Understanding Post-Stroke Recovery',
  description: 'A comprehensive guide to post-stroke rehabilitation...',
  slug: 'blogs/post-stroke-recovery',
  keywords: ['stroke recovery', 'rehabilitation', 'healthcare', 'nursing'],
});

export default function BlogPost() {
  const schema = generateArticleSchema({
    title: 'Understanding Post-Stroke Recovery',
    description: 'A comprehensive guide to post-stroke rehabilitation...',
    url: `${SEO_CONFIG.siteUrl}/blogs/post-stroke-recovery`,
    publishDate: '2026-01-15',
    author: 'LivingRite Care',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Blog content */}
    </>
  );
}
```

### For FAQ Pages

```typescript
import { generatePageMetadata, generateFAQStructuredData, SEO_CONFIG } from '@/lib/seo-config';

const faqs = [
  { question: 'What is home healthcare?', answer: 'Home healthcare provides...' },
  { question: 'How do I book a service?', answer: 'You can book through...' },
];

export const metadata = generatePageMetadata({
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about LivingRite Care',
  slug: 'faqs',
});

export default function FAQPage() {
  const schema = generateFAQStructuredData(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* FAQ content */}
    </>
  );
}
```

## Environment Variables Required

Add to your `.env` file:

```env
# Required
NEXT_PUBLIC_APP_URL=https://livingrite.com

# Optional but recommended
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## Search Engine Submission

1. **Google Search Console**: https://search.google.com/search-console
   - Add your sitemap: `https://livingrite.com/sitemap.xml`
   - Submit robots.txt verification
   - Monitor indexation status

2. **Bing Webmaster Tools**: https://www.bing.com/webmaster
   - Submit sitemap
   - Verify site ownership

3. **Yandex Webmaster**: https://webmaster.yandex.com (if targeting Russian market)

## Open Graph & Twitter Meta Tags

These are automatically added in layout.tsx. When users share on:
- **Facebook/LinkedIn**: Uses Open Graph tags
- **Twitter/X**: Uses Twitter Card tags
- **WhatsApp/Telegram**: Uses Open Graph image
- **Email clients**: Falls back to description

For custom social images per page, update the metadata in individual page components.

## Schema.org Structured Data

The app includes:
- **Organization Schema**: Company info and contact
- **LocalBusiness Schema**: Business location, hours, ratings
- **Service/Product Schema**: For services offered
- **Article Schema**: For blog posts
- **FAQ Schema**: For FAQ pages
- **BreadcrumbList Schema**: For navigation

Search engines use this for enhanced search results (rich snippets).

## Performance Optimizations

- **DNS Prefetch**: Faster DNS resolution for external resources
- **Preconnect**: Establishes connection to critical domains early
- **Canonical URLs**: Prevents duplicate content issues
- **Mobile Optimization**: Viewport meta tags and mobile-specific metadata
- **Image Optimization**: Properly sized OG images (1200x630px)

## Mobile Considerations

- Progressive Web App (PWA) support via manifest.json
- Mobile-friendly viewport settings
- App shortcuts for quick actions
- Status bar styling for iOS
- Touch icon support

## Monitoring & Maintenance

### Monthly Checklist:
- [ ] Monitor Google Search Console for indexation errors
- [ ] Check click-through rates in GSC
- [ ] Review keyword rankings
- [ ] Verify all links are working (404 check)
- [ ] Update robots.txt if new routes are added
- [ ] Refresh dynamic content in sitemap

### Quarterly Checklist:
- [ ] Audit meta descriptions for accuracy and optimization
- [ ] Update Open Graph images if branding changes
- [ ] Review and update SEO_CONFIG with new business info
- [ ] Check schema markup validation at schema.org
- [ ] Test social sharing on major platforms

### Annually:
- [ ] Comprehensive SEO audit
- [ ] Competitor analysis
- [ ] Update structured data for new services
- [ ] Review and optimize page titles and descriptions

## Common Issues & Solutions

### Sitemap Not Updating
- **Issue**: New pages not appearing in sitemap.xml
- **Solution**: Ensure pages are added to the `sitemap()` function in `app/sitemap.ts`. Redeploy your Next.js app.

### Robots.txt Not Working
- **Issue**: Blocked routes still being indexed
- **Solution**: Check Google Search Console for indexation. Use `robots.txt` Tester in GSC to verify rules.

### OG Images Not Showing
- **Issue**: Social shares not displaying images
- **Solution**: Ensure image URLs are absolute (not relative), properly sized (1200x630px), and accessible by search engines.

### Schema Markup Errors
- **Issue**: Rich snippets not appearing in search results
- **Solution**: Use schema.org validator to check JSON-LD. Ensure all required fields are present.

## Additional Resources

- [Next.js SEO Best Practices](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## Support for SEO Updates

Update `SEO_CONFIG` in `lib/seo-config.ts` whenever:
- Company contact information changes
- Business hours change
- Social media handles change
- Location/address changes
- New services are added

This centralized config ensures consistency across all pages using the helper functions.

---

**Last Updated**: April 22, 2026  
**Version**: 1.0
