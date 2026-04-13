'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Testimonial } from '@/types/testimonial'
import { SERVICE_LABELS } from '@/types/testimonial'

const PAGE_SIZE = 9

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
  const src = t.avatarUrl || t.avatarImage?.asset?.url || null
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

// ─── Testimonial card ─────────────────────────────────────────────────────────
function TestimonialFullCard({ t, idx }: { t: Testimonial; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const shouldTruncate = t.quote.length > 280
  const displayQuote = shouldTruncate && !expanded ? t.quote.slice(0, 280) + '…' : t.quote

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
        animationDelay: `${(idx % PAGE_SIZE) * 60}ms`,
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
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {t.featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,178,236,0.1)', color: '#00b2ec' }}>
                Featured
              </span>
            )}
            {t.isVerified && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
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

        {/* Media preview (first photo only) */}
        {t.mediaItems && t.mediaItems.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {t.mediaItems.slice(0, 3).map((m, i) =>
              m.mediaType === 'photo' ? (
                <a key={i} href={m.driveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-100 hover:opacity-80 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.driveUrl} alt={m.caption || 'Photo'} className="w-full h-full object-cover" />
                </a>
              ) : (
                <a key={i} href={m.driveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-6 h-6 text-[#00b2ec]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </a>
              )
            )}
            {t.mediaItems.length > 3 && (
              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                +{t.mediaItems.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <Avatar t={t} size={44} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm">{t.clientName}</p>
            {(t.clientRole || t.clientLocation) && (
              <p className="text-xs text-gray-500 truncate">
                {[t.clientRole, t.clientLocation].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {t.serviceReceived && (
            <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(0,178,236,0.08)', color: '#00b2ec' }}>
              {SERVICE_LABELS[t.serviceReceived] || t.serviceReceived}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Page client ──────────────────────────────────────────────────────────────
export function TestimonialsPageClient({
  testimonials,
  totalCount,
}: {
  testimonials: Testimonial[]
  totalCount: number
}) {
  const [page, setPage] = useState(1)
  const [filterService, setFilterService] = useState<string>('all')
  const [filterRating, setFilterRating] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Available services from data
  const availableServices = useMemo(() => {
    const set = new Set(testimonials.map((t) => t.serviceReceived).filter(Boolean) as string[])
    return Array.from(set)
  }, [testimonials])

  // Filtered
  const filtered = useMemo(() => {
    return testimonials.filter((t) => {
      if (filterService !== 'all' && t.serviceReceived !== filterService) return false
      if (filterRating > 0 && t.rating < filterRating) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !t.clientName.toLowerCase().includes(q) &&
          !t.quote.toLowerCase().includes(q) &&
          !(t.clientLocation || '').toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [testimonials, filterService, filterRating, searchQuery])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Average rating
  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : '0'

  function handleFilterChange(setter: (v: any) => void, value: any) {
    setter(value)
    setPage(1)
  }

  return (
    <div>
      {/* ── Hero banner ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-20"
        style={{
          background: 'linear-gradient(135deg, #00b2ec 0%, #0077a8 55%, #005f88 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'white' }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10"
          style={{ background: '#e50d92' }} />

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
              <p className="text-3xl font-bold">
                {testimonials.filter((t) => t.isVerified).length}
              </p>
              <p className="text-blue-200 text-sm">Verified Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 shadow-sm" style={{ background: 'white', borderBottom: '1px solid #e8f4fa' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search testimonials…" value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#00b2ec] focus:border-[#00b2ec]"
              style={{ borderColor: '#d1d5db' }} />
          </div>

          {/* Service filter */}
          <select value={filterService} onChange={(e) => handleFilterChange(setFilterService, e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#00b2ec] cursor-pointer"
            style={{ borderColor: '#d1d5db' }}>
            <option value="all">All Services</option>
            {availableServices.map((s) => (
              <option key={s} value={s}>{SERVICE_LABELS[s] || s}</option>
            ))}
          </select>

          {/* Rating filter */}
          <select value={filterRating} onChange={(e) => handleFilterChange(setFilterRating, Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#00b2ec] cursor-pointer"
            style={{ borderColor: '#d1d5db' }}>
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={3}>3+ Stars</option>
          </select>

          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {paginated.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-base font-medium">No testimonials match your filters.</p>
            <button onClick={() => { setFilterService('all'); setFilterRating(0); setSearchQuery(''); setPage(1) }}
              className="mt-3 text-sm text-[#00b2ec] hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((t, idx) => (
              <TestimonialFullCard key={t._id} t={t} idx={idx} />
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-all disabled:opacity-30 hover:bg-[#00b2ec] hover:border-[#00b2ec] hover:text-white"
              style={{ borderColor: '#00b2ec', color: '#00b2ec' }}>
              ‹
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1
              if (!show && (p === 2 || p === totalPages - 1)) return <span key={p} className="px-1 text-gray-300">…</span>
              if (!show) return null
              return (
                <button key={p} onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    borderColor: page === p ? '#00b2ec' : '#e5e7eb',
                    background: page === p ? '#00b2ec' : 'white',
                    color: page === p ? 'white' : '#374151',
                  }}>
                  {p}
                </button>
              )
            })}

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-all disabled:opacity-30 hover:bg-[#00b2ec] hover:border-[#00b2ec] hover:text-white"
              style={{ borderColor: '#00b2ec', color: '#00b2ec' }}>
              ›
            </button>
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
