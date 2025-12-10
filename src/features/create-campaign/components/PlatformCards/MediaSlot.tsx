/**
 * MediaSlot Component
 * Drop target for media within a platform card
 */

import { useCallback } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { ImageIcon, X, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaAsset } from '../../types'
import type { SocialPlatform } from '@/types/connections'
import { PLATFORM_MEDIA_REQUIREMENTS } from '../../types'

interface MediaSlotProps {
  connectionId: string
  platform: SocialPlatform
  asset: MediaAsset | null
  isRequired: boolean
  onRemove: () => void
  disabled?: boolean
}

export function MediaSlot({
  connectionId,
  platform,
  asset,
  isRequired,
  onRemove,
  disabled,
}: MediaSlotProps) {
  const { t } = useTranslation()
  const requirements = PLATFORM_MEDIA_REQUIREMENTS[platform]

  const { isOver, setNodeRef } = useDroppable({
    id: `media-slot-${connectionId}`,
    data: {
      type: 'media-slot',
      connectionId,
      platform,
    },
    disabled,
  })

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove()
    },
    [onRemove]
  )

  // Empty slot
  if (!asset) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'campaign-media-slot',
          'flex flex-col items-center justify-center gap-2',
          isOver && 'campaign-media-slot-drag-over',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        aria-label={t('dashboard.campaign.platformCard.mediaSlot.empty')}
      >
        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
          <ImageIcon className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="px-4 text-center">
          <p className="text-muted-foreground text-xs">
            {isOver
              ? t('dashboard.campaign.platformCard.mediaSlot.dropHere')
              : t('dashboard.campaign.platformCard.mediaSlot.dragMedia')}
          </p>
          {requirements.aspectRatioHint && (
            <p className="text-muted-foreground/70 mt-0.5 text-xs">
              {requirements.aspectRatioHint}
            </p>
          )}
        </div>
        {isRequired && (
          <span className="text-destructive text-xs">
            {t('dashboard.campaign.platformCard.mediaSlot.required')}
          </span>
        )}
      </div>
    )
  }

  // Filled slot with media preview
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'campaign-media-slot campaign-media-slot-filled',
        'group relative overflow-hidden',
        isOver && 'ring-primary ring-2'
      )}
    >
      {/* Media preview */}
      {asset.type === 'video' ? (
        <video src={asset.url} className="h-full w-full object-cover" muted playsInline />
      ) : (
        <img
          src={asset.thumbnailUrl || asset.url}
          alt={asset.filename}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}

      {/* Video indicator */}
      {asset.type === 'video' && (
        <div className="absolute top-2 left-2">
          <Film className="h-4 w-4 text-white drop-shadow-md" />
        </div>
      )}

      {/* Duration badge for video */}
      {asset.type === 'video' && asset.duration && (
        <div className="campaign-duration-badge">
          {Math.floor(asset.duration / 60)}:
          {String(Math.floor(asset.duration % 60)).padStart(2, '0')}
        </div>
      )}

      {/* Hover overlay with remove button */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={handleRemoveClick}
          className={cn(
            'h-8 w-8 rounded-full bg-black/60 hover:bg-black/80',
            'flex items-center justify-center',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
          )}
          aria-label={t('dashboard.campaign.platformCard.mediaSlot.remove')}
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Drop indicator when dragging over */}
      {isOver && (
        <div className="bg-primary/20 absolute inset-0 flex items-center justify-center">
          <p className="text-sm font-medium text-white drop-shadow-md">
            {t('dashboard.campaign.platformCard.mediaSlot.replace')}
          </p>
        </div>
      )}
    </div>
  )
}
