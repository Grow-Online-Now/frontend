/**
 * AssetThumbnail Component
 * Draggable media asset thumbnail with status indicators
 */

import { useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { X, Check, AlertCircle, Loader2, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface AssetThumbnailProps {
  upload: FileUploadState
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

/**
 * Format duration in seconds to mm:ss
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function AssetThumbnail({ upload, onRemove, onRetry }: AssetThumbnailProps) {
  const { t } = useTranslation()
  const isUploading = ['requesting', 'uploading', 'confirming'].includes(upload.status)
  const isReady = upload.status === 'ready'
  const isError = upload.status === 'error'

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: upload.id,
    data: {
      type: 'asset',
      assetId: upload.id,
      mediaType: upload.type,
    },
    disabled: !isReady,
  })

  const style = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, isDragging]
  )

  // Get video duration if available (would need to be extracted from video metadata)
  const videoDuration = useMemo(() => {
    if (upload.type !== 'video') return null
    // Duration would need to be extracted from the video file
    // For now, we return null as MediaItem doesn't have duration
    return null
  }, [upload.type])

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'campaign-asset-thumb',
        'group relative aspect-square',
        isDragging && 'campaign-asset-thumb-dragging',
        isReady && 'cursor-grab active:cursor-grabbing',
        !isReady && 'cursor-default'
      )}
      role="button"
      aria-label={t('dashboard.campaign.media.asset.ariaLabel', {
        filename: upload.file.name,
      })}
      aria-disabled={!isReady}
    >
      {/* Thumbnail image */}
      <img
        src={upload.localUrl}
        alt={upload.file.name}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Video indicator */}
      {upload.type === 'video' && (
        <div className="absolute top-1.5 left-1.5">
          <Film className="h-3.5 w-3.5 text-white drop-shadow-md" />
        </div>
      )}

      {/* Video duration badge */}
      {videoDuration && (
        <div className="campaign-duration-badge">{formatDuration(videoDuration)}</div>
      )}

      {/* Upload progress overlay */}
      {isUploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/60">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
          <span className="mt-1 text-xs font-medium text-white">
            {Math.round(upload.progress.percentage)}%
          </span>
          {/* Progress bar */}
          <div className="absolute right-0 bottom-0 left-0 h-1 bg-white/20">
            <div
              className="bg-primary h-full transition-all duration-200"
              style={{ width: `${upload.progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Error overlay */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/60">
          <AlertCircle className="text-destructive h-5 w-5" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRetry(upload.id)
            }}
            className="mt-1 rounded text-xs text-white underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={t('dashboard.campaign.media.asset.retry')}
          >
            {t('dashboard.campaign.media.asset.retry')}
          </button>
        </div>
      )}

      {/* Success indicator */}
      {isReady && (
        <div className="bg-success absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Remove button (visible on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(upload.id)
        }}
        className={cn(
          'absolute top-1.5 right-1.5 h-5 w-5 rounded-full',
          'bg-black/60 hover:bg-black/80',
          'flex items-center justify-center',
          'opacity-0 transition-opacity group-hover:opacity-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
          isReady && 'group-hover:right-8'
        )}
        aria-label={t('dashboard.campaign.media.asset.remove')}
      >
        <X className="h-3 w-3 text-white" />
      </button>
    </div>
  )
}

/**
 * Drag overlay version of the thumbnail (shown while dragging)
 */
export function AssetThumbnailDragOverlay({ upload }: { upload: FileUploadState }) {
  return (
    <div className="campaign-asset-thumb ring-primary relative aspect-square h-20 w-20 shadow-xl ring-2">
      <img
        src={upload.localUrl}
        alt={upload.file.name}
        className="h-full w-full object-cover"
        draggable={false}
      />
      {upload.type === 'video' && (
        <div className="absolute top-1.5 left-1.5">
          <Film className="h-3.5 w-3.5 text-white drop-shadow-md" />
        </div>
      )}
    </div>
  )
}
