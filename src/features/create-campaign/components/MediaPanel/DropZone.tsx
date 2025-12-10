/**
 * DropZone Component
 * Large drop area for uploading media to the campaign
 */

import { useCallback, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, ImageIcon, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ALL_ALLOWED_MIME_TYPES } from '@/types/media'

interface DropZoneProps {
  onFilesAdded: (files: FileList) => void
  isUploading: boolean
  disabled?: boolean
}

export function DropZone({ onFilesAdded, isUploading, disabled }: DropZoneProps) {
  const { t } = useTranslation()
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragOver(true)
      }
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        onFilesAdded(files)
      }
    },
    [onFilesAdded, disabled]
  )

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFilesAdded(files)
      }
      // Reset input so same file can be selected again
      e.target.value = ''
    },
    [onFilesAdded]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault()
        inputRef.current?.click()
      }
    },
    [disabled]
  )

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={t('dashboard.campaign.media.dropZone.ariaLabel')}
      aria-disabled={disabled}
      className={cn(
        'campaign-drop-zone',
        'relative flex flex-col items-center justify-center',
        'min-h-[140px] rounded-xl p-6',
        'focus-visible:ring-primary cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        isDragOver && 'campaign-drop-zone-active',
        disabled && 'cursor-not-allowed opacity-50',
        isUploading && 'pointer-events-none'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ALL_ALLOWED_MIME_TYPES.join(',')}
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />

      <div
        className={cn('flex flex-col items-center gap-3 text-center', 'campaign-transition-base')}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'bg-muted',
            isDragOver && 'bg-primary/10'
          )}
        >
          <Upload className={cn('text-muted-foreground h-5 w-5', isDragOver && 'text-primary')} />
        </div>

        <div className="space-y-1">
          <p className={cn('text-sm font-medium', isDragOver ? 'text-primary' : 'text-foreground')}>
            {isDragOver
              ? t('dashboard.campaign.media.dropZone.dropHere')
              : t('dashboard.campaign.media.dropZone.title')}
          </p>
          <p className="text-muted-foreground text-xs">
            {t('dashboard.campaign.media.dropZone.subtitle')}
          </p>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>{t('dashboard.campaign.media.dropZone.images')}</span>
          <span className="text-border">|</span>
          <Film className="h-3.5 w-3.5" />
          <span>{t('dashboard.campaign.media.dropZone.videos')}</span>
        </div>
      </div>

      {/* Upload progress overlay */}
      {isUploading && (
        <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-xl">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            <span>{t('dashboard.campaign.media.dropZone.uploading')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
