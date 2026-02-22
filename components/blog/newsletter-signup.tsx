'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

interface NewsletterSignupProps {
  className?: string
}

export default function NewsletterSignup({ className = '' }: NewsletterSignupProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Newsletter signup logic would go here
    // For now, just reset the form
    const form = e.currentTarget
    form.reset()
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">
                <Mail className="w-3 h-3 mr-1" />
                Weekly Newsletter
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Get Weekly Care Tips & Insights
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to receive our latest articles on post-acute care, recovery strategies, and family caregiving delivered directly to your inbox. Join 5,000+ healthcare professionals and families.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  type="submit"
                  className="whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-3">
                No spam. Unsubscribe anytime. By subscribing, you agree to our{' '}
                <Link href="#" className="text-primary hover:underline">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
