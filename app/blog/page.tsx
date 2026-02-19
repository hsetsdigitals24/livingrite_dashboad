'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BlogList } from '@/components/blog/BlogList'
import { BlogCategoryFilter } from '@/components/blog/BlogCategoryFilter'

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

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

function BlogPageContent() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(pagination.page),
          limit: String(pagination.limit),
        })

        if (selectedCategory) {
          params.append('category', selectedCategory)
        }

        if (searchQuery) {
          params.append('search', searchQuery)
        }

        const res = await fetch(`/api/blog/posts?${params}`)
        const data = await res.json()

        setPosts(data.posts || [])
        setPagination(data.pagination)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [selectedCategory, searchQuery, pagination.page, pagination.limit])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Blog & Resources
          </h1>
          <p className="text-lg text-gray-600">
            Expert insights and practical tips for caregiving and wellness
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="flex">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPagination((p) => ({ ...p, page: 1 }))
              }}
              className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="rounded-r-lg bg-primary px-4 py-2 font-medium text-white hover:bg-accent">
              Search
            </button>
          </div>

          {/* Category Filter */}
          <BlogCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category)
              setPagination((p) => ({ ...p, page: 1 }))
            }}
          />
        </div>

        {/* Blog List */}
        <BlogList posts={posts} isLoading={isLoading} />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  page: Math.max(1, p.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className="rounded border border-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, pagination.page - 2),
                  Math.min(pagination.pages, pagination.page + 2)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page }))
                    }
                    className={`rounded px-3 py-2 font-medium ${
                      pagination.page === page
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  page: Math.min(p.pages, p.page + 1),
                }))
              }
              disabled={pagination.page === pagination.pages}
              className="rounded border border-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12" />}>
      <BlogPageContent />
    </Suspense>
  )
}