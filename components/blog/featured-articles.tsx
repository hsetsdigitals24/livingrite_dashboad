'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock } from 'lucide-react'

interface FeaturedArticlesProps {
  articles: Array<{
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    readingTime: number
    author: {
      name: string
      image?: string
    }
    image?: string
  }>
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) return null

  console.log({"articles": articles})
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Articles</h2>
          <p className="text-gray-600">Our latest insights on post-acute care and family caregiving</p>
        </div>

        {articles.length === 1 ? (
          // Single featured article - full width
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:grid md:grid-cols-2 gap-6">
              {articles[0].image && (
                <div className="relative h-64 md:h-full bg-gray-200">
                  <img
                    src={articles[0].image}
                    alt={articles[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="primary">{articles[0].category}</Badge>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {articles[0].readingTime} min read
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {articles[0].title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{articles[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {articles[0].author ? (
                      <>
                        By <span className="font-medium text-gray-700">{articles[0].author.name}</span>
                      </>
                    ) : (
                      <span className="font-medium text-gray-700">LivingRite Care</span>
                    )}
                  </div>
                  <Link href={`/blogs/${articles[0].slug}`}>
                    <Button variant="outline" className="group">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        ) : (
          // Multiple featured articles - grid
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                {article.image && (
                  <div className="relative h-40 bg-gray-200">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="primary">{article.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {article.readingTime} min
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="pt-4 border-t">
                    <Link href={`/blogs/${article.slug}`}>
                      <Button variant="ghost" className="group p-0">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
