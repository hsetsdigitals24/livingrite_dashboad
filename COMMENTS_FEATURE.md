# Blog Commenting Feature

## Overview

The blog commenting feature allows users to submit comments on blog posts with admin moderation. All comments go through an approval workflow before being displayed publicly.

## Features

- **Comment Submission**: Users can submit comments with name, email, and content
- **Admin Moderation**: Approve, reject, or flag comments for review
- **Email Notifications**: Admin receives notification of new comments, commenter receives notification when approved
- **Spam Protection**: Input validation, character limits, and flagging system
- **Verification Badges**: Verified commenters get a badge
- **Like Tracking**: Comments track like counts

## Architecture

### Database Schema (Sanity)

Comment type with fields:
- `post` - Reference to blog post
- `author` - Commenter's name (string, required)
- `email` - Commenter's email (string, required, validated)
- `content` - Comment text (text, 10-5000 chars, required)
- `timestamp` - Auto-generated creation time (datetime)
- `isApproved` - Admin approval status (boolean, default: false)
- `isVerified` - Credible commenter badge (boolean, default: false)
- `flagged` - Flagged for review (boolean, default: false)
- `likes` - Like counter (number, default: 0)

### API Routes

#### `POST /api/blog/comments`
**Submit a new comment**

Request:
```json
{
  "postId": "post-document-id",
  "author": "John Doe",
  "email": "john@example.com",
  "content": "Great article!"
}
```

Response (201):
```json
{
  "message": "Comment submitted successfully and is awaiting approval",
  "commentId": "comment-doc-id"
}
```

#### `GET /api/blog/comments?postId=ID&status=pending`
**Fetch comments for a post**

Query Parameters:
- `postId` (required) - Blog post document ID
- `status` (optional) - 'pending' (default), 'approved', or 'flagged'

Response:
```json
{
  "comments": [
    {
      "_id": "comment-id",
      "author": "John Doe",
      "email": "john@example.com",
      "content": "Great article!",
      "timestamp": "2025-02-13T22:00:00Z",
      "likes": 5,
      "isVerified": false,
      "isApproved": false,
      "flagged": false
    }
  ]
}
```

#### `PATCH /api/blog/comments/[id]`
**Approve, reject, or flag a comment**

Request:
```json
{
  "action": "approve" // or "reject", "flag"
}
```

Response:
```json
{
  "message": "Comment approved successfully",
  "comment": { ... }
}
```

#### `DELETE /api/blog/comments/[id]`
**Delete a comment**

Response:
```json
{
  "message": "Comment deleted successfully"
}
```

## Components

### `CommentForm`
Displays the comment submission form on blog posts.

```tsx
<CommentForm 
  postId={post._id} 
  onCommentSubmitted={() => refetchComments()}
/>
```

Props:
- `postId` (required) - The blog post ID to comment on
- `onCommentSubmitted` (optional) - Callback when comment is successfully submitted

### `CommentModeration`
Admin dashboard for moderating comments.

```tsx
<CommentModeration 
  postId={post._id}
  postTitle={post.title}
/>
```

Props:
- `postId` (required) - Blog post ID to moderate comments for
- `postTitle` (required) - Blog post title for display

## Usage

### For Users

1. Scroll to the comment form on any blog post
2. Enter name, email, and comment
3. Click "Submit Comment"
4. Comment appears pending admin approval
5. User receives email notification when approved

### For Admins

1. Navigate to Admin Dashboard → Comment Moderation
2. Review pending comments
3. Click "Approve" to publish or "Reject" to decline
4. Switch to "Flagged" or "Approved" tabs to manage moderation history
5. Delete comments as needed

## Configuration

### Environment Variables

Add to `.env.local`:

```
ADMIN_EMAIL=admin@livingrite.com
```

### Email Templates

Two email templates are used:

1. **new-comment** - Sent to admin when new comment is submitted
   - Variables: `author`, `email`, `content`, `postId`, `commentId`

2. **comment-approved** - Sent to commenter when comment is approved
   - Variables: `author`, `content`

Ensure these templates exist in your email service configuration.

## Validation Rules

- **Author name**: 2-100 characters
- **Email**: Valid email format
- **Content**: 10-5000 characters
- All fields required

## Security Considerations

1. **Input Validation**: All fields validated server-side
2. **Email Verification**: Email format checked
3. **Moderation Queue**: Comments default to unapproved state
4. **Spam Flagging**: Comments can be flagged for review
5. **Verified Badge**: Only trusted commenters get badge (set manually by admin)

## Future Enhancements

- [ ] Rate limiting per IP/email
- [ ] CAPTCHA verification
- [ ] Comment threading/nested replies
- [ ] Bulk moderation actions
- [ ] Comment edit history
- [ ] Profanity filtering
- [ ] Automated spam detection
- [ ] Dashboard statistics/analytics

## Troubleshooting

**Comments not appearing after approval?**
- Check that `isApproved` is set to `true` in Sanity
- Verify the blog post detail page is fetching approved comments only

**Email notifications not sent?**
- Verify `ADMIN_EMAIL` environment variable is set
- Check email service configuration and API credentials
- Review server logs for email service errors

**Form submission failing?**
- Check browser console for validation errors
- Verify all required fields are filled
- Check network tab for API response details
