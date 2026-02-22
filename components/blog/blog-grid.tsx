'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock, User } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: number
  author?: {
    name: string
    slug?: string
    image?: string
  }
  image?: string
  featured?: boolean
}

interface BlogGridProps {
  posts: BlogPost[]
  loading?: boolean
}

export default function BlogGrid({ posts, loading }: BlogGridProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-40 bg-gray-200" />
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No articles found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/blogs/${post.slug}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
            {post.image && (
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {post.featured && (
                  <Badge className="absolute top-3 right-3 bg-accent text-white">
                    Featured
                  </Badge>
                )}
              </div>
            )}
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-3">
                <Badge variant="secondary" className="mb-2">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>

              <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {post.author?.image && (
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-xs font-medium text-gray-700 line-clamp-1">
                    {post.author?.name || 'LivingRite Care'}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
