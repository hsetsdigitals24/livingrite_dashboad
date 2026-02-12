# Testimonials Page Implementation Plan

## Overview
A dedicated testimonials page showcasing client success stories, video testimonials, case studies, and social proof through ratings and Google Reviews integration.

---

## 1. Feature Requirements

### 1.1 Video Testimonials (2+)
- **Display**: Hero carousel section featuring 2+ video testimonials
- **Format**: Embedded YouTube/Vimeo videos or MP4 with custom player
- **Metadata**: Client name, role/condition, video duration, star rating
- **Rotation**: Auto-rotating carousel with manual navigation
- **Mobile**: Responsive video player (16:9 aspect ratio)

### 1.2 Long-Form Case Studies (2-3)
- **Content**: 
  - Client challenge/problem statement
  - Solution provided
  - Measurable outcomes/results
  - Timeline of care
  - Before/after metrics
- **Media**: 
  - Hero banner image
  - Gallery of 4-6 progress photos/videos
  - Before/after comparison carousel
- **Length**: 800-1500 words narrative per case study
- **Navigation**: 
  - Card grid view with preview
  - Full case study detail page
  - Related case studies suggestion

### 1.3 Photo Gallery Carousel
- **Purpose**: Showcase client progress moments and care quality
- **Layout**:
  - Main carousel (full-width featured photo)
  - Thumbnail strip for navigation
  - Lightbox modal for viewing full-size images
- **Features**:
  - Keyboard navigation (arrow keys, ESC to close)
  - Touch gestures (swipe on mobile)
  - Image captions and dates
  - Grouped by case study or time period

### 1.4 Star Ratings & Review Aggregation
- **Display**:
  - Average rating badge (5-star scale)
  - Individual star ratings on each testimonial
  - Distribution chart (e.g., 15 five-star, 3 four-star, etc.)
- **Calculation**: Aggregate client feedback scores
- **Visual**: Star component (filled/half-filled/empty)
- **Count**: Display total number of reviews

### 1.5 Filterable by Service Type
- **Filter Chips**: 
  - Stroke Care
  - ICU Recovery
  - Palliative Care
  - Post-Surgical Care
  - Other services from database
- **Behavior**:
  - Click to toggle service filter
  - Reset/Clear all filters option
  - URL query params for shareable filtered views
  - Show result count per filter

### 1.6 Google Reviews Widget Integration
- **Widget Type**: Google Business Profile reviews embed
- **Location**: Bottom section of page
- **Features**:
  - Display 5-10 most recent reviews
  - Show author, date, rating, text
  - "See all reviews on Google" link
  - Fallback styling if widget unavailable

---

## 2. Database Schema

### 2.1 Testimonial Model
```
Testimonial {
  id                String (primary key)
  clientName        String (required)
  clientTitle       String? (e.g., "Patient" or "Family Member")
  clientImage       String? (avatar/photo URL)
  rating            Int (1-5 stars)
  content           String (quote/review text)
  videoUrl          String? (YouTube/Vimeo embed URL)
  serviceId         String (foreign key to Service)
  featured          Boolean (highlight on carousel)
  status            Enum: PENDING, APPROVED, REJECTED, FEATURED
  approvedBy        String? (admin user ID)
  approvedAt        DateTime?
  displayOrder      Int? (for carousel ordering)
  createdAt         DateTime
  updatedAt         DateTime
}
```

### 2.2 CaseStudy Model
```
CaseStudy {
  id                String (primary key)
  slug              String (unique, for URL routing)
  title             String (required)
  clientName        String (required)
  serviceId         String (foreign key to Service)
  
  # Content
  challenge         String (problem statement)
  solution          String (approach taken)
  outcome           String (results/metrics)
  narrative         String (full story, 800-1500 words)
  
  # Media
  heroImage         String (main banner image)
  beforeImage       String (before photo)
  afterImage        String (after photo)
  images            String[] (array of image URLs for gallery)
  videoUrl          String? (testimonial video)
  
  # Metrics
  rating            Int (1-5 stars)
  timeline          String? (e.g., "6 months", "3 weeks")
  keyResults        Json (array of {metric: string, value: string})
  
  # Status & Workflow
  status            Enum: PENDING, APPROVED, REJECTED, FEATURED
  approvedBy        String? (admin user ID)
  approvedAt        DateTime?
  featured          Boolean
  displayOrder      Int?
  publishedAt       DateTime?
  
  createdAt         DateTime
  updatedAt         DateTime
}
```

