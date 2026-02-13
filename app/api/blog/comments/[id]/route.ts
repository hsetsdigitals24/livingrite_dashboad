import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/blog/comments/[id]/approve
 * Approve a pending comment
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { action } = await req.json() // 'approve', 'reject', 'flag'

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    let updateData: Record<string, any> = {}

    if (action === 'approve') {
      updateData = { isApproved: true, flagged: false }
    } else if (action === 'reject') {
      updateData = { flagged: true, isApproved: false }
    } else if (action === 'flag') {
      updateData = { flagged: true }
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Update comment in Sanity
    const comment = await client
      .patch(id)
      .set(updateData)
      .commit()

    // Send approval email to commenter if approved
    if (action === 'approve') {
      try {
        await sendEmail({
          to: comment.email,
          subject: 'Your comment has been approved',
          template: 'comment-approved',
          data: {
            author: comment.author,
            content: comment.content,
          },
        })
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError)
      }
    }

    return NextResponse.json(
      { message: `Comment ${action}d successfully`, comment },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating comment:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to update comment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * DELETE /api/blog/comments/[id]
 * Delete a comment
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await client.delete(id)

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting comment:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to delete comment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
