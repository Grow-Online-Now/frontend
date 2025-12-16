/**
 * MediaPreviewGrid Component
 * Grid of media thumbnails with upload progress, error states, and remove functionality
 * Layout: 1 image = full width 16:9, 2+ = 2 columns, max 4 visible
 */

import { useTranslation } from 'react-i18next'
import { X, Play, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface MediaPreviewGridProps {
  media: FileUploadState[]
  onRemove: (id: string) => void
  onRetry?: (id: string) => void
  maxVisible?: number
  /** Display variant: 'default' for full-width grid, 'compact' for small horizontal thumbnails */
  variant?: 'default' | 'compact'
  className?: string
}

export function MediaPreviewGrid({
  media,
  onRemove,
  onRetry,
  maxVisible = 4,
  variant = 'default',
  className,
}: MediaPreviewGridProps) {
  const { t } = useTranslation()

  if (media.length === 0) return null

  const isUploading = (status: string) =>
    ['pending', 'requesting', 'uploading', 'confirming'].includes(status)

  const visibleMedia = media.slice(0, maxVisible)
  const hiddenCount = media.length - maxVisible

  // Compact variant: small horizontal thumbnails (ChatGPT/Claude style)
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {visibleMedia.map((item, index) => {
          const isLastVisible = index === maxVisible - 1 && hiddenCount > 0

          return (
            <div key={item.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              {/* Media preview */}
              {item.type === 'image' ? (
                <img src={item.localUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="relative h-full w-full">
                  <video src={item.localUrl} className="h-full w-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60">
                      <Play className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Upload overlay */}
              {isUploading(item.status) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span className="font-mono text-[10px] text-white">
                    {Math.round(item.progress.percentage)}%
                  </span>
                </div>
              )}

              {/* Error overlay */}
              {item.status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <AlertCircle className="text-error h-4 w-4" />
                  {onRetry && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRetry(item.id)
                      }}
                      className="mt-1 text-[10px] text-white/70 hover:text-white"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {/* "+X more" overlay */}
              {isLastVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-sm font-semibold text-white">+{hiddenCount}</span>
                </div>
              )}

              {/* Remove button - smaller for compact */}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className={cn(
                  'absolute top-1 right-1',
                  'flex h-5 w-5 items-center justify-center rounded-full',
                  'bg-black/60 backdrop-blur-sm',
                  'text-white/80 hover:bg-black/80 hover:text-white',
                  'transition-all duration-150'
                )}
                aria-label={t('common.actions.remove')}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  // Default variant: Single image = full width, 2+ = grid
  const isSingleImage = media.length === 1

  return (
    <div className={cn(isSingleImage ? '' : 'grid grid-cols-2 gap-2', className)}>
      {visibleMedia.map((item, index) => {
        const isLastVisible = index === maxVisible - 1 && hiddenCount > 0

        return (
          <div
            key={item.id}
            className={cn(
              'relative overflow-hidden rounded-lg',
              isSingleImage ? 'aspect-video w-full' : 'aspect-square'
            )}
          >
            {/* Media preview */}
            {item.type === 'image' ? (
              <img src={item.localUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full">
                <video src={item.localUrl} className="h-full w-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Upload overlay */}
            {isUploading(item.status) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
                <div className="w-20">
                  <Progress value={item.progress.percentage} className="h-1" />
                </div>
                <span className="font-mono text-xs text-white">
                  {Math.round(item.progress.percentage)}%
                </span>
              </div>
            )}

            {/* Error overlay */}
            {item.status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-2">
                <AlertCircle className="text-error h-6 w-6" />
                <span className="text-error text-center text-xs">
                  {t('dashboard.createPost.media.upload.failed')}
                </span>
                {onRetry && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRetry(item.id)
                    }}
                    className="flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3" />
                    {t('dashboard.createPost.media.upload.retry')}
                  </button>
                )}
              </div>
            )}

            {/* "+X more" overlay on last visible item */}
            {isLastVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <span className="text-lg font-semibold text-white">+{hiddenCount}</span>
              </div>
            )}

            {/* Remove button - circular with blur backdrop */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className={cn(
                'absolute top-2 right-2',
                'flex h-7 w-7 items-center justify-center rounded-full',
                'bg-black/60 backdrop-blur-sm',
                'text-white/80 hover:bg-black/80 hover:text-white',
                'transition-all duration-150'
              )}
              aria-label={t('common.actions.remove')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
