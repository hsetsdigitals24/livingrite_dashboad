'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Ban, CheckIcon, FlagTriangleRight } from 'lucide-react' 
// import { CheckIcon, XMarkIcon, ExclamationIcon } from '@heroicons/react/24/outline'

interface Comment {
  _id: string
  author: string
  email: string
  content: string
  timestamp: string
  likes: number
  isVerified: boolean
  isApproved: boolean
  flagged: boolean
}

interface CommentModerationProps {
  postId: string
  postTitle: string
}

export function CommentModeration({ postId, postTitle }: CommentModerationProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [status, setStatus] = useState<'pending' | 'approved' | 'flagged'>('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [postId, status])

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/blog/comments?postId=${postId}&status=${status}`
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch comments')
        return
      }

      setComments(data.comments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (commentId: string) => {
    setActionLoading(commentId)
    try {
      const res = await fetch(`/api/blog/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })

      if (!res.ok) {
        throw new Error('Failed to approve comment')
      }

      setComments(comments.filter((c) => c._id !== commentId))
    } catch (err) {
      console.error('Error approving comment:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (commentId: string) => {
    setActionLoading(commentId)
    try {
      const res = await fetch(`/api/blog/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      })

      if (!res.ok) {
        throw new Error('Failed to reject comment')
      }

      setComments(comments.filter((c) => c._id !== commentId))
    } catch (err) {
      console.error('Error rejecting comment:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setActionLoading(commentId)
    try {
      const res = await fetch(`/api/blog/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete comment')
      }

      setComments(comments.filter((c) => c._id !== commentId))
    } catch (err) {
      console.error('Error deleting comment:', err)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Comment Moderation</h2>
        <p className="mt-1 text-sm text-gray-600">
          Moderate comments for "{postTitle}"
        </p>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {(['pending', 'approved', 'flagged'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatus(tab)}
            className={`px-4 py-2 font-medium ${
              status === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No {status} comments found
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {comment.author}
                    {comment.isVerified && (
                      <span className="ml-2 inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Verified
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{comment.email}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(comment.timestamp)}
                  </p>
                </div>
                {comment.flagged && (
                  <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs text-yellow-700">
                    <FlagTriangleRight className="h-3 w-3" />
                    Flagged
                  </div>
                )}
              </div>

              <p className="mb-4 text-sm text-gray-700">{comment.content}</p>

              <p className="mb-4 text-xs text-gray-500">👍 {comment.likes}</p>

              {/* Actions */}
              {status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(comment._id)}
                    disabled={actionLoading === comment._id}
                    className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(comment._id)}
                    disabled={actionLoading === comment._id}
                    className="flex items-center gap-1 rounded bg-gray-600 px-3 py-1 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Ban className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              )}

              {status !== 'pending' && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  disabled={actionLoading === comment._id}
                  className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
