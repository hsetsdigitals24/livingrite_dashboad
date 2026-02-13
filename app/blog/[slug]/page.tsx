import { PostDetail } from '@/components/blog/PostDetail'
import { Metadata } from 'next'

interface PageParams {
  slug: string
}

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog/posts/${slug}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export async function generateMetadata(
  { params }: { params: PageParams }
): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : [],
    },
  }
}

export default async function PostPage({ params }: { params: PageParams }) {
  const post = await getPost(params.slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Post not found
          </h1>
          <p className="mb-6 text-gray-600">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/blog"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Back to Blog
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <a
          href="/blog"
          className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          ← Back to Blog
        </a>
        <PostDetail post={post} />
      </div>
    </main>
  )
}
