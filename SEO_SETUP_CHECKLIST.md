# SEO Setup Checklist

## ✅ Completed

- [x] Sitemap generation (`app/sitemap.ts`)
- [x] Robots.txt configuration (`public/robots.txt` + dynamic route)
- [x] Manifest.json for PWA (`app/manifest.ts`)
- [x] Enhanced metadata in root layout with Open Graph & Twitter cards
- [x] Schema.org utilities for structured data
- [x] Centralized SEO configuration (`lib/seo-config.ts`)
- [x] Comprehensive documentation (`SEO_IMPLEMENTATION.md`)

## 🔧 Next Steps - Required Configuration

### 1. Update Environment Variables
Add these to your `.env` and `.env.production` files:

```env
# Your app URL (very important!)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Google Search Console verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here

# Google Analytics (if not already set)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXX
```

### 2. Customize SEO Configuration
Edit `lib/seo-config.ts` and update:
- [ ] `contact.phone` - Replace with actual phone
- [ ] `contact.email` - Replace with actual email
- [ ] `contact.whatsapp` - Replace with actual WhatsApp number
- [ ] `social.*` - Update all social media handles
- [ ] `location.*` - Update your actual business address
- [ ] `businessHours` - Update your actual business hours
- [ ] `services` - Update/add your actual services

### 3. Update Robots.txt
Update `public/robots.txt` (line 42):
- Replace `https://livingrite.com` with your actual domain

### 4. Create Open Graph Image
- Create a 1200x630px image for social sharing
- Save as `public/og-image.png`
- Use your brand colors and logo

### 5. Search Engine Verification

#### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property
3. Choose verification method (HTML file, DNS record, or meta tag)
4. Verify ownership
5. Submit sitemap: `https://yourdomain.com/sitemap.xml`

#### Bing Webmaster Tools
1. Go to https://www.bing.com/webmaster
2. Add your site
3. Verify using provided methods
4. Submit sitemap

### 6. Test Implementations

#### Test Sitemap
- Visit: `https://yourdomain.com/sitemap.xml`
- Should show XML with all routes

#### Test Robots.txt
- Visit: `https://yourdomain.com/robots.txt`
- Should show robots configuration

#### Test Open Graph
- Visit: https://www.opengraphcheck.com/
- Enter your domain
- Should show correct title, description, and image

#### Test Schema Markup
- Visit: https://schema.org/validator/
- Paste HTML from your pages
- Should show valid schema without errors

### 7. Monitor Performance

#### Google Search Console
- Monitor indexation status
- Track search queries and click-through rates
- Fix crawl errors
- Monitor Core Web Vitals

#### Page Speed Insights
- Visit: https://pagespeed.web.dev/
- Enter your domain
- Monitor performance metrics

## 📋 Page-Specific Implementation

### For Existing Pages
Add metadata to each major page. Example for `/services` page:

```typescript
// app/services/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Healthcare Services',
  description: 'Explore our comprehensive home healthcare services...',
  slug: 'services',
  keywords: ['home healthcare', 'nursing services', 'post-ICU care'],
});

export default function ServicesPage() {
  return (
    // Your page content
  );
}
```

### For Blog Posts (if using Sanity)
Update the `getBlogPosts()` function in `app/sitemap.ts`:

```typescript
async function getBlogPosts() {
  const query = `*[_type == "post"][]{
    slug: slug.current,
    _updatedAt
  }`;
  
  const posts = await sanityFetch({ query });
  return posts;
}
```

## 🎯 Priority Pages for SEO

Start with these high-priority pages:

1. **Homepage** (`/`) - Already optimized
2. **Services** (`/services`) - High conversion intent
3. **About** (`/about`) - Brand/trust building
4. **Blog/Resources** (`/blogs`) - Content marketing
5. **Contact** (`/contact`) - Clear CTA

## 📊 Success Metrics to Track

- Organic search traffic
- Keyword rankings for target keywords
- Click-through rate (CTR) in search results
- Indexation status (# of pages indexed)
- Core Web Vitals scores
- Mobile usability
- Crawl errors and warnings

## 🔍 Tools to Use Regularly

1. **Google Search Console** - Track indexation and search performance
2. **Google PageSpeed Insights** - Monitor Core Web Vitals
3. **Google Analytics** - Track organic traffic and user behavior
4. **Schema.org Validator** - Validate structured data
5. **Screaming Frog SEO Spider** - Technical SEO audit

## 📝 Maintenance Schedule

### Weekly
- Monitor Google Search Console for new errors
- Review top search queries

### Monthly
- Check Core Web Vitals
- Verify updated pages are indexed
- Update robots.txt if needed

### Quarterly
- Full technical SEO audit
- Review and optimize meta descriptions
- Check for broken links

## 🚀 Deploy & Go Live

1. Make sure all environment variables are set
2. Build and test locally: `npm run build`
3. Deploy to production
4. Wait a few days for crawling
5. Submit sitemap to Search Console
6. Monitor indexation in GSC

---

**Need Help?** See `SEO_IMPLEMENTATION.md` for detailed documentation.
