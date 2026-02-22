import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import FeaturedArticles from '@/components/blog/featured-articles'
// import BlogFilters from '@/components/blog/blog-filters'
import BlogGrid from '@/components/blog/blog-grid'
import NewsletterSignup from '@/components/blog/newsletter-signup'
import { CTABanner } from '@/components/cta-banner'
import { ArrowRight, Search } from 'lucide-react'
import { getAllBlogPosts, getBlogPostsByCategory } from '@/lib/blog'

export const metadata = {
  title: 'Blog & Health Resources | LivingRite Care',
  description:
    'Discover expert articles on post-acute care, stroke recovery, ICU recovery, palliative care, and family caregiving. Your trusted source for healthcare insights.',
  keywords: [
    'post-acute care',
    'stroke recovery',
    'ICU recovery',
    'palliative care',
    'family caregiving',
    'home healthcare',
    'nursing care',
  ],
}

interface SearchParamsProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: SearchParamsProps) {
  const params = await searchParams
  const category = params?.category as string | undefined
  const search = params?.search as string | undefined

  // Fetch all blog posts from Sanity
  let allArticles = await getAllBlogPosts()

  // Filter articles based on category and search
  let filteredArticles = allArticles

  if (category && category !== 'all') {
    const categoryPosts = await getBlogPostsByCategory(category)
    filteredArticles = categoryPosts.length > 0 ? categoryPosts : []
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower)
    )
  }

  // Get featured articles (first 2)
  const featuredArticles = allArticles.slice(0, 2).map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    publishedAt: article.date,
    readingTime: article.readingTime,
    author: article.author,
    image: article.image,
  }))

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Badge className="mb-4 inline-flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Healthcare Insights
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog & Health Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Expert articles on post-acute care, recovery strategies, and family caregiving. 
            Your trusted source for healthcare knowledge and support.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form
              action="/search"
              method="get"
              className="flex gap-2 bg-white rounded-lg shadow-md p-2"
            >
              <Search className="w-5 h-5 text-gray-400 m-3" />
              <input
                type="text"
                name="q"
                placeholder="Search articles by topic..."
                defaultValue={search || ''}
                className="flex-1 px-2 py-3 outline-none text-gray-900 placeholder-gray-500"
              />
              <Button type="submit" className="m-1">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <FeaturedArticles articles={featuredArticles} />

      {/* Category Filters */}
      {/* <BlogFilters activeFilter={category || 'all'} /> */}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {filteredArticles.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {category === 'all' || !category
                    ? 'All Articles'
                    : category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </h2>
                <p className="text-gray-600">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <BlogGrid posts={filteredArticles.map(article => ({
                id: article.id,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                category: article.category,
                publishedAt: article.date,
                readingTime: article.readingTime,
                author: article.author,
                image: article.image,
              }))} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No articles found matching your search.</p>
              <Link href="/blogs">
                <Button variant="outline">Clear Search</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Resources Hub */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Additional Resources</h2>
            <p className="text-gray-600">Free guides and tools for home care</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Resource 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Care Guides & Checklists</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download our comprehensive care guides and daily checklists to support your caregiving journey.
                </p>
                <Link href="/resources" className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                  Download Guides
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Resource 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Watch our expert videos on physiotherapy exercises, wound care, and patient safety.
                </p>
                <Link href="/resources" className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                  View Videos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Resource 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Consultation</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Book a free consultation with our healthcare specialists to discuss your care needs.
                </p>
                <Link href="/services" className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                  Book Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </main>
  )
}
