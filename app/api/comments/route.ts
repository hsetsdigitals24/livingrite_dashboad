import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

interface CommentData {
  _id: string
  author: string
  email: string
  content: string
  timestamp: string
  likes: number
  isVerified: boolean
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const postId = searchParams.get('postId')

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    // Query all comments for this post from Sanity
    const comments = await client.fetch(
      `*[_type == "comment" && post._ref == $postId] | order(timestamp desc) {
        _id,
        author,
        email,
        content,
        timestamp,
        likes,
        isVerified
      }`,
      { postId }
    )

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, author, email, content } = body

    if (!postId || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate content length
    if (content.trim().length < 10 || content.trim().length > 5000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 5000 characters' },
        { status: 400 }
      )
    }

    // Create comment document in Sanity
    const newComment = await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: postId,
      },
      author: author.trim(),
      email: email.toLowerCase(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      isVerified: false,
    })

    // Also add the comment reference to the post's comments array
    await client.patch(postId).append('comments', [
      {
        _type: 'reference',
        _ref: newComment._id,
      },
    ]).commit()

    return NextResponse.json({
      success: true,
      message: 'Comment posted successfully!',
      comment: {
        _id: newComment._id,
        author: newComment.author,
        email: newComment.email,
        content: newComment.content,
        timestamp: newComment.timestamp,
        likes: newComment.likes,
        isVerified: newComment.isVerified,
      },
    })
  } catch (error) {
    console.error('Error submitting comment:', error)
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    )
  }
}

// PUT endpoint to like/unlike a comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, action } = body // action: 'like' or 'unlike'

    if (!commentId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current comment
    const comment = await client.fetch(
      `*[_type == "comment" && _id == $commentId][0]`,
      { commentId }
    )

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Update likes
    const currentLikes = comment.likes || 0
    const newLikes = action === 'like' ? currentLikes + 1 : Math.max(0, currentLikes - 1)

    const updatedComment = await client
      .patch(commentId)
      .set({ likes: newLikes })
      .commit()

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// PATCH endpoint to flag a comment
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, action } = body // action: 'flag'

    if (!commentId || action !== 'flag') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Check if comment exists
    const comment = await client.fetch(
      `*[_type == "comment" && _id == $commentId][0]`,
      { commentId }
    )

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Flag the comment
    const flaggedComment = await client
      .patch(commentId)
      .set({ flagged: true })
      .commit()

    return NextResponse.json({
      success: true,
      message: 'Comment flagged successfully',
      comment: flaggedComment,
    })
  } catch (error) {
    console.error('Error flagging comment:', error)
    return NextResponse.json(
      { error: 'Failed to flag comment' },
      { status: 500 }
    )
  }
}

