'use client'

import Image from 'next/image'
import { PortableText, PortableTextComponentProps } from '@portabletext/react'
import { formatDate } from '@/lib/utils'
import { CommentForm } from './CommentForm'

interface Author {
  _id: string
  name: string
  image?: string
}

interface PortableTextBlock {
  _type: string
  _key?: string
  [key: string]: any
}

interface PostDetailProps {
  post: {
    _id: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    image: string
    author?: Author
    readingTime?: number
    body: PortableTextBlock[]
    comments?: any[]
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => (
      <figure className="my-8">
        <Image
          src={value.asset?.url || ''}
          alt={value.alt || 'Blog image'}
          width={800}
          height={400}
          className="rounded-lg"
        />
        {value.caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-600">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }: PortableTextComponentProps<any>) => (
      <h2 className="my-4 text-2xl font-bold text-gray-900">{children}</h2>
    ),
    h3: ({ children }: PortableTextComponentProps<any>) => (
      <h3 className="my-3 text-xl font-semibold text-gray-900">{children}</h3>
    ),
    normal: ({ children }: PortableTextComponentProps<any>) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps<any>) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextComponentProps<any>) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: PortableTextComponentProps<any>) => <li>{children}</li>,
    number: ({ children }: PortableTextComponentProps<any>) => <li>{children}</li>,
  },
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="mx-auto max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {post.category}
          </span>
          <time className="text-sm text-gray-500">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          {post.title}
        </h1>

        <p className="mb-6 text-lg text-gray-600">{post.excerpt}</p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between border-b border-t border-gray-200 py-4">
          <div className="flex items-center gap-4">
            {post.author?.image && (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{post.author?.name}</p>
              {post.readingTime && (
                <p className="text-sm text-gray-500">
                  {post.readingTime} min read
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.image && (
        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="prose prose-sm max-w-none">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>

      {/* Comments Count */}
      {post.comments && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Comments ({post.comments.length})
          </h2>
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-lg bg-gray-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    {comment.author}
                    {comment.isVerified && (
                      <span className="ml-2 inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Verified
                      </span>
                    )}
                  </p>
                  <time className="text-xs text-gray-500">
                    {formatDate(comment.timestamp)}
                  </time>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  👍 {comment.likes || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comment Form */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <CommentForm postId={post._id} />
      </div>
    </article>
  )
}
