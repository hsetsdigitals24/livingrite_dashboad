'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge' 
import { CTABanner } from '@/components/cta-banner'
import {
  Search,
  ArrowRight,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: number
  author?: {
    name: string
  }
  image: string | null
}

const POSTS_PER_PAGE = 6

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')

  // Load search query from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchQuery = params.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
      // Perform search automatically
      handleSearchWithQuery(searchQuery)
    }
  }, [])

  const handleSearchWithQuery = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setCurrentPage(1)
    setHasSearched(true)

    try {
      const encodedQuery = encodeURIComponent(searchQuery)
      const url = `/api/search?q=${encodedQuery}`
      console.log('Searching with URL:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }
      
      console.log('Search results:', data)
      setResults(data.results || [])
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Failed to search articles. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(results.length / POSTS_PER_PAGE)
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedResults = results.slice(startIdx, startIdx + POSTS_PER_PAGE)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Update URL with search query
    window.history.pushState(null, '', `/search?q=${encodeURIComponent(query)}`)
    
    await handleSearchWithQuery(query)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const searchInputVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.5 } },
  }

  const resultsHeaderVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-primary/2 to-accent/2">
      {/* Hero Search Section */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
              Find Expert Insights
            </h1>
            <p className="text-xl text-gray-600">
              Search through our comprehensive library of healthcare articles and care guides
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="relative"
            variants={searchInputVariants}
            initial="initial"
            animate="animate"
          >
            <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 pointer-events-none" />

              <div className="relative flex items-center px-6 py-4 gap-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by topic, title, or keyword..."
                  className="flex-1 outline-none text-lg text-gray-900 placeholder-gray-500 bg-transparent"
                />
                <Button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-8 rounded-xl font-semibold flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Search
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.form>

          {/* Search Tips */}
          <motion.div
            className="mt-6 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {['stroke recovery', 'post-ICU care', 'physiotherapy', 'home care'].map((tip) => (
              <button
                key={tip}
                onClick={() => setQuery(tip)}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                {tip}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <motion.div
              className="mb-8"
              variants={resultsHeaderVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                {loading ? 'Searching...' : `Results for "${query}"`}
              </h2>
              {!loading && (
                <p className="text-gray-600 mt-2">
                  {results.length === 0
                    ? 'No articles found'
                    : `Found ${results.length} article${results.length !== 1 ? 's' : ''}`}
                </p>
              )}
            </motion.div>

            {/* Error State */}
            {error && (
              <motion.div
                className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">{error}</p>
                  <p className="text-sm text-red-700 mt-1">Please try again or contact support</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                className="py-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Searching our database...</p>
              </motion.div>
            )}

            {/* Results Grid */}
            <AnimatePresence mode="wait">
              {!loading && results.length > 0 && (
                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {paginatedResults.map((post) => (
                    <motion.div key={post.id} variants={itemVariants}>
                      <Link href={`/blogs/${post.slug}`}>
                        <Card className="h-full group overflow-hidden border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                          <CardContent className="p-0 h-full flex flex-col">
                            {/* Image */}
                            {post.image && (
                              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                                <motion.img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  initial={{ scale: 1 }}
                                  whileHover={{ scale: 1.1 }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                              </div>
                            )}

                            <div className="p-6 flex flex-col flex-1">
                              {/* Category Badge */}
                              <Badge className="w-fit mb-3 bg-primary/10 text-primary hover:bg-primary/20 capitalize">
                                {post.category}
                              </Badge>

                              {/* Title */}
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                {post.title}
                              </h3>

                              {/* Excerpt */}
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                {post.excerpt}
                              </p>

                              {/* Meta Info */}
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{post.readingTime} min read</span>
                                </div>
                                {post.author && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{post.author.name}</span>
                                  </div>
                                )}
                              </div>

                              {/* Read More Link */}
                              <motion.div
                                className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                                whileHover={{ x: 4 }}
                              >
                                Read Article
                                <ArrowRight className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!loading && results.length === 0 && hasSearched && (
              <motion.div
                className="py-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or browse our featured articles for inspiration.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery('')
                      setResults([])
                      setHasSearched(false)
                      setCurrentPage(1)
                    }}
                  >
                    New Search
                  </Button>
                  <Link href="/blogs">
                    <Button>Browse All Articles</Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && results.length > POSTS_PER_PAGE && (
              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      )}
 

      {/* CTA Banner */}
      <CTABanner />
    </main>
  )
}
