'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

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

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      {post.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-between p-6">
        {/* Category & Date */}
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            {post.category}
          </span>
          <time className="text-xs text-gray-500">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
          <Link href={`/blog/${post.slug.current}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
          {post.author && <span>{post.author.name}</span>}
          {post.readingTime && (
            <span>{post.readingTime} min read</span>
          )}
          {post.commentCount !== undefined && (
            <span>{post.commentCount} comments</span>
          )}
        </div>
      </div>
    </article>
  )
}
