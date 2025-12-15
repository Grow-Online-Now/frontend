/**
 * MediaUploader Component
 * Drag and drop media upload with preview and upload progress
 */

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Upload,
  Image,
  Video,
  X,
  Play,
  Plus,
  AlertTriangle,
  Loader2,
  Check,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import type { MediaUploadStatus } from '@/types/media'

export interface MediaFile {
  id: string
  file: File
  url: string
  type: 'image' | 'video'
  width?: number
  height?: number
  duration?: number
  aspectRatio?: string
  // Upload state fields
  uploadStatus?: MediaUploadStatus
  uploadProgress?: number
  uploadError?: string | null
  mediaId?: string | null
  remoteUrl?: string | null
}

interface MediaUploaderProps {
  media: MediaFile[]
  onUpload: (files: FileList) => void
  onRemove: (id: string) => void
  onRetry?: (id: string) => void
  onCancelUpload?: (id: string) => void
  maxFiles?: number
  acceptedTypes?: string
  aspectRatioHint?: string
  isMediaRequired?: boolean
  className?: string
}

export function MediaUploader({
  media,
  onUpload,
  onRemove,
  onRetry,
  onCancelUpload,
  maxFiles = 10,
  acceptedTypes = 'image/jpeg,image/png,image/gif,video/mp4,video/webm',
  aspectRatioHint,
  isMediaRequired = false,
  className,
}: MediaUploaderProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const canAddMore = media.length < maxFiles

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        onUpload(e.dataTransfer.files)
      }
    },
    [onUpload]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onUpload(e.target.files)
        // Reset input so same file can be selected again
        e.target.value = ''
      }
    },
    [onUpload]
  )

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Check if an upload is in progress
   */
  const isUploadInProgress = (status?: MediaUploadStatus) => {
    return status && ['pending', 'requesting', 'uploading', 'confirming'].includes(status)
  }

  /**
   * Render upload status overlay
   */
  const renderUploadOverlay = (item: MediaFile) => {
    const { uploadStatus, uploadProgress = 0 } = item

    // Error state
    if (uploadStatus === 'error') {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <span className="px-2 text-center text-xs text-foreground">
            {t('dashboard.createPost.media.upload.failed')}
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRetry(item.id)
              }}
              className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent"
            >
              <RefreshCw className="h-3 w-3" />
              {t('dashboard.createPost.media.upload.retry')}
            </button>
          )}
        </div>
      )
    }

    // Uploading state
    if (isUploadInProgress(uploadStatus)) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80">
          <Loader2 className="h-6 w-6 animate-spin text-foreground" />
          <div className="w-3/4">
            <Progress value={uploadProgress} className="h-1.5 bg-muted" />
          </div>
          <span className="text-xs font-medium text-foreground">
            {t('dashboard.createPost.media.upload.progress', { percentage: uploadProgress })}
          </span>
          {onCancelUpload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onCancelUpload(item.id)
              }}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              {t('dashboard.createPost.media.upload.cancel')}
            </button>
          )}
        </div>
      )
    }

    // Ready state - show subtle checkmark
    if (uploadStatus === 'ready') {
      return (
        <div className="absolute right-2 top-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
            <Check className="h-3 w-3 text-success-foreground" />
          </div>
        </div>
      )
    }

    return null
  }

  // Empty state
  if (media.length === 0) {
    return (
      <div className={cn('rounded-xl border border-border-subtle bg-card', className)}>
        <div
          className={cn(
            'm-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200',
            isDragging && 'border-primary bg-primary/5',
            isMediaRequired && !isDragging && 'border-warning/30 bg-warning/5',
            !isDragging && !isMediaRequired && 'border-transparent hover:bg-surface-elevated'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            multiple
            hidden
            onChange={handleFileSelect}
          />

          <div
            className={cn(
              'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated transition-colors',
              isDragging && 'bg-primary/10 text-primary'
            )}
          >
            <Upload
              className={cn('h-6 w-6', isDragging ? 'text-primary' : 'text-muted-foreground')}
            />
          </div>

          <div className="mb-5 text-center">
            <p className="mb-1 text-base font-medium text-foreground">
              {isMediaRequired
                ? t('dashboard.createPost.media.addRequired')
                : t('dashboard.createPost.media.addOptional')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.createPost.media.dragHint')}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <Image className="h-4 w-4" />
              {t('dashboard.createPost.media.photo')}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <Video className="h-4 w-4" />
              {t('dashboard.createPost.media.video')}
            </button>
          </div>
        </div>

        {aspectRatioHint && (
          <div className="flex items-center gap-2 border-t border-border-subtle bg-surface-elevated px-4 py-2.5">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{aspectRatioHint}</span>
          </div>
        )}
      </div>
    )
  }

  // With media
  return (
    <div className={cn('rounded-xl border border-border-subtle bg-card', className)}>
      <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <div
            key={item.id}
            className={cn(
              'group relative aspect-square overflow-hidden rounded-lg bg-muted',
              item.uploadStatus === 'error' && 'ring-2 ring-destructive ring-offset-2'
            )}
          >
            {item.type === 'video' ? (
              <video src={item.url} className="h-full w-full object-cover" />
            ) : (
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            )}

            {/* Upload status overlay */}
            {renderUploadOverlay(item)}

            {/* Hover overlay (only show when not uploading) */}
            {!isUploadInProgress(item.uploadStatus) && item.uploadStatus !== 'error' && (
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-background/80 via-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                {item.type === 'video' && item.duration && (
                  <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                    <Play className="h-3 w-3" />
                    {formatDuration(item.duration)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Remove button for error state - always visible */}
            {item.uploadStatus === 'error' && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {/* Add more button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-muted text-muted-foreground transition-all hover:border-border hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs font-medium">{t('dashboard.createPost.media.addMore')}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple
        hidden
        onChange={handleFileSelect}
      />
    </div>
  )
}
