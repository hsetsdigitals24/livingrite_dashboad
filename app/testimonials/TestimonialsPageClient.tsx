'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Testimonial } from '@/types/testimonial'

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5"
          style={{ width: size, height: size }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ t, size = 56 }: { t: Testimonial; size?: number }) {
  const [err, setErr] = useState(false)
  const src = t.clientImage || null
  const initials = t.clientName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  if (!src || err) {
    return (
      <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
        style={{ width: size, height: size, background: 'linear-gradient(135deg, #00b2ec 0%, #0077a8 100%)', fontSize: size * 0.34 }}>
        {initials}
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={t.clientName} width={size} height={size}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }} onError={() => setErr(true)} />
  )
}

// ─── Video embed (toggled) ──────────────────────────────────────────────────────
function getYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m && m[1]) return m[1]
  }
  return null
}

function VideoTestimonial({ url }: { url: string }) {
  const [open, setOpen] = useState(false)
  const ytId = getYoutubeId(url)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-[#00b2ec] hover:underline focus:outline-none"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        Watch video testimonial
      </button>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-black">
      {ytId ? (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title="Video testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={url} controls autoPlay className="w-full h-full object-contain" />
      )}
    </div>
  )
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
function TestimonialFullCard({ t, idx }: { t: Testimonial; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const shouldTruncate = t.content.length > 280
  const displayQuote = shouldTruncate && !expanded ? t.content.slice(0, 280) + '…' : t.content

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: t.featured ? '1.5px solid #00b2ec' : '1px solid #e8f4fa',
        boxShadow: t.featured
          ? '0 8px 32px rgba(0,178,236,0.14)'
          : '0 2px 12px rgba(0,0,0,0.05)',
        animation: 'fadeUp 0.5s ease both',
        animationDelay: `${(idx % 9) * 60}ms`,
      }}
    >
      {/* Top accent */}
      <div className="h-1 w-full" style={{
        background: t.featured
          ? 'linear-gradient(90deg, #00b2ec, #e50d92)'
          : 'linear-gradient(90deg, #00b2ec44, #e50d9244)',
      }} />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <Stars rating={t.rating} />
          {t.featured && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(0,178,236,0.1)', color: '#00b2ec' }}>
              Featured
            </span>
          )}
        </div>

        {/* Quote */}
        <blockquote className="flex-1 text-gray-700 text-sm leading-relaxed italic">
          &ldquo;{displayQuote}&rdquo;
          {shouldTruncate && (
            <button onClick={() => setExpanded(!expanded)}
              className="ml-1 text-[#00b2ec] font-semibold not-italic text-xs hover:underline focus:outline-none">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </blockquote>

        {/* Video testimonial */}
        {t.videoUrl && <VideoTestimonial url={t.videoUrl} />}

        {/* Author */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <Avatar t={t} size={44} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm">{t.clientName}</p>
            {(t.clientTitle || t.clientLocation) && (
              <p className="text-xs text-gray-500 truncate">
                {[t.clientTitle, t.clientLocation].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {t.serviceName && (
            <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(0,178,236,0.08)', color: '#00b2ec' }}>
              {t.serviceName}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Pagination link ────────────────────────────────────────────────────────────
function PageLink({ page, current, children, disabled }: {
  page: number; current?: boolean; children: React.ReactNode; disabled?: boolean
}) {
  if (disabled) {
    return (
      <span className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm opacity-30"
        style={{ borderColor: '#00b2ec', color: '#00b2ec' }}>
        {children}
      </span>
    )
  }
  return (
    <Link href={`/testimonials?page=${page}`} scroll
      className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-medium transition-all"
      style={{
        borderColor: current ? '#00b2ec' : '#e5e7eb',
        background: current ? '#00b2ec' : 'white',
        color: current ? 'white' : '#374151',
      }}>
      {children}
    </Link>
  )
}

// ─── Page client ──────────────────────────────────────────────────────────────
export function TestimonialsPageClient({
  testimonials,
  totalCount,
  avgRating,
  page,
  totalPages,
}: {
  testimonials: Testimonial[]
  totalCount: number
  avgRating: string
  page: number
  totalPages: number
}) {
  const fiveStarCount = testimonials.filter((t) => t.rating === 5).length

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div>
      {/* ── Hero banner ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-20"
        style={{ background: 'linear-gradient(135deg, #00b2ec 0%, #0077a8 55%, #005f88 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10" style={{ background: '#e50d92' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            Client Stories
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Voices of Trust
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Every story here is a life touched. Read what families and patients say about the care they received from LivingRite.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div>
              <p className="text-3xl font-bold">{totalCount}</p>
              <p className="text-blue-200 text-sm">Total Reviews</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold">{avgRating}</p>
              <p className="text-blue-200 text-sm">Average Rating</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold">{fiveStarCount}</p>
              <p className="text-blue-200 text-sm">5-Star On This Page</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {testimonials.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-base font-medium">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <TestimonialFullCard key={t.id} t={t} idx={idx} />
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <PageLink page={page - 1} disabled={page === 1}>‹</PageLink>

            {pageNumbers.map((p, i) => {
              const prev = pageNumbers[i - 1]
              const gap = prev !== undefined && p - prev > 1
              return (
                <React.Fragment key={p}>
                  {gap && <span className="px-1 text-gray-300">…</span>}
                  <PageLink page={p} current={p === page}>{p}</PageLink>
                </React.Fragment>
              )
            })}

            <PageLink page={page + 1} disabled={page === totalPages}>›</PageLink>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00b2ec] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
