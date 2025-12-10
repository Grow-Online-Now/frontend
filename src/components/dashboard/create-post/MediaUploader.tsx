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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70">
          <AlertCircle className="text-destructive h-6 w-6" />
          <span className="px-2 text-center text-xs text-white">
            {t('dashboard.createPost.media.upload.failed')}
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRetry(item.id)
              }}
              className="flex items-center gap-1 rounded-md bg-white/20 px-2 py-1 text-xs text-white transition-colors hover:bg-white/30"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <div className="w-3/4">
            <Progress value={uploadProgress} className="h-1.5 bg-white/20" />
          </div>
          <span className="text-xs font-medium text-white">
            {t('dashboard.createPost.media.upload.progress', { percentage: uploadProgress })}
          </span>
          {onCancelUpload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onCancelUpload(item.id)
              }}
              className="text-xs text-white/70 underline hover:text-white"
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
        <div className="absolute top-2 right-2">
          <div className="bg-success flex h-5 w-5 items-center justify-center rounded-full">
            <Check className="h-3 w-3 text-white" />
          </div>
        </div>
      )
    }

    return null
  }

  // Empty state
  if (media.length === 0) {
    return (
      <div className={cn('bg-card border-border-subtle rounded-xl border', className)}>
        <div
          className={cn(
            'm-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200',
            isDragging && 'border-primary bg-primary/5',
            isMediaRequired && !isDragging && 'border-warning/30 bg-warning/5',
            !isDragging && !isMediaRequired && 'hover:bg-surface-elevated border-transparent'
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
              'bg-surface-elevated mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
              isDragging && 'bg-primary/10 text-primary'
            )}
          >
            <Upload
              className={cn('h-6 w-6', isDragging ? 'text-primary' : 'text-muted-foreground')}
            />
          </div>

          <div className="mb-5 text-center">
            <p className="text-foreground mb-1 text-[15px] font-medium">
              {isMediaRequired
                ? t('dashboard.createPost.media.addRequired')
                : t('dashboard.createPost.media.addOptional')}
            </p>
            <p className="text-muted-foreground text-[13px]">
              {t('dashboard.createPost.media.dragHint')}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="bg-surface-elevated hover:bg-surface border-border-subtle flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors"
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
              className="bg-surface-elevated hover:bg-surface border-border-subtle flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors"
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
          <div className="border-border-subtle bg-surface-elevated flex items-center gap-2 border-t px-4 py-2.5">
            <AlertTriangle className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
            <span className="text-muted-foreground text-xs">{aspectRatioHint}</span>
          </div>
        )}
      </div>
    )
  }

  // With media
  return (
    <div className={cn('bg-card border-border-subtle rounded-xl border', className)}>
      <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((item) => (
          <div
            key={item.id}
            className={cn(
              'bg-muted group relative aspect-square overflow-hidden rounded-lg',
              item.uploadStatus === 'error' && 'ring-destructive ring-2 ring-offset-2'
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
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                {item.type === 'video' && item.duration && (
                  <span className="flex items-center gap-1 text-xs font-medium text-white">
                    <Play className="h-3 w-3" />
                    {formatDuration(item.duration)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-md bg-black/50 text-white transition-colors hover:bg-red-500"
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
                className="bg-destructive hover:bg-destructive/80 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors"
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
            className="border-border-muted text-muted-foreground hover:border-border hover:text-foreground flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all"
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
