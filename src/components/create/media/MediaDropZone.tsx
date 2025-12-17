/**
 * MediaDropZone Component
 * Large, prominent drag-and-drop upload area for media-first post creation
 */

import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, ImagePlus, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MediaDropZoneProps {
  onUpload: (files: FileList) => void
  onOpenLibrary: () => void
  disabled?: boolean
  className?: string
}

export function MediaDropZone({
  onUpload,
  onOpenLibrary,
  disabled,
  className,
}: MediaDropZoneProps) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      dragCounterRef.current++
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
    },
    [disabled]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounterRef.current = 0

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        onUpload(files)
      }
    },
    [disabled, onUpload]
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

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 p-8',
        'rounded-xl border-2 border-dashed transition-all duration-200',
        isDragging ? 'border-primary bg-primary/5' : 'border-border-muted hover:border-border',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl',
            'bg-bg-subtle transition-colors',
            isDragging && 'bg-primary/10'
          )}
        >
          <Upload
            className={cn(
              'h-8 w-8 transition-colors',
              isDragging ? 'text-primary' : 'text-text-muted'
            )}
          />
        </div>

        <div>
          <p className="text-text-primary font-medium">
            {t('dashboard.create.media.dropzone.title')}
          </p>
          <p className="text-text-secondary mt-1 text-sm">
            {t('dashboard.create.media.dropzone.description')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" onClick={handleUploadClick} disabled={disabled}>
            <ImagePlus className="mr-2 h-4 w-4" />
            {t('dashboard.create.media.dropzone.upload')}
          </Button>

          <Button variant="outline" onClick={onOpenLibrary} disabled={disabled}>
            <FolderOpen className="mr-2 h-4 w-4" />
            {t('dashboard.create.media.dropzone.fromLibrary')}
          </Button>
        </div>

        <p className="text-text-muted text-xs">{t('dashboard.create.media.dropzone.limits')}</p>
      </div>
    </div>
  )
}