### 2.3 Relationships
```
Service -> Testimonial (1:N)
Service -> CaseStudy (1:N)
User (Admin) -> Testimonial (approval tracking via approvedBy)
User (Admin) -> CaseStudy (approval tracking via approvedBy)
```

---

## 3. API Endpoints

### 3.1 Testimonials API
```
GET    /api/testimonials              # List approved testimonials, optionally filter by serviceId
GET    /api/testimonials?service=xxx  # Filter by service
GET    /api/testimonials/[id]         # Get single testimonial
POST   /api/testimonials              # Create new testimonial (public submission)
PATCH  /api/admin/testimonials/[id]   # Update testimonial (admin only)
DELETE /api/admin/testimonials/[id]   # Delete testimonial (admin only)
```

### 3.2 Case Studies API
```
GET    /api/case-studies              # List approved case studies
GET    /api/case-studies?service=xxx  # Filter by service
GET    /api/case-studies/[slug]       # Get single case study by slug
POST   /api/case-studies              # Create case study (admin only)
PATCH  /api/admin/case-studies/[slug] # Update case study (admin only)
DELETE /api/admin/case-studies/[slug] # Delete case study (admin only)
```

### 3.3 Response Format
```json
{
  "success": true,
  "data": [
    {
      "id": "testimonial-id",
      "clientName": "John Doe",
      "rating": 5,
      "content": "Excellent care...",
      "service": { "id": "svc-id", "title": "Stroke Care" },
      "featured": true
    }
  ],
  "count": 15
}
```

---

## 4. Frontend Components

### 4.1 Page Structure (`/app/testimonials/page.tsx`)
```
├── Hero Section
│   └── Title + Description
├── Featured Testimonials Carousel
│   ├── Video Player
│   ├── Star Rating
│   ├── Client Name & Title
│   ├── Quote Text
│   └── Navigation Arrows
├── Rating Statistics
│   ├── Average Rating Badge
│   └── Distribution Chart
├── Filter Section
│   └── Service Type Chips
├── Case Studies Grid
│   ├── CaseStudyCard (3-column responsive)
│   └── Click to Detail Page
├── Photo Gallery Carousel
│   ├── Main Image Display
│   ├── Thumbnail Strip
│   └── Lightbox Modal
├── Testimonials Grid
│   └── TestimonialCard (filtered by service)
└── Google Reviews Widget
```

### 4.2 Components to Build

#### TestimonialCarousel.tsx
- Props: `testimonials: Testimonial[]`
- Features: Swiper carousel, auto-rotate, video embed, star display

#### TestimonialCard.tsx
- Props: `testimonial: Testimonial`
- Features: Client avatar, quote, rating, service badge

#### CaseStudyCard.tsx
- Props: `caseStudy: CaseStudy`
- Features: Hero image, title, challenge snippet, outcome metrics, link

#### CaseStudyDetail.tsx
- Props: `caseStudy: CaseStudy`
- Features: Full narrative, image gallery, metrics, related cases

#### PhotoGalleryCarousel.tsx
- Props: `images: Image[], title: string`
- Features: Main carousel, thumbnails, lightbox, keyboard nav

#### RatingStatistics.tsx
- Props: `testimonials: Testimonial[]`
- Features: Average rating, star distribution, review count

#### ServiceFilter.tsx
- Props: `services: Service[]`, `onFilter: (serviceId) => void`, `selectedServices: string[]`
- Features: Chip buttons, multi-select option, clear filters

#### GoogleReviewsWidget.tsx
- Static embed of Google Business reviews

---

## 5. Styling & Design

### 5.1 Color Scheme
- **Primary**: #00b2ec (teal, existing brand)
- **Secondary**: #e50d92 (pink/magenta, existing brand)
- **Neutral**: #f3f4f6 (light gray backgrounds)
- **Stars**: #fbbf24 (yellow/gold)
- **Text**: #1f2937 (dark gray for readability)

### 5.2 Layout Specifications
- **Page Max Width**: 1280px
- **Spacing**: 16px base unit (16, 24, 32, 48, 64px)
- **Typography**:
  - Hero title: 48px bold
  - Subheading: 24px semi-bold
  - Body: 16px regular
  - Small: 14px regular

### 5.3 Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

**Component Grid Responsive**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

## 6. Implementation Phases

