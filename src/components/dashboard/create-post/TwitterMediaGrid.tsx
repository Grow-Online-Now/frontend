/**
 * TwitterMediaGrid Component
 * Renders media in Twitter's authentic grid layouts (1-4 media items)
 */

import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaFile } from './MediaUploader'

interface TwitterMediaGridProps {
  media: MediaFile[]
  maxDisplay?: number
}

/**
 * Get corner radius classes based on position in grid
 */
function getCornerClasses(index: number, total: number): string {
  if (total === 1) return 'rounded-2xl'

  if (total === 2) {
    return index === 0 ? 'rounded-l-2xl' : 'rounded-r-2xl'
  }

  if (total === 3) {
    if (index === 0) return 'rounded-l-2xl'
    if (index === 1) return 'rounded-tr-2xl'
    return 'rounded-br-2xl'
  }

  if (total === 4) {
    if (index === 0) return 'rounded-tl-2xl'
    if (index === 1) return 'rounded-tr-2xl'
    if (index === 2) return 'rounded-bl-2xl'
    return 'rounded-br-2xl'
  }

  return ''
}

/**
 * Single media item with video play overlay
 */
function MediaItem({ media, className }: { media: MediaFile; className?: string }) {
  const isVideo = media.type === 'video'

  return (
    <div className={cn('bg-twitter-bg-hover relative overflow-hidden', className)}>
      {isVideo ? (
        <>
          <video src={media.url} className="h-full w-full object-cover" muted playsInline />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-twitter-blue/90 flex h-14 w-14 items-center justify-center rounded-full shadow-lg">
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

export function TwitterMediaGrid({ media, maxDisplay = 4 }: TwitterMediaGridProps) {
  const displayMedia = media.slice(0, maxDisplay)
  const count = displayMedia.length

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
      <div className="mt-3 grid grid-cols-2 gap-0.5 overflow-hidden rounded-2xl">
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
      <div className="mt-3 grid grid-cols-2 gap-0.5 overflow-hidden rounded-2xl">
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

  // 4 images - 2x2 grid
  return (
    <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl">
      {displayMedia.map((item, index) => (
        <MediaItem
          key={item.id}
          media={item}
          className={cn('aspect-video', getCornerClasses(index, 4))}
        />
      ))}
    </div>
  )
}
