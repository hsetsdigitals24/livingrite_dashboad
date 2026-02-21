# Testimonials Page Architecture

## Page Structure

```
/testimonials
│
├─── HERO SECTION
│    ├─ Title: "Real Stories from Real Families"
│    ├─ Subtitle with value prop
│    └─ Rating Aggregation Widget
│        ├─ Average: 4.8/5
│        └─ Distribution bars
│
├─── SERVICE FILTER BAR (Sticky)
│    ├─ All Services (pill)
│    ├─ Service A (pill)
│    ├─ Service B (pill)
│    └─ ...
│
├─── VIDEO TESTIMONIALS SECTION
│    ├─ Featured Hero Video (large)
│    │  ├─ YouTube embed
│    │  ├─ Client name & title
│    │  └─ 5-star rating
│    │
│    └─ Video Grid (2 columns)
│       ├─ Video Card 1
│       └─ Video Card 2
│
├─── CASE STUDIES SECTION
│    ├─ Featured Case Studies (3 cards, highlighted)
│    │  ├─ Card: Hero image + badge
│    │  ├─ Card: Challenge preview
│    │  ├─ Card: Outcome preview
│    │  └─ Card: Read Full Story CTA
│    │
│    └─ More Success Stories (grid)
│       └─ Additional case study cards
│
├─── TEXT TESTIMONIALS SECTION
│    ├─ Quote card 1
│    │  ├─ Client avatar
│    │  ├─ Quote text
│    │  ├─ Stars
│    │  └─ Service tag
│    │
│    ├─ Quote card 2
│    └─ Quote card 3
│
└─── CTA BANNER
     └─ Call to action for booking

/testimonials/case-studies/[slug]
│
├─ STICKY BACK BUTTON
│  └─ ← Back to Testimonials
│
├─ HERO IMAGE
│  ├─ Full-width image
│  ├─ Gradient overlay
│  └─ Service badge
│
├─ MAIN CONTENT (Left: 2/3)
│ ├─ Title & Client Name
│ ├─ THE CHALLENGE section
│ ├─ OUR SOLUTION section
│ ├─ THE OUTCOME section
│ ├─ FULL STORY (narrative)
│ ├─ PHOTO GALLERY
│ │  ├─ Main image (large)
│ │  ├─ Navigation arrows
│ │  └─ Thumbnail gallery
│ ├─ BEFORE/AFTER COMPARISON
│ │  ├─ Before image
│ │  └─ After image
│ └─ VIDEO TESTIMONIAL (embed)
│
└─ SIDEBAR (Right: 1/3, Sticky)
  ├─ KEY RESULTS widget
  │  ├─ Metric 1: Value
  │  ├─ Metric 2: Value
  │  └─ Metric 3: Value
  ├─ TIMELINE: "6 months"
  ├─ RATING: ★★★★★
  └─ SERVICE CTA LINK
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ User visits /testimonials                               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌─────────────────────────────────┐
        │ Fetch Data (3 APIs in parallel) │
        └──────────────────┬──────────────┘
           │               │                │
           ▼               ▼                ▼
   GET /api/        GET /api/        GET /api/
   testimonials     case-studies     services
           │               │                │
           └───────────────┼────────────────┘
                           │
                           ▼
             ┌───────────────────────────────┐
             │ Render Testimonials Hub       │
             ├───────────────────────────────┤
             │ • Hero + Rating Widget        │
             │ • Video testimonials (top)    │
             │ • Service filter bar          │
             │ • Case studies grid           │
             │ • Text testimonials grid      │
             │ • CTA banner                  │
             └────────────┬──────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        Click "Read Full     Click Service
        Story" on case study  Filter Pill
              │                       │
              ▼                       ▼
   Navigate to              Re-filter all
   /case-studies/[slug]     sections in
              │             real-time
              ▼                       │
   ┌──────────────────────┐          │
   │ Server renders       │          │
   │ case study detail    │          │
   │ • Fetch from DB      │          ▼
   │ • All sections       │   Return to
   │ • Full narrative     │   filtered view
   │ • Gallery carousel   │
   │ • Metrics sidebar    │
   └──────────────────────┘
```

---

## Component Hierarchy

```
<TestimonialsPage>
│
├─ <RatingAggregation>          (Stats widget)
│  └─ Props: averageRating, ratingDistribution
│
├─ <VideoTestimonialCard>       (Hero featured video)
│  ├─ Props: videoUrl, rating, clientName, title
│  └─ isHero={true}  → Large layout
│
├─ <VideoTestimonialCard>       (Video grid items)
│  ├─ Props: videoUrl, rating, clientName, title
│  └─ isHero={false} → Compact layout
│
├─ <ServiceFilter>              (Pill buttons)
│  ├─ Props: services[], activeFilter, onFilterChange
│  └─ State: selectedService
│
├─ <CaseStudyCard>              (Featured case studies)
│  ├─ Props: slug, title, challenge, outcome, heroImage
│  └─ Link to /case-studies/[slug]
│
├─ <CaseStudyCard>              (Additional case studies)
│  └─ Props: (same as above)
│
├─ <TestimonialCard>            (Text testimonials)
│  ├─ Props: clientName, content, rating, clientImage
│  └─ Layout: 3-column grid
│
└─ <CTABanner>                  (Bottom CTA)
   └─ Booking/Contact CTA


<CaseStudyDetailPage>
│
├─ Hero Image Container
│  └─ Image + Gradient Overlay
│
├─ Back Navigation Link
│  └─ ← Back to Testimonials
│
├─ Main Content
│  ├─ Title & Client
│  ├─ Challenge section
│  ├─ Solution section
│  ├─ Outcome section
│  ├─ Narrative section
│  ├─ <ImageGalleryCarousel>   (Photo gallery)
│  │  ├─ Props: images[], title
│  │  └─ Auto-play carousel
│  ├─ Before/After images
│  └─ Video embed
│
└─ Sidebar (Sticky)
   ├─ Key Results widget
   ├─ Timeline display
   ├─ Star rating
   └─ Service link CTA
```

