'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AuthorCardProps {
  author: {
    name: string
    slug: string
    bio: string
    image?: string
    credentials?: string[]
    yearsOfExperience?: number
    socialLinks?: {
      linkedin?: string
      twitter?: string
      email?: string
    }
  }
  articleCount?: number
}

export default function AuthorCard({
  author,
  articleCount = 0,
}: AuthorCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {author.image && (
            <div className="flex-shrink-0">
              <img
                src={author.image}
                alt={author.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
          )}

          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{author.name}</h3>
              {author.credentials && author.credentials.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {author.credentials[0]}
                </Badge>
              )}
            </div>

            {author.yearsOfExperience && (
              <p className="text-sm text-gray-600 mb-2">
                {author.yearsOfExperience}+ years of experience
              </p>
            )}

            <p className="text-gray-600 text-sm mb-4">{author.bio}</p>

            <div className="flex flex-wrap gap-3">
              {author.socialLinks?.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {author.socialLinks?.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Twitter
                </a>
              )}
              {author.socialLinks?.email && (
                <a
                  href={`mailto:${author.socialLinks.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  Email
                </a>
              )}
              {articleCount > 0 && (
                <Link href={`/blogs/author/${author.slug}`} className="text-sm text-primary hover:underline">
                  View all articles ({articleCount})
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
