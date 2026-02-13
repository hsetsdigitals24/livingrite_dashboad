import { NextRequest, NextResponse } from 'next/server'
import { readOnlyClient } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

/**
 * GET /api/blog/categories
 * Fetch all available blog categories
 */
export async function GET(req: NextRequest) {
  try {
    const query = `array::unique(*[_type == "post"].category) | order(@)`

    const categories = await readOnlyClient.fetch<string[]>(query)

    return NextResponse.json(
      { categories: categories || [] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch blog categories'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
