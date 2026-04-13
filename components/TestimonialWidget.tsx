'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Testimonial, SERVICE_LABELS } from '@/types/testimonial'

// ─── Helper: resolve avatar URL ──────────────────────────────────────────────
function resolveAvatar(t: Testimonial): string | null {
  if (t.avatarUrl) return t.avatarUrl
  if (t.avatarImage?.asset?.url) return t.avatarImage.asset.url
  return null
}

// ─── Stars ───────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#d1d5db'}
          strokeWidth="1.5"
          className="w-4 h-4 transition-colors"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Avatar / initials fallback ───────────────────────────────────────────────
function Avatar({ testimonial, size = 56 }: { testimonial: Testimonial; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const src = resolveAvatar(testimonial)
  const initials = testimonial.clientName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (!src || imgError) {
    return (
      <div
        className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #00b2ec 0%, #0077a8 100%)',
          fontSize: size * 0.35,
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={testimonial.clientName}
      width={size}
      height={size}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }}
      onError={() => setImgError(true)}
    />
  )
}

// ─── Single card ─────────────────────────────────────────────────────────────
function TestimonialCard({
  testimonial,
  isActive,
  index,
}: {
  testimonial: Testimonial
  isActive: boolean
  index: number
}) {
  const displayQuote = testimonial.shortQuote || testimonial.quote

  return (
    <Link href="/testimonials" className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b2ec] rounded-2xl">
      <div
        className="relative h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer select-none"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px)',
          border: isActive ? '1.5px solid #00b2ec' : '1.5px solid rgba(0,178,236,0.15)',
          boxShadow: isActive
            ? '0 8px 40px rgba(0,178,236,0.18), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 2px 16px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease',
          transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
          animationDelay: `${index * 80}ms`,
        }}
      >
        {/* Accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, #00b2ec, #e50d92)',
            opacity: isActive ? 1 : 0.3,
          }}
        />

        <div className="p-6 flex flex-col gap-4 h-full">
          {/* Stars + badge */}
          <div className="flex items-center justify-between">
            <Stars rating={testimonial.rating} />
            {testimonial.isVerified && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>

          {/* Quote */}
          <blockquote className="flex-1 text-gray-700 text-sm leading-relaxed italic">
            &ldquo;{displayQuote}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
            <Avatar testimonial={testimonial} size={44} />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.clientName}</p>
              {(testimonial.clientRole || testimonial.clientLocation) && (
                <p className="text-xs text-gray-500 truncate">
                  {[testimonial.clientRole, testimonial.clientLocation].filter(Boolean).join(' · ')}
                </p>
              )}
              {testimonial.serviceReceived && (
                <p className="text-xs text-[#00b2ec] mt-0.5 truncate">
                  {SERVICE_LABELS[testimonial.serviceReceived] || testimonial.serviceReceived}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Widget skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-2.5 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────────────────────
interface TestimonialWidgetProps {
  /** Pre-fetched testimonials (server component passes these in) */
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
  loading?: boolean
}

export function TestimonialWidget({
  testimonials,
  title = 'What Our Clients Say',
  subtitle = `Real stories from real families we've had the privilege to care for.`,
  loading = false,
}: TestimonialWidgetProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [visibleStart, setVisibleStart] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const CARDS_PER_VIEW = 3
  const total = testimonials.length

  // Responsive: show fewer on smaller viewports via CSS, but JS logic stays at 3
  const canGoNext = visibleStart + CARDS_PER_VIEW < total
  const canGoPrev = visibleStart > 0

  const next = useCallback(() => {
    if (canGoNext) {
      setVisibleStart((s) => s + 1)
      setActiveIndex((i) => Math.min(i + 1, total - 1))
    } else {
      setVisibleStart(0)
      setActiveIndex(0)
    }
  }, [canGoNext, total])

  const prev = useCallback(() => {
    if (canGoPrev) {
      setVisibleStart((s) => s - 1)
      setActiveIndex((i) => Math.max(i - 1, 0))
    }
  }, [canGoPrev])

  // Auto-rotate
  useEffect(() => {
    if (isHovered || loading || total === 0) return
    intervalRef.current = setInterval(next, 4500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isHovered, loading, next, total])

  const visibleCards = testimonials.slice(visibleStart, visibleStart + CARDS_PER_VIEW)

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f0fbff 0%, #ffffff 50%, #fff0f8 100%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 50%, rgba(0,178,236,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(229,13,146,0.10) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(0,178,236,0.1)', color: '#00b2ec' }}>
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            {title}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">{subtitle}</p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : total === 0 ? (
          <p className="text-center text-gray-400 py-12">No testimonials found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCards.map((t, i) => (
                <div
                  key={t._id}
                  style={{
                    animation: 'fadeSlideIn 0.45s ease both',
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <TestimonialCard
                    testimonial={t}
                    isActive={i === 0}
                    index={i}
                  />
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={prev}
                disabled={!canGoPrev}
                aria-label="Previous testimonials"
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-all disabled:opacity-30 hover:bg-[#00b2ec] hover:border-[#00b2ec] hover:text-white"
                style={{ borderColor: '#00b2ec', color: '#00b2ec' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(total / 1) }).slice(0, Math.min(total, 8)).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setVisibleStart(i); setActiveIndex(i) }}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === visibleStart ? 24 : 8,
                      height: 8,
                      background: i === visibleStart ? '#00b2ec' : '#cbd5e1',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next testimonials"
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:bg-[#00b2ec] hover:border-[#00b2ec] hover:text-white"
                style={{ borderColor: '#00b2ec', color: '#00b2ec' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #00b2ec, #0077a8)', color: 'white' }}
              >
                View All Testimonials
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
