/**
 * MobileMediaBar Component
 * Horizontal scrollable media bar for mobile/tablet views
 */

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Loader2, AlertCircle, Film } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { ALL_ALLOWED_MIME_TYPES } from '@/types/media'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface MobileMediaBarProps {
  uploads: FileUploadState[]
  isUploading: boolean
  onFilesAdded: (files: FileList) => void
  onRemove: (id: string) => void
  className?: string
}

function MobileAssetThumb({ upload, onRemove }: { upload: FileUploadState; onRemove: () => void }) {
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

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg',
        'bg-muted cursor-grab active:cursor-grabbing',
        isDragging && 'ring-primary ring-2'
      )}
    >
      <img src={upload.localUrl} alt="" className="h-full w-full object-cover" draggable={false} />

      {upload.type === 'video' && (
        <Film className="absolute top-1 left-1 h-3 w-3 text-white drop-shadow" />
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <AlertCircle className="text-destructive h-4 w-4" />
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className={cn(
          'absolute -top-1 -right-1 h-5 w-5 rounded-full',
          'flex items-center justify-center bg-black/80',
          'text-white opacity-0 hover:opacity-100 focus:opacity-100',
          'transition-opacity'
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export function MobileMediaBar({
  uploads,
  isUploading,
  onFilesAdded,
  onRemove,
  className,
}: MobileMediaBarProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFilesAdded(files)
      }
      e.target.value = ''
    },
    [onFilesAdded]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        onFilesAdded(files)
      }
    },
    [onFilesAdded]
  )

  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto p-3',
        'border-border-subtle bg-surface-muted border-b',
        'scrollbar-thin',
        isDragOver && 'bg-accent-subtle',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ALL_ALLOWED_MIME_TYPES.join(',')}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Add button */}
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={cn(
          'h-16 w-16 flex-shrink-0 rounded-lg',
          'border-border-muted border border-dashed',
          'flex items-center justify-center',
          'hover:border-border hover:bg-surface',
          'transition-colors'
        )}
      >
        {isUploading ? (
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        ) : (
          <Plus className="text-muted-foreground h-5 w-5" />
        )}
      </button>

      {/* Media thumbnails */}
      {uploads.map((upload) => (
        <MobileAssetThumb key={upload.id} upload={upload} onRemove={() => onRemove(upload.id)} />
      ))}

      {/* Empty state hint */}
      {uploads.length === 0 && (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {t('dashboard.campaign.media.grid.dragHint')}
        </span>
      )}
    </div>
  )
}
