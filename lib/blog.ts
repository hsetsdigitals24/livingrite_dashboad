import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export interface BlogPost {
  _id: string
  slug: {
    current: string
  }
  title: string
  excerpt?: string
  category?: string
  publishedAt: string
  readingTime?: number
  author?: {
    name: string
    image?: {
      asset: {
        _id: string
      }
    }
  }
  image?: {
    asset: {
      _id: string
    }
  }
  body?: any[]
}

export interface BlogPostDisplay {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: number
  author?: {
    name: string
    image?: string
  }
  image: string | null
  content?: string
}

export async function getAllBlogPosts(): Promise<BlogPostDisplay[]> {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      excerpt,
      category,
      publishedAt,
      readingTime,
      author,
      image,
      "slug": slug
    }`
    
    const sanityPosts = await client.fetch<BlogPost[]>(query)
    
    if (sanityPosts && sanityPosts.length > 0) {
      return sanityPosts.map((p) => ({
        id: p._id,
        slug: p.slug.current,
        title: p.title,
        excerpt: p.excerpt || "",
        category: p.category || "Post-Acute Care",
        date: p.publishedAt || "",
        readingTime: p.readingTime || 5,
        author: p.author ? {
          name: p.author.name,
          image: p.author.image?.asset ? urlFor(p.author.image).width(100).height(100).url() : undefined,
        } : undefined,
        image: p.image?.asset ? urlFor(p.image).width(800).height(400).url() : null,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch posts from Sanity:', error)
  }

  // Fallback to local posts if Sanity fails
  return posts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDisplay | null> {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      excerpt,
      category,
      publishedAt,
      readingTime,
      author,
      body,
      image,
      "slug": slug.current
    }`
    
    const post = await client.fetch<BlogPost>(query, { slug })
    
    if (post) {
      return {
        id: post._id,
        slug: post.slug.current,
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category || "Post-Acute Care",
        date: post.publishedAt || "",
        readingTime: post.readingTime || 5,
        author: post.author ? {
          name: post.author.name,
          image: post.author.image?.asset ? urlFor(post.author.image).width(100).height(100).url() : undefined,
        } : undefined,
        image: post.image?.asset ? urlFor(post.image).width(800).height(400).url() : null,
        content: post.body ? parsePortableText(post.body) : "",
      }
    }
  } catch (error) {
    console.error('Failed to fetch post from Sanity:', error)
  }

  // Fallback to local posts
  return posts.find((p) => p.slug === slug) || null
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPostDisplay[]> {
  try {
    const categoryMap: { [key: string]: string } = {
      'post-acute': 'post-acute',
      'stroke': 'stroke',
      'icu': 'icu',
      'palliative': 'palliative',
      'family': 'family',
      'wellness': 'wellness',
    }

    const mappedCategory = categoryMap[category] || category

    const query = `*[_type == "post" && category == $category] | order(publishedAt desc){
      _id,
      title,
      excerpt,
      category,
      publishedAt,
      readingTime,
      author,
      image,
      "slug": slug.current
    }`
    
    const sanityPosts = await client.fetch<BlogPost[]>(query, { category: mappedCategory })
    
    if (sanityPosts && sanityPosts.length > 0) {
      return sanityPosts.map((p) => ({
        id: p._id,
        slug: p.slug.current,
        title: p.title,
        excerpt: p.excerpt || "",
        category: p.category || "Post-Acute Care",
        date: p.publishedAt || "",
        readingTime: p.readingTime || 5,
        author: p.author ? {
          name: p.author.name,
          image: p.author.image?.asset ? urlFor(p.author.image).width(100).height(100).url() : undefined,
        } : undefined,
        image: p.image?.asset ? urlFor(p.image).width(800).height(400).url() : null,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch posts by category from Sanity:', error)
  }

  // Fallback to local posts
  return posts.filter((p) => {
    const categoryMap: { [key: string]: string } = {
      'post-acute': 'Post-Acute Care',
      'stroke': 'Stroke Recovery',
      'icu': 'ICU Recovery',
      'palliative': 'Palliative Care',
      'family': 'Family Caregiving',
      'wellness': 'Wellness Tips',
    }
    return p.category === categoryMap[category]
  })
}

export const posts: BlogPostDisplay[] = [
  {
    id: '1',
    slug: "recovering-after-stroke",
    title: "Recovering After Stroke: A Practical Family Guide",
    excerpt: "Practical steps families can take to support stroke recovery at home.",
    category: "Stroke Recovery",
    date: "2025-11-12",
    readingTime: 8,
    image: "/blog/stroke-guide.jpg",
    content:
      `<p>Stroke recovery is a journey. This guide covers early mobilisation, goal-based physiotherapy, medication adherence, and caregiver coaching. Start with small, measurable goals and work closely with your clinician.</p><p>Weekly progress tracking and family training significantly improve outcomes. We recommend establishing a daily routine that includes therapy exercises, safe transfers and graded activity to rebuild confidence and endurance.</p>`,
  },
  {
    id: '2',
    slug: "post-icu-to-home",
    title: "From ICU to Home: What Families Need to Know",
    excerpt: "Planning the transition from hospital to home after an ICU stay.",
    category: "ICU Recovery",
    date: "2025-10-05",
    readingTime: 6,
    image: "/blog/post-icu.jpg",
    content:
      `<p>Transitioning from ICU to home requires clinical coordination, equipment setup and caregiver training. Early planning reduces readmissions and supports safe recovery.</p>`,
  },
  {
    id: '3',
    slug: "physiotherapy-benefits",
    title: "How Home Physiotherapy Accelerates Recovery",
    excerpt: "Why home-based physiotherapy can be more effective than clinic-only care.",
    category: "Post-Acute Care",
    date: "2025-09-20",
    readingTime: 7,
    image: "/blog/physio.jpg",
    content: `<p>Home physiotherapy helps clinicians tailor exercises to real-world tasks like climbing stairs, bathing and standing transfers. Real environment practice builds confidence faster.</p>`,
  },
  {
    id: '4',
    slug: "caregiver-checklist",
    title: "Family Caregiver Checklist: First 30 Days",
    excerpt: "A concise checklist for family caregivers supporting a loved one at home.",
    category: "Family Caregiving",
    date: "2025-08-15",
    readingTime: 5,
    image: "/blog/caregiver.jpg",
    content: `<p>This checklist covers medication schedules, emergency plans, safe transfer techniques, and when to call your clinician.</p>`,
  },
  {
    id: '5',
    slug: "end-of-life-compassion",
    title: "Compassionate End-of-Life Care at Home",
    excerpt: "How to provide comfort-focused care with dignity and support.",
    category: "Palliative Care",
    date: "2025-07-30",
    readingTime: 9,
    image: "/blog/compassion.jpg",
    content: `<p>Palliative care focuses on comfort, symptom management and family support. Home care allows for a peaceful, familiar environment during this important time.</p>`,
  },
]

export async function getPostBySlug(slug: string): Promise<BlogPostDisplay | null> {
  return getBlogPostBySlug(slug)
}

export async function getPaginatedPosts(page = 1, perPage = 4): Promise<{ items: BlogPostDisplay[]; total: number; totalPages: number }> {
  const allPosts = await getAllBlogPosts()
  const total = allPosts.length
  const start = (page - 1) * perPage
  const items = allPosts.slice(start, start + perPage)
  const totalPages = Math.ceil(total / perPage)
  return { items, total, totalPages }
}

function parsePortableText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return ""
  
  return blocks
    .map((block) => {
      if (block._type === "block" && block.children) {
        return block.children.map((child: any) => child.text || "").join("")
      }
      return ""
    })
    .join("\n")
}

export default posts
