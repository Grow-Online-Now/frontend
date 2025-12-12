/**
 * MediaGridSkeleton Component
 * Loading skeleton for media grid
 */

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface MediaGridSkeletonProps {
  count?: number
  className?: string
}

export function MediaGridSkeleton({ count = 12, className }: MediaGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-xl" />
      ))}
    </div>
  )
}
