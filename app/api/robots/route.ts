import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `# Robots.txt for LivingRite Care Portal
# Optimized for search engine crawling

User-agent: *
Allow: /
Allow: /blogs
Allow: /services
Allow: /about
Allow: /testimonials
Allow: /team
Allow: /contact

# Disallow private/admin routes
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /unauthorized
Disallow: /caregiver/ 
Disallow: /client/

# Disallow parameters that create duplicate content
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*page=
Disallow: /*?*utm_

# Specific rules for search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Slow down aggressive crawlers
User-agent: MJ12bot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 10

# Sitemap location
Sitemap: https://livingritecare.com/sitemap.xml
Sitemap: https://livingritecare.com/api/sitemap`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
