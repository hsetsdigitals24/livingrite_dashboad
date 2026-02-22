'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url?: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : url || ''

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-900 font-medium flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share Article:
      </span>
      <Button
        variant="outline"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
            '_blank'
          )
        }
      >
        Twitter
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
            '_blank'
          )
        }
      >
        Facebook
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: title,
              url: currentUrl,
            })
          }
        }}
      >
        Share
      </Button>
    </div>
  )
}
