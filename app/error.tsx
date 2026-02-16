'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by error boundary:', error)
    }
    // TODO: Send error to logging service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Something went wrong!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We're sorry for the inconvenience. An error occurred while processing your request.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
              <p className="text-xs text-red-700 font-mono text-left">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 font-mono text-left mt-1">
                  <strong>ID:</strong> {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-md hover:bg-gray-300 transition-colors text-center"
          >
            Go back home
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center text-xs text-gray-500 pt-4">
          <p>
            If the problem persists, please{' '}
            <Link
              href="/support/new"
              className="text-blue-600 hover:underline"
            >
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
