import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Use a simpler pattern matching approach that's more reliable
    const pattern = q.toLowerCase().trim()
    
    const query = `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      excerpt,
      category,
      "slug": slug.current,
      publishedAt,
      readingTime,
      "author": author->{
        name
      },
      "image": image
    }`

    const allPosts = await client.fetch(query)

    // Client-side filtering for more reliable search
    const filteredPosts = allPosts.filter((post: any) => {
      const searchableText = `${post.title || ''} ${post.excerpt || ''} ${post.category || ''}`.toLowerCase()
      return searchableText.includes(pattern)
    })

    // Transform results
    const results = filteredPosts.map((post: any) => ({
      id: post._id,
      slug: post.slug || '',
      title: post.title || '',
      excerpt: post.excerpt || '',
      category: post.category || 'General',
      date: post.publishedAt || new Date().toISOString(),
      readingTime: post.readingTime || 5,
      author: post.author,
      image: post.image?.asset ? urlFor(post.image).url() : null,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to search articles',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
