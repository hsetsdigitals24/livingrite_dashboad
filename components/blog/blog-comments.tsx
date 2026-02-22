'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, ThumbsUp, Flag, Reply } from 'lucide-react'

interface Comment {
  _id: string
  author: string
  email: string
  content: string
  timestamp: string
  likes: number
  isVerified?: boolean
}

interface BlogCommentsProps {
  postId: string
  postTitle: string
}

export default function BlogComments({ postId, postTitle }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [likedComments, setLikedComments] = useState<string[]>([])
  const [flaggedComments, setFlaggedComments] = useState<string[]>([])

  // Fetch comments on component mount
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {

    fetchComments()
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !content.trim()) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          author: name,
          email,
          content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment')
      }

      // Add the new comment to the list immediately
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev])
      }

      // Clear form
      setName('')
      setEmail('')
      setContent('')

      // Show success message
      // alert('Comment posted successfully!')
      fetchComments()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit comment'
      setError(message)
      console.error('Error submitting comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      const isLiking = !likedComments.includes(commentId)
      setLikedComments((prev) =>
        isLiking ? [...prev, commentId] : prev.filter((id) => id !== commentId)
      )

      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          action: isLiking ? 'like' : 'unlike',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      // Update comment likes in state
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, likes: isLiking ? c.likes + 1 : Math.max(0, c.likes - 1) }
            : c
        )
      )
    } catch (err) {
      console.error('Error updating like:', err)
      // Revert optimistic update
      setLikedComments((prev) =>
        prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
      )
    }
  }

  const handleFlagComment = async (commentId: string) => {
    try {
      setFlaggedComments((prev) => [...prev, commentId])

      const response = await fetch('/api/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          action: 'flag',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to flag comment')
      }
    } catch (err) {
      console.error('Error flagging comment:', err)
      // Revert optimistic update
      setFlaggedComments((prev) =>
        prev.filter((id) => id !== commentId)
      )
    }
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
      transition: { duration: 0.5 },
    },
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">
              Comments ({isLoading ? '...' : comments.length})
            </h2>
          </div>
          <p className="text-gray-600">Join the conversation and share your thoughts on this article.</p>
        </motion.div>

        {/* Comment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Leave a comment</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                  >
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Comment</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts about this article..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !email.trim() || !content.trim()}
                    className="rounded-lg px-8 font-semibold flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Comment
                      </>
                    )}
                  </Button>
              
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-2">Loading comments...</p>
          </div>
        )}

        {/* Comments List */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <motion.div key={comment._id} variants={itemVariants} layout>
                    <Card className="border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-primary text-lg">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900">{comment.author}</h4>
                                {comment.isVerified && (
                                  <Badge className="bg-primary/20 text-primary text-xs font-semibold">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{timeAgo(comment.timestamp)}</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFlagComment(comment._id)}
                            className={`transition-colors ${
                              flaggedComments.includes(comment._id)
                                ? 'text-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            } opacity-0 group-hover:opacity-100`}
                            title="Report comment"
                          >
                            <Flag className="w-5 h-5" />
                          </motion.button>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-6">{comment.content}</p>

                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLikeComment(comment._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                              likedComments.includes(comment._id)
                                ? 'bg-primary/20 text-primary font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm font-medium">{comment.likes}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                          >
                            <Reply className="w-4 h-4" />
                            <span className="text-sm font-medium">Reply</span>
                          </motion.button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl"
                >
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