### Phase 1: Database & Admin Panel
1. Add `Testimonial` and `CaseStudy` models to Prisma schema
2. Create migrations
3. Add admin UI for managing testimonials/case studies in AdminDashboard
4. Create approval workflow forms

### Phase 2: Public API Endpoints
1. Implement testimonials CRUD endpoints
2. Implement case studies CRUD endpoints
3. Add filtering by service type
4. Add pagination for large datasets
5. Add caching headers for performance

### Phase 3: Frontend - Display Components
1. Build carousel, card, and gallery components
2. Implement filter logic with URL state
3. Create testimonials page layout
4. Add case study detail pages

### Phase 4: Integration
1. Add Google Reviews widget code
2. Connect rating statistics calculation
3. Add testimonial submission form for public
4. Test responsive design across devices

### Phase 5: Enhancement (Optional)
1. Analytics tracking (page views, filter usage)
2. Email notification when new testimonial submitted
3. Admin approval email notifications
4. Social proof notifications (e.g., "New 5-star review!")

---

## 7. Technical Dependencies

### New npm Packages
- `swiper` - Carousel/slider component
- `react-star-ratings` - Star display component
- `clsx` - Class name utilities (already installed)

### Existing Resources Used
- `next/image` - Image optimization
- `next/link` - Client routing
- `lucide-react` - Icons
- `@/components` - Reusable UI
- `prisma` - Database ORM
- TailwindCSS - Styling

---

## 8. Security & Validation

### 8.1 User Input Validation
- Testimonial submission: max 500 characters, required fields
- Case study: HTML sanitization for rich text, image upload verification
- Rating: 1-5 integer only

### 8.2 Authentication
- Testimonial POST: Public (optional email for follow-up)
- Admin endpoints: Require `role: "ADMIN"` via NextAuth
- Case study creation: Admin only

### 8.3 Rate Limiting
- Testimonial submission: 1 per IP per day (prevent spam)
- API endpoints: Standard rate limiting via middleware

---

## 9. Performance Considerations

### 9.1 Image Optimization
- Use Next.js Image component with optimization
- Serve multiple sizes (thumbnail, medium, full)
- Lazy load gallery images

### 9.2 Caching Strategy
- Cache approved testimonials (revalidate every hour)
- Cache case studies (revalidate every 2 hours)
- Cache Google Reviews widget (browser cache)

### 9.3 Bundle Optimization
- Code-split carousel and lightbox (lazy load)
- Only load dependencies when needed

---

## 10. Testing Strategy

- [ ] API endpoint tests (GET, POST, PATCH, DELETE)
- [ ] Filter functionality tests
- [ ] Carousel navigation tests (keyboard, mouse, touch)
- [ ] Mobile responsive layout tests
- [ ] Form validation tests
- [ ] Admin approval workflow tests

---

## 11. Deployment Checklist

- [ ] Database migration deployed
- [ ] API endpoints tested in production
- [ ] Admin UI accessible and functional
- [ ] Google Reviews API credentials configured
- [ ] Images optimized and hosted
- [ ] Testimonials page accessible at `/testimonials`
- [ ] Case study detail pages accessible at `/testimonials/[slug]`
- [ ] Mobile responsive verified
- [ ] SEO meta tags configured
- [ ] Analytics tracking implemented

---

## File Structure
```
app/
├── testimonials/
│   ├── page.tsx (main testimonials page)
│   ├── [slug]/
│   │   └── page.tsx (case study detail page)
│   └── layout.tsx
├── api/
│   ├── testimonials/
│   │   ├── route.ts (GET all, POST new)
│   │   └── [id]/
│   │       └── route.ts (GET single, PATCH, DELETE)
│   └── case-studies/
│       ├── route.ts (GET all, POST new)
│       └── [slug]/
│           └── route.ts (GET single, PATCH, DELETE)
components/
└── testimonials/
    ├── TestimonialCarousel.tsx
    ├── TestimonialCard.tsx
    ├── CaseStudyCard.tsx
    ├── CaseStudyDetail.tsx
    ├── PhotoGalleryCarousel.tsx
    ├── RatingStatistics.tsx
    ├── ServiceFilter.tsx
    └── GoogleReviewsWidget.tsx
```

---

## Next Steps
1. Review and approve this plan
2. Begin Phase 1: Database schema and migrations
3. Create admin management UI
4. Implement public API endpoints
5. Build frontend components
6. Integrate Google Reviews
7. Test and deploy
