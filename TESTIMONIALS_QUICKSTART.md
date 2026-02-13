# Testimonials Page - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Environment Setup
Add to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_BUSINESS_URL=https://www.google.com/maps/place/LivingRite
```

### 2. Check Database
Ensure these tables exist in PostgreSQL:
```sql
-- Should already exist from schema
SELECT COUNT(*) FROM "Testimonial" WHERE status = 'APPROVED';
SELECT COUNT(*) FROM "CaseStudy" WHERE status = 'PUBLISHED';
SELECT COUNT(*) FROM "Service";
```

### 3. Add Sample Data (Optional)

**Add testimonial:**
```sql
INSERT INTO "Testimonial" (
  id, "clientName", rating, content, status, featured
) VALUES (
  'test-1', 'John Doe', 5, 'Great care!', 'APPROVED', true
);
```

**Add case study:**
```sql
INSERT INTO "CaseStudy" (
  id, slug, title, "clientName", challenge, solution, outcome, 
  status, featured
) VALUES (
  'cs-1', 'john-recovery', 'Johns Recovery', 'John Doe',
  'Had a stroke', 'We provided care', 'Now walks daily',
  'PUBLISHED', true
);
```

### 4. Verify Pages Load
```bash
# Terminal
npm run dev

# Browser
http://localhost:3000/testimonials
http://localhost:3000/testimonials/john-recovery
```

### 5. Test Features
- ✅ Rating widget shows stats
- ✅ Testimonials carousel displays
- ✅ Case studies show with links
- ✅ Click case study → detail page loads
- ✅ Service filter works
- ✅ Google Reviews widget appears

## 📂 File Structure

**Created Files:**
```
app/testimonials/page.tsx               (Main page)
app/testimonials/[slug]/page.tsx        (Detail pages)
app/api/testimonials/stats/route.ts     (Rating stats API)

components/testimonials/
├── RatingAggregation.tsx               (NEW)
└── GoogleReviewsWidget.tsx             (NEW)
```

**Enhanced Files:**
```
components/testimonials/TestimonialGrid.tsx  (Already works)
```

## 🎯 Key Routes

| Route | Description |
|-------|-------------|
| `/testimonials` | Main hub with featured content |
| `/testimonials/[slug]` | Individual case study detail |
| `/api/testimonials` | Get testimonials (existing) |
| `/api/case-studies` | Get case studies (existing) |
| `/api/testimonials/stats` | Get rating stats (NEW) |

## 🔧 Customize

### Update Branding
Edit in `app/testimonials/page.tsx`:
```tsx
// Line ~20: Hero text
<h1>Your Company Testimonials</h1>

// Line ~100: CTA section
<h2>Your Custom CTA</h2>
```

### Add Your Google Business Link
```env
NEXT_PUBLIC_GOOGLE_BUSINESS_URL=https://www.google.com/maps/place/YOUR-ID
```

### Change Service Filter Options
Filter comes from `/api/services` - automatically displays all services.

### Customize Rating Stats
Edit `RatingAggregation.tsx` line ~45 for trust indicators:
```tsx
<p className="text-2xl font-bold text-blue-600">YOUR %</p>
<p className="text-xs text-gray-600">Custom Stat</p>
```

## 🧪 Quick Tests

### Test Rating Widget
```bash
curl http://localhost:3000/api/testimonials/stats
```

Should return:
```json
{
  "averageRating": 4.8,
  "totalRatings": 147,
  "distribution": { "5": 130, "4": 15, "3": 2, "2": 0, "1": 0 }
}
```

### Test Case Study Page
Visit: `http://localhost:3000/testimonials/any-case-study-slug`

Should show:
- Hero image
- Full narrative
- Metrics
- Photo gallery
- Related studies

### Test Filtering
On main testimonials page:
- Click service type button
- Grid should filter in real-time
- Click again to deselect

## 🐛 Troubleshooting

**"No testimonials showing"**
- Check database: `SELECT * FROM "Testimonial" WHERE status = 'APPROVED'`
- Ensure at least one testimonial has `status = 'APPROVED'` and `featured = true`

**"Case study page shows 404"**
- Check slug in database: `SELECT slug FROM "CaseStudy"`
- URL slug must match exactly

**"Rating widget shows 0"**
- Verify testimonials have numeric `rating` (1-5)
- Check SQL: `SELECT rating, COUNT(*) FROM "Testimonial" GROUP BY rating`

**"Images not loading"**
- Check image URLs are absolute (https://...)
- Verify domain is in Next.js `next.config.js` remotePatterns

**"Google Reviews widget blank"**
- This is normal - shows fallback reviews
- To enable real API, set `GOOGLE_BUSINESS_API_KEY` in env

## 📊 Data Requirements

### Minimal Setup
At minimum, add:
- 1 Testimonial with `status = 'APPROVED'`, `rating = 5`
- 1 CaseStudy with `status = 'PUBLISHED'`, valid `slug`
- 1 Service record

### Recommended Setup
- 6-12 Testimonials (mix of ratings)
- 3-5 Case Studies with full narratives
- Each service type represented
- Hero images for case studies

### Maximum Impact
- 20+ Testimonials
- 10+ Case Studies with photos
- Customer avatars/headshots
- Video testimonials
- Photo gallery (20+ images)

## 🎨 Design Notes

- Primary color: Blue (tailwind `blue-600`)
- Accent: Indigo (`indigo-700`)
- Success: Green (`green-600`)
- Neutral: Gray (`gray-900`, `gray-700`, `gray-500`)

To change colors, update tailwind classes in components:
```tsx
// Change blue-600 to your-color-600
<button className="bg-blue-600 hover:bg-blue-700">
```

## ⚡ Performance Tips

**Reduce Initial Load:**
```tsx
// In page.tsx, limit initial fetch
const res = await fetch(`${baseUrl}/api/testimonials?limit=3`)
```

**Improve Image Loading:**
- Use WebP format for hero images
- Optimize images to <500KB
- Use alt text on all images

**Enable ISR Caching:**
Already configured:
- Testimonials: 1 hour
- Case studies: 1 hour  
- Services: 24 hours

## 🔐 Security Checklist

- ✅ Environment variables not in code
- ✅ Database queries use Prisma (SQL injection safe)
- ✅ User input validated server-side
- ✅ Images from trusted sources only
- ✅ No sensitive data in client components

## 📚 Full Documentation

For detailed information, see:
- `TESTIMONIALS_IMPLEMENTATION.md` - Complete guide
- Component JSDoc - In-code documentation
- `package.json` - Dependencies used

## 💬 Need Help?

**Page not loading?**
- Check browser console for errors
- Check server logs: `npm run dev` output
- Verify all dependencies installed: `npm install`

**Data not showing?**
- Check Prisma schema matches database
- Run migrations if needed: `npx prisma migrate dev`
- Seed database with sample data

**Styling issues?**
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`
- Check tailwind config is set up

## 🎉 You're All Set!

Your testimonials page is ready to showcase your success stories. The infrastructure is modern, performant, and fully functional.

**Next:** Add your real testimonials and case studies to make it shine! ✨
