/**
 * LinkedInMediaGrid Component
 * Renders media in LinkedIn's authentic grid layouts (1-4+ media items)
 */

import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaFile } from './MediaUploader'

interface LinkedInMediaGridProps {
  media: MediaFile[]
  maxDisplay?: number
}

/**
 * Get corner radius classes based on position in grid
 * LinkedIn uses slightly less rounded corners than Twitter
 */
function getCornerClasses(index: number, total: number): string {
  if (total === 1) return 'rounded-lg'

  if (total === 2) {
    return index === 0 ? 'rounded-l-lg' : 'rounded-r-lg'
  }

  if (total === 3) {
    if (index === 0) return 'rounded-l-lg'
    if (index === 1) return 'rounded-tr-lg'
    return 'rounded-br-lg'
  }

  if (total === 4) {
    if (index === 0) return 'rounded-tl-lg'
    if (index === 1) return 'rounded-tr-lg'
    if (index === 2) return 'rounded-bl-lg'
    return 'rounded-br-lg'
  }

  return ''
}

/**
 * Single media item with video play overlay
 */
function MediaItem({ media, className }: { media: MediaFile; className?: string }) {
  const isVideo = media.type === 'video'

  return (
    <div className={cn('bg-linkedin-bg-hover relative overflow-hidden', className)}>
      {isVideo ? (
        <>
          <video src={media.url} className="h-full w-full object-cover" muted playsInline />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-linkedin-blue/90 flex h-14 w-14 items-center justify-center rounded-full shadow-lg">
              <Play className="h-7 w-7 fill-white text-white" />
            </div>
          </div>
          {/* Duration badge */}
          {media.duration && (
            <div className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
              {formatDuration(media.duration)}
            </div>
          )}
        </>
      ) : (
        <img src={media.url} alt="" className="h-full w-full object-cover" loading="lazy" />
      )}
    </div>
  )
}

/**
 * Format video duration in MM:SS or HH:MM:SS
 */
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function LinkedInMediaGrid({ media, maxDisplay = 4 }: LinkedInMediaGridProps) {
  const displayMedia = media.slice(0, maxDisplay)
  const count = displayMedia.length
  const remainingCount = media.length - maxDisplay

  if (count === 0) return null

  // Single media - full width, aspect-video
  if (count === 1) {
    return (
      <div className="mt-3">
        <MediaItem media={displayMedia[0]} className={cn('aspect-video', getCornerClasses(0, 1))} />
      </div>
    )
  }

  // 2 images - side by side
  if (count === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 overflow-hidden rounded-lg">
        {displayMedia.map((item, index) => (
          <MediaItem
            key={item.id}
            media={item}
            className={cn('aspect-square', getCornerClasses(index, 2))}
          />
        ))}
      </div>
    )
  }

  // 3 images - left tall + 2 stacked right
  if (count === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 overflow-hidden rounded-lg">
        {/* Left - spans 2 rows */}
        <MediaItem
          media={displayMedia[0]}
          className={cn('row-span-2 aspect-[9/16]', getCornerClasses(0, 3))}
        />
        {/* Top right */}
        <MediaItem media={displayMedia[1]} className={cn('aspect-video', getCornerClasses(1, 3))} />
        {/* Bottom right */}
        <MediaItem media={displayMedia[2]} className={cn('aspect-video', getCornerClasses(2, 3))} />
      </div>
    )
  }

  // 4+ images - 2x2 grid with optional overlay for more
  return (
    <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-lg">
      {displayMedia.map((item, index) => (
        <div key={item.id} className="relative">
          <MediaItem media={item} className={cn('aspect-video', getCornerClasses(index, 4))} />
          {/* Show remaining count on last item */}
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-2xl font-semibold text-white">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
