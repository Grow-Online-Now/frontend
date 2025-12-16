/**
 * FacebookMediaGrid Component
 * Renders media in Facebook's authentic grid layouts (1-5+ media items)
 */

import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaFile } from './MediaUploader'

interface FacebookMediaGridProps {
  media: MediaFile[]
  maxDisplay?: number
}

/**
 * Single media item with video play overlay
 */
function MediaItem({ media, className }: { media: MediaFile; className?: string }) {
  const isVideo = media.type === 'video'

  return (
    <div className={cn('bg-facebook-bg-hover relative overflow-hidden', className)}>
      {isVideo ? (
        <>
          <video src={media.url} className="h-full w-full object-cover" muted playsInline />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 shadow-lg">
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

export function FacebookMediaGrid({ media, maxDisplay = 5 }: FacebookMediaGridProps) {
  const displayMedia = media.slice(0, maxDisplay)
  const count = displayMedia.length
  const remainingCount = media.length - maxDisplay

  if (count === 0) return null

  // Single media - full width, aspect-video
  if (count === 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-lg">
        <MediaItem media={displayMedia[0]} className="aspect-video" />
      </div>
    )
  }

  // 2 images - side by side
  if (count === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-lg">
        {displayMedia.map((item) => (
          <MediaItem key={item.id} media={item} className="aspect-square" />
        ))}
      </div>
    )
  }

  // 3 images - one large left, two stacked right
  if (count === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-lg">
        <MediaItem media={displayMedia[0]} className="row-span-2 aspect-[9/16]" />
        <MediaItem media={displayMedia[1]} className="aspect-video" />
        <MediaItem media={displayMedia[2]} className="aspect-video" />
      </div>
    )
  }

  // 4 images - one large top, three below
  if (count === 4) {
    return (
      <div className="mt-3 flex flex-col gap-1 overflow-hidden rounded-lg">
        <MediaItem media={displayMedia[0]} className="aspect-video" />
        <div className="grid grid-cols-3 gap-1">
          {displayMedia.slice(1).map((item) => (
            <MediaItem key={item.id} media={item} className="aspect-square" />
          ))}
        </div>
      </div>
    )
  }

  // 5+ images - one large top, four below with optional overlay
  return (
    <div className="mt-3 flex flex-col gap-1 overflow-hidden rounded-lg">
      <MediaItem media={displayMedia[0]} className="aspect-video" />
      <div className="grid grid-cols-4 gap-1">
        {displayMedia.slice(1, 5).map((item, idx) => (
          <div key={item.id} className="relative">
            <MediaItem media={item} className="aspect-square" />
            {idx === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-xl font-semibold text-white">+{remainingCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
