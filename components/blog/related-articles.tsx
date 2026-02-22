'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface RelatedArticlesProps {
  articles: Array<{
    id: string
    slug: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    author: {
      name: string
      slug: string
    }
  }>
  title?: string
}

export default function RelatedArticles({
  articles,
  title = 'Related Articles',
}: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">{title}</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.slice(0, 2).map((article) => (
            <Link key={article.id} href={`/blogs/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="secondary" className="mb-2">
                      {article.category}
                    </Badge>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      By <span className="font-medium">{article.author.name}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
