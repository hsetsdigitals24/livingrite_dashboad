import { NextRequest, NextResponse } from 'next/server'
import { readOnlyClient } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

/**
 * GET /api/blog/posts
 * Fetch blog posts with optional filtering by category or search
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '12'))
    const skip = (page - 1) * limit

    // Build base filter query
    let filterQuery = `*[_type == "post"`

    if (category) {
      filterQuery += ` && category == "${category}"`
    }

    if (search) {
      filterQuery += ` && (title match "*${search}*" || excerpt match "*${search}*")`
    }

    filterQuery += `]`

    // Get total count
    const allIds = await readOnlyClient.fetch<string[]>(
      `${filterQuery}._id`
    )
    const total = allIds.length

    // Get paginated results with projections
    const postsQuery = `${filterQuery} | order(publishedAt desc)[${skip}...${skip + limit}] {
      _id,
      title,
      slug,
      excerpt,
      category,
      publishedAt,
      "image": image.asset->url,
      author->{name, image},
      readingTime,
      "commentCount": count(comments)
    }`

    const posts = await readOnlyClient.fetch(postsQuery)

    return NextResponse.json(
      {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch blog posts'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
