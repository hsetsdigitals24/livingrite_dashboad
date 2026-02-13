'use client'

import { useCallback } from 'react'
import { BlogCard } from './BlogCard'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  category: string
  publishedAt: string
  image: string
  author?: {
    name: string
  }
  readingTime?: number
  commentCount?: number
}

interface BlogListProps {
  posts: BlogPost[]
  isLoading?: boolean
}

export function BlogList({ posts, isLoading }: BlogListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-6"
            style={{ minHeight: '400px' }}
          />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your filters or check back later
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  )
}
