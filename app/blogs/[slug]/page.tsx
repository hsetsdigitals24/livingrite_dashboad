import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AuthorCard from '@/components/blog/author-card'
import RelatedArticles from '@/components/blog/related-articles'
import NewsletterSignup from '@/components/blog/newsletter-signup'
import ShareButtons from '@/components/blog/share-buttons'
import BlogComments from '@/components/blog/blog-comments'
import { CTABanner } from '@/components/cta-banner'
import { Clock, ArrowLeft, Calendar, User } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import AnimatedBlogContent from '@/components/blog/animated-blog-content'
import StyledPortableText from '@/components/blog/styled-portable-text'

interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  category?: string
  publishedAt: string
  updatedAt?: string
  readingTime?: number
  author?: {
    name: string
    slug?: {
      current: string
    }
    bio?: string
    image?: {
      asset: {
        _id: string
      }
    }
  }
  image?: {
    asset: {
      _id: string
    }
  }
  body?: any[]
  relatedArticles?: any[]
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      category,
      publishedAt,
      updatedAt,
      readingTime,
      author->{
        name,
        slug,
        bio,
        image
      },
      image,
      body,
      "relatedArticles": *[_type == "post" && category == ^.category && slug.current != ^.slug.current][0...3] {
        _id,
        title,
        slug,
        excerpt,
        category,
        author->{
          name,
          slug
        }
      }
    }`

    const post = await client.fetch(query, { slug })
    return post || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Article Not Found | LivingRite Care',
      description: 'The article you are looking for could not be found.',
    }
  }

  return {
    title: `${post.title} | LivingRite Care Blog`,
    description: post.excerpt || post.title,
    keywords: [post.category || 'healthcare', 'healthcare', 'home care'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: urlFor(post.image).url() }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-accent/5">
        <section className="py-32 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the article you're looking for.</p>
            <Link href="/blogs">
              <Button size="lg" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://livingritecare.com/blogs/${slug}`
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Animation */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-white via-primary/3 to-accent/3 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <AnimatedBlogContent delay={0.1}>
            <Link href="/blogs" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all mb-6 font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Back to Blog
            </Link>
          </AnimatedBlogContent>

          <AnimatedBlogContent delay={0.15}>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm font-semibold capitalize">
              {post.category || 'Article'}
            </Badge>
          </AnimatedBlogContent>

          <AnimatedBlogContent delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
          </AnimatedBlogContent>

          <AnimatedBlogContent delay={0.25}>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          </AnimatedBlogContent>

          <AnimatedBlogContent delay={0.3}>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-8">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">{post.readingTime || 5} min read</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {post.author && (
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}
            </div>
          </AnimatedBlogContent>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="relative py-8 px-6">
          <AnimatedBlogContent delay={0.35}>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={urlFor(post.image).url()}
                  alt={post.title}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </AnimatedBlogContent>
        </section>
      )}

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedBlogContent delay={0.4}>
            <div className="text-gray-700 leading-relaxed">
              {post.body && <StyledPortableText value={post.body} />}
            </div>
          </AnimatedBlogContent>

          {/* Share Buttons */}
          <AnimatedBlogContent delay={0.45}>
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Share this article</h3>
              <ShareButtons title={post.title} url={articleUrl} />
            </div>
          </AnimatedBlogContent>
        </div>
      </article>

      {/* Author Card */}
      {post.author && (
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatedBlogContent delay={0.5}>
              <AuthorCard 
                author={{
                  name: post.author.name,
                  slug: post.author.slug?.current || '',
                  bio: post.author.bio,
                  image: post.author.image ? urlFor(post.author.image).url() : undefined,
                  credentials: [],
                  yearsOfExperience: 0,
                  socialLinks: {
                    linkedin: '',
                    email: '',
                  }
                }} 
                articleCount={3} 
              />
            </AnimatedBlogContent>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {post.relatedArticles && post.relatedArticles.length > 0 && (
        <AnimatedBlogContent delay={0.55}>
          <RelatedArticles 
            articles={post.relatedArticles.map((article: any) => ({
              id: article._id,
              slug: article.slug?.current,
              title: article.title,
              excerpt: article.excerpt,
              category: article.category,
              author: { name: article.author?.name },
            }))} 
          />
        </AnimatedBlogContent>
      )}

      {/* Comments Section */}
      <AnimatedBlogContent delay={0.58}>
        <BlogComments postId={post._id} postTitle={post.title} />
      </AnimatedBlogContent>

      {/* Newsletter Signup */}
      <AnimatedBlogContent delay={0.6}>
        <NewsletterSignup />
      </AnimatedBlogContent>

      {/* CTA Banner */}
      <AnimatedBlogContent delay={0.65}>
        <CTABanner />
      </AnimatedBlogContent>
    </main>
  )
}


