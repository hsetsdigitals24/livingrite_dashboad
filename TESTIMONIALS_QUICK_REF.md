# Quick Reference - Testimonials Features

## 🎬 Video Testimonials
- **Location**: `/testimonials` - "Video Testimonials" section
- **Display**: Featured hero (1) + Grid (2 more)
- **Format**: YouTube & Vimeo supported
- **Auto-converts**: `watch?v=` → `embed/`

## 📖 Case Studies
- **Location**: `/testimonials/case-studies/[slug]`
- **Full Page Features**:
  - Hero image with gradient
  - Challenge → Solution → Outcome
  - Full narrative text
  - Photo gallery carousel
  - Before/After comparison
  - Key results metrics (sidebar)
  - Timeline & rating
  - Video embed

## ⭐ Rating Aggregation
- **Shows**: Average rating (e.g., 4.8/5)
- **Breakdown**: Distribution bars for each rating
- **Updates**: Auto-calculated from APPROVED testimonials

## 🔍 Service Filter
- **Type**: Pill buttons (single-select)
- **Behavior**: Filters testimonials, case studies, videos
- **Position**: Sticky bar (always visible)
- **Options**: "All Services" + each service name

## 📸 Photo Gallery
- **Location**: Case study detail pages
- **Features**:
  - Auto-plays (5 sec intervals)
  - Click arrows to navigate
  - Click thumbnails for quick jump
  - Shows counter (e.g., "2/8")
  - Pauses on hover

## 🎨 Design Elements

| Element | Style |
|---------|-------|
| Cards | Border + subtle shadow on hover |
| Badges | Pill shape, color-coded by type |
| Stars | Amber-400 (filled) or gray (empty) |
| Text | Dark gray (900) for headers, (700) for body |
| Spacing | 16px section padding, 24px gaps |
| Borders | 1px gray-200 |

## 🔌 API Endpoints

```typescript
// Get all approved testimonials with stats
GET /api/testimonials

// Get stats like this:
const response = await fetch('/api/testimonials')
const { data, stats } = await response.json()
// stats = { averageRating, totalReviews, ratingDistribution }

// Filter by service
GET /api/testimonials?service=SERVICE_ID

// Featured only
GET /api/testimonials?featured=true

// Case studies (existing)
GET /api/case-studies?featured=true
```

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| < 768px | 1 column, stacked |
| 768-1024px | 2 columns |
| > 1024px | 3 columns, sidebar |

## ⚡ Performance

- Images: Optimized with Next.js Image component
- Case studies: Static generation (fast page loads)
- Videos: Lazy-load iframes
- Gallery: Auto-play paused on scroll

## 🛠️ Component Props

### VideoTestimonialCard
```tsx
<VideoTestimonialCard
  title="Client Name"
  clientName="John Doe"
  clientTitle="Family Member"
  rating={5}
  videoUrl="https://youtube.com/watch?v=xyz"
  isHero={true}  // Large version
/>
```

### TestimonialCard
```tsx
<TestimonialCard
  clientName="Jane Smith"
  clientTitle="Patient"
  clientImage="/path/to/image.jpg"
  rating={5}
  content="Quote text..."
  service={{ title: "Service Name", slug: "slug" }}
/>
```

### CaseStudyCard
```tsx
<CaseStudyCard
  slug="case-study-slug"
  title="Case Study Title"
  clientName="Client Name"
  challenge="Challenge text"
  outcome="Outcome text"
  heroImage="/path/to/image.jpg"
  rating={5}
  featured={true}
  service={{ title: "Service" }}
/>
```

### ServiceFilter
```tsx
<ServiceFilter
  services={[
    { id: "1", title: "Service A" },
    { id: "2", title: "Service B" }
  ]}
  activeFilter={selectedServiceId}
  onFilterChange={(serviceId) => {}}
/>
```

## 📊 Database Fields Used

**Testimonial**
- clientName, clientTitle, clientImage, rating, content
- videoUrl, featured, status, serviceId

**CaseStudy**
- title, slug, clientName, challenge, solution, outcome, narrative
- heroImage, beforeImage, afterImage, images[], videoUrl
- rating, timeline, keyResults, featured, status, serviceId

---

## 🎯 Customization Tips

1. **Change Colors**: Search `blue-600` or `amber-400` in components
2. **Adjust Spacing**: Look for `py-16`, `px-4`, `gap-6` in styling
3. **Modify Grid**: Search `grid-cols-` for responsive columns
4. **Update Fonts**: Heading sizes in `text-4xl`, `text-2xl`, etc.
5. **Add Dark Mode**: Use Tailwind's `dark:` prefix

---

## 🚨 Common Issues

**Videos not showing?**
- Check URL format (must be YouTube or Vimeo)
- Verify `videoUrl` is not null in database

**Case study 404?**
- Ensure status = "APPROVED"
- Check slug exists in database

**Filter not working?**
- Verify serviceId matches exactly
- Check database records have serviceId set

**Images not loading?**
- Verify image URLs are publicly accessible
- Check file path in images[] array

---

Ready to go! 🚀
