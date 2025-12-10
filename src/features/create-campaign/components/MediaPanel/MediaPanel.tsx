/**
 * MediaPanel Component
 * Left panel containing the campaign's media asset library
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { DropZone } from './DropZone'
import { AssetGrid } from './AssetGrid'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import { PANEL_WIDTHS } from '../../constants'

interface MediaPanelProps {
  uploads: FileUploadState[]
  isUploading: boolean
  onFilesAdded: (files: FileList) => void
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  className?: string
}

export function MediaPanel({
  uploads,
  isUploading,
  onFilesAdded,
  onRemove,
  onRetry,
  className,
}: MediaPanelProps) {
  const { t } = useTranslation()

  return (
    <aside
      className={cn('flex h-full flex-col', 'campaign-panel-enter', className)}
      style={{ width: PANEL_WIDTHS.left }}
      aria-label={t('dashboard.campaign.media.panel.ariaLabel')}
    >
      {/* Panel header */}
      <div className="flex-shrink-0 pb-4">
        <h2 className="text-foreground text-sm font-semibold">
          {t('dashboard.campaign.media.panel.title')}
        </h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {t('dashboard.campaign.media.panel.description')}
        </p>
      </div>

      {/* Drop zone */}
      <div className="flex-shrink-0">
        <DropZone onFilesAdded={onFilesAdded} isUploading={isUploading} />
      </div>

      {/* Uploaded assets */}
      <div className="-mx-1 mt-4 flex-1 overflow-y-auto px-1">
        <AssetGrid uploads={uploads} onRemove={onRemove} onRetry={onRetry} />
      </div>

      {/* Upload stats */}
      {uploads.length > 0 && (
        <div className="border-border-subtle mt-3 flex-shrink-0 border-t pt-3">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              {uploads.filter((u) => u.status === 'ready').length}{' '}
              {t('dashboard.campaign.media.panel.ready')}
            </span>
            {uploads.some((u) => u.status === 'error') && (
              <span className="text-destructive">
                {uploads.filter((u) => u.status === 'error').length}{' '}
                {t('dashboard.campaign.media.panel.failed')}
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