---

## State Management

```
/testimonials (page.tsx)
│
├─ useState: testimonials[]        → Fetched from API
├─ useState: caseStudies[]         → Fetched from API
├─ useState: services[]            → Fetched from API
├─ useState: loading               → Boolean
├─ useState: selectedService       → String | null
└─ useState: stats                 → { averageRating, ratingDistribution }

Effects:
├─ useEffect: Load all data on mount
└─ Auto-filter when selectedService changes


/testimonials/case-studies/[slug] (page.tsx - Server Component)
│
└─ No client state needed
   ├─ Server fetches single case study by slug
   ├─ Renders static page
   └─ generateStaticParams() builds all case studies
```

---

## API Response Structure

```typescript
// GET /api/testimonials
{
  success: true,
  data: [
    {
      id: "test-123",
      clientName: "John Doe",
      clientTitle: "Family Member",
      clientImage: "https://...",
      rating: 5,
      content: "Quote text...",
      videoUrl: "https://youtube.com/watch?v=xyz",
      featured: true,
      service: {
        id: "svc-1",
        title: "Post-ICU Care",
        slug: "post-icu-care"
      }
    },
    // ... more testimonials
  ],
  count: 12,
  stats: {
    averageRating: "4.8",
    totalReviews: 12,
    ratingDistribution: {
      5: 10,
      4: 2,
      3: 0,
      2: 0,
      1: 0
    }
  }
}

// GET /api/case-studies
{
  success: true,
  data: [
    {
      id: "cs-456",
      slug: "stroke-recovery-okafor",
      title: "Post-Stroke Recovery",
      clientName: "Mr. Okafor",
      challenge: "Partial paralysis...",
      solution: "Therapy program...",
      outcome: "Regained 85% mobility...",
      narrative: "Full story...",
      heroImage: "https://...",
      images: ["https://...", "https://..."],
      keyResults: [
        { metric: "Mobility", value: "85%" }
      ],
      rating: 5,
      featured: true,
      service: {
        id: "svc-2",
        title: "Neurorehabilitation"
      }
    }
  ],
  count: 8
}
```

---

## Responsive Breakpoints

```
Mobile (< 768px)
├─ Single column layouts
├─ Full-width cards
├─ Video hero: aspect-video
├─ Case study detail: Stacked content
└─ Sidebar: Bottom of page

Tablet (768px - 1024px)
├─ 2-column grids
├─ Sidebar appears to right
├─ Case study: Left content, right sidebar (narrower)
└─ Video: 2 per row

Desktop (> 1024px)
├─ 3-column grids
├─ Full width layout
├─ Case study: Sticky sidebar
├─ Video hero: Maximum width
└─ All sections full-featured
```

---

## Performance Optimizations

```
✅ Image Optimization
   ├─ Next.js Image component
   ├─ Automatic srcset
   ├─ WebP conversion
   └─ Lazy loading

✅ Static Generation
   ├─ Case studies: Pre-built at build time
   ├─ Testimonials: Generated on-demand (ISR)
   └─ Fast page loads

✅ Code Splitting
   ├─ Each page: Separate bundle
   ├─ Client components: Lazy loaded
   └─ Heavy libraries: Dynamic import

✅ Caching Strategy
   ├─ API responses: React cache (server)
   ├─ Static assets: Browser cache headers
   └─ Database queries: Indexed lookups
```

---

## Error Handling

```
GET /api/testimonials
├─ Success (200)
│  └─ Return data + stats
│
└─ Error (500)
   └─ Return { error: "Failed to fetch testimonials" }

/testimonials
├─ Data loaded successfully
│  └─ Display all sections
│
├─ Loading state
│  └─ Show spinner
│
└─ No data
   └─ Show empty state message

/case-studies/[slug]
├─ Case study found & APPROVED
│  └─ Display full page
│
├─ Case study not found
│  └─ 404 page
│
└─ Case study found but not APPROVED
   └─ 404 page
```

---

## Browser Support

```
✅ Chrome/Edge      → Full support
✅ Firefox          → Full support
✅ Safari           → Full support (12+)
✅ Mobile browsers  → Full support
✅ Video iframes    → YouTube & Vimeo only
⚠️  IE11            → Partial (no flexbox gaps)
```

This architecture supports:
- Infinite testimonials (paginate if needed)
- Unlimited case studies
- Real-time filtering
- SEO-friendly static routes
- Fast page loads
- Mobile-first design
