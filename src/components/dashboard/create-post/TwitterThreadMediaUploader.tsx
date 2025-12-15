/**
 * TwitterThreadMediaUploader
 * Compact inline media uploader for individual thread tweets
 * Max 4 images per tweet
 */

import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, X, Loader2, RotateCcw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FileUploadState } from '@/hooks/useThreadMediaUpload'

const MAX_IMAGES = 4

interface TwitterThreadMediaUploaderProps {
  uploads: FileUploadState[]
  onAddFiles: (files: FileList) => void
  onRemove: (uploadId: string) => void
  onRetry: (uploadId: string) => void
  canAddMore: boolean
  className?: string
}

export function TwitterThreadMediaUploader({
  uploads,
  onAddFiles,
  onRemove,
  onRetry,
  canAddMore,
  className,
}: TwitterThreadMediaUploaderProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onAddFiles(e.target.files)
        // Reset input to allow selecting the same file again
        e.target.value = ''
      }
    },
    [onAddFiles]
  )

  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  if (uploads.length === 0 && canAddMore) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleAddClick}
          className="text-muted-foreground hover:text-foreground hover:bg-surface-elevated flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-colors"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          {t('dashboard.createPost.twitter.media.addMedia')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {uploads.map((upload) => (
        <div key={upload.id} className="relative h-12 w-12 shrink-0">
          {/* Thumbnail */}
          <div className="h-full w-full overflow-hidden rounded-lg">
            {upload.type === 'image' ? (
              <img src={upload.localUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <video src={upload.localUrl} className="h-full w-full object-cover" muted />
            )}
          </div>

          {/* Status overlay */}
          {upload.status === 'error' && (
            <div className="bg-destructive/80 absolute inset-0 flex items-center justify-center rounded-lg">
              <button
                type="button"
                onClick={() => onRetry(upload.id)}
                className="text-white transition-colors hover:text-white/80"
                title={t('dashboard.createPost.media.upload.retry')}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )}

          {['pending', 'requesting', 'uploading', 'confirming'].includes(upload.status) && (
            <div className="bg-background/60 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
              <Loader2 className="text-primary h-4 w-4 animate-spin" />
            </div>
          )}

          {upload.status === 'ready' && (
            <div className="bg-success absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full">
              <Check className="h-2.5 w-2.5 text-white" />
            </div>
          )}

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(upload.id)}
            className="bg-background/80 hover:bg-background absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full shadow-sm transition-colors"
            title={t('dashboard.createPost.twitter.media.removeMedia')}
          >
            <X className="text-foreground h-2.5 w-2.5" />
          </button>
        </div>
      ))}

      {/* Add more button */}
      {canAddMore && uploads.length > 0 && (
        <>
          <button
            type="button"
            onClick={handleAddClick}
            className="border-border-subtle hover:bg-surface-elevated flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed transition-colors"
            title={t('dashboard.createPost.twitter.media.addMedia')}
          >
            <ImagePlus className="text-muted-foreground h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}

      {/* File count indicator */}
      {uploads.length > 0 && (
        <span className="text-muted-foreground text-xs">
          {uploads.length}/{MAX_IMAGES}
        </span>
      )}
    </div>
  )
}
