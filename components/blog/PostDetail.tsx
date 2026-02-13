'use client'

import { useState, useEffect } from 'react'
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
      <figure className="my-8 animate-fade-in">
        <Image
          src={value.asset?.url || ''}
          alt={value.alt || 'Blog image'}
          width={800}
          height={400}
          className="rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
        />
        {value.caption && (
          <figcaption className="mt-3 text-center text-sm text-gray-600">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }: PortableTextComponentProps<any>) => (
      <h2 className="my-6 text-2xl font-bold text-gray-900 animate-fade-in">
        {children}
      </h2>
    ),
    h3: ({ children }: PortableTextComponentProps<any>) => (
      <h3 className="my-4 text-xl font-semibold text-gray-900 animate-fade-in">
        {children}
      </h3>
    ),
    normal: ({ children }: PortableTextComponentProps<any>) => (
      <p className="mb-4 leading-relaxed text-gray-700 animate-fade-in">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps<any>) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700 animate-fade-in">
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextComponentProps<any>) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 animate-fade-in">
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <article className={`mx-auto max-w-3xl transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="mb-12 animate-slide-down">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:shadow-md transition-shadow">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            {post.category}
          </span>
          <time className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        <p className="mb-8 text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>

        {/* Author & Meta */}
        <div className="flex items-center gap-4 pt-6 pb-6 border-b border-gray-200 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors">
          {post.author?.image && (
            <div className="relative">
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={52}
                height={52}
                className="rounded-full ring-2 ring-blue-100 hover:ring-blue-300 transition-all"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{post.author?.name}</p>
            {post.readingTime && (
              <p className="text-sm text-gray-500">
                ⏱️ {post.readingTime} min read
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.image && (
        <div className="relative mb-12 h-96 w-full overflow-hidden rounded-2xl shadow-xl animate-slide-up">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Body */}
      <div className="prose prose-sm max-w-none mb-12">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>

      {/* Comments Section */}
      {post.comments && post.comments.length > 0 && (
        <div className="mb-12 animate-fade-in">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ✨ Community Insights
            </h2>
            <p className="text-gray-600">
              {post.comments.length} {post.comments.length === 1 ? 'person' : 'people'} shared their thoughts
            </p>
          </div>
          <div className="grid gap-4">
            {post.comments.map((comment, index) => (
              <div
                key={comment._id}
                className="group rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {comment.author}
                      </p>
                      {comment.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-gray-500">
                      {formatDate(comment.timestamp)}
                    </time>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-gray-700 group-hover:bg-blue-50 transition-colors">
                    👍 {comment.likes || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comment Form */}
      <div className="mt-12 animate-slide-up">
        <div className="mb-6">
           
          <p className="mt-2 text-gray-600">Share your thoughts and insights</p>
        </div>
        <CommentForm postId={post._id} />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </article>
  )
}
