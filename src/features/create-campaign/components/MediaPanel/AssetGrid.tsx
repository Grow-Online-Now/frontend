/**
 * AssetGrid Component
 * 2-column grid of uploaded media assets
 */

import { useTranslation } from 'react-i18next'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetThumbnail } from './AssetThumbnail'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface AssetGridProps {
  uploads: FileUploadState[]
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

export function AssetGrid({ uploads, onRemove, onRetry }: AssetGridProps) {
  const { t } = useTranslation()

  if (uploads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="bg-muted mb-2 flex h-10 w-10 items-center justify-center rounded-full">
          <ImageIcon className="text-muted-foreground h-4 w-4" />
        </div>
        <p className="text-muted-foreground text-xs">{t('dashboard.campaign.media.grid.empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {t('dashboard.campaign.media.grid.title')}
        </p>
        <span className="text-muted-foreground text-xs">
          {uploads.length}{' '}
          {uploads.length === 1
            ? t('dashboard.campaign.media.grid.file')
            : t('dashboard.campaign.media.grid.files')}
        </span>
      </div>

      <div className={cn('grid grid-cols-2 gap-2', 'bg-muted/30 rounded-lg p-2')}>
        {uploads.map((upload) => (
          <AssetThumbnail key={upload.id} upload={upload} onRemove={onRemove} onRetry={onRetry} />
        ))}
      </div>

      {/* Drag hint */}
      {uploads.some((u) => u.status === 'ready') && (
        <p className="text-muted-foreground text-center text-xs">
          {t('dashboard.campaign.media.grid.dragHint')}
        </p>
      )}
    </div>
  )
}
