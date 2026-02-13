import { NextRequest, NextResponse } from 'next/server'
import { readOnlyClient } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

interface Params {
  slug: string
}

/**
 * GET /api/blog/posts/[slug]
 * Fetch a single blog post by slug with comments
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const query = `*[_type == "post" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      excerpt,
      category,
      publishedAt,
      "image": image.asset->url,
      author->{_id, name, image},
      readingTime,
      body,
      comments[isApproved == true]->{
        _id,
        author,
        email,
        content,
        timestamp,
        likes,
        isVerified
      } | order(timestamp desc)
    }`

    const post = await readOnlyClient.fetch(query)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post, { status: 200 })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch blog post'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
