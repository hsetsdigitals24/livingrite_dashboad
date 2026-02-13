import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

interface CommentPayload {
  postId: string 
  author: string
  email: string
  content: string
}

/**
 * POST /api/blog/comments
 * Submit a new comment on a blog post
 * Comment starts in unapproved state and requires admin approval
 */
export async function POST(req: NextRequest) {
  try {
    const body: CommentPayload = await req.json()

    // Validate required fields
    if (!body.postId || !body.author || !body.email || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate content length
    if (body.content.trim().length < 10 || body.content.length > 5000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 5000 characters' },
        { status: 400 }
      )
    }

    // Validate author name length
    if (body.author.trim().length < 2 || body.author.length > 100) {
      return NextResponse.json(
        { error: 'Author name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    // Create comment document in Sanity
    const comment = await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: body.postId,
      },
      author: body.author,
      email: body.email,
      content: body.content.trim(),
      isApproved: false,
      isVerified: false,
      flagged: false,
      likes: 0,
      timestamp: new Date().toISOString(),
    })

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@livingrite.com'
    try {
      await sendEmail({
        to: adminEmail,
        subject: 'New blog comment awaiting approval',
        template: 'new-comment',
        data: {
          author: body.author,
          email: body.email,
          content: body.content,
          postId: body.postId,
          commentId: comment._id,
        },
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Comment submitted successfully and is awaiting approval',
        commentId: comment._id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting comment:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to submit comment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/blog/comments
 * Fetch pending comments for a specific post (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('postId')
    const status = req.nextUrl.searchParams.get('status') || 'pending' // pending, approved, flagged

    if (!postId) {
      return NextResponse.json(
        { error: 'postId query parameter is required' },
        { status: 400 }
      )
    }

    let query = `*[_type == "comment" && post._ref == "${postId}"`

    if (status === 'pending') {
      query += ` && isApproved == false && flagged == false`
    } else if (status === 'approved') {
      query += ` && isApproved == true`
    } else if (status === 'flagged') {
      query += ` && flagged == true`
    }

    query += `] | order(timestamp desc) { _id, author, email, content, timestamp, likes, isVerified, isApproved, flagged }`

    const comments = await client.fetch(query)

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch comments'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
