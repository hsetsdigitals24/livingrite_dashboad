'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const CATEGORIES = [
  { id: 'all', label: 'All Articles', count: 24 },
  { id: 'post-acute', label: 'Post-Acute Care', count: 6 },
  { id: 'stroke', label: 'Stroke Recovery', count: 5 },
  { id: 'icu', label: 'ICU Recovery', count: 4 },
  { id: 'palliative', label: 'Palliative Care', count: 3 },
  { id: 'family', label: 'Family Caregiving', count: 4 },
  { id: 'wellness', label: 'Wellness Tips', count: 2 },
]

interface BlogFiltersProps {
  activeFilter: string
}

export default function BlogFilters({ activeFilter }: BlogFiltersProps) {
  return (
    <section className="py-6 border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const href = category.id === 'all' ? '/blogs' : `/blogs?category=${category.id}`
            return (
              <Link key={category.id} href={href}>
                <Button
                  variant={activeFilter === category.id ? 'default' : 'outline'}
                  className="group"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 group-hover:bg-primary/20">
                    {category.count}
                  </Badge>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
