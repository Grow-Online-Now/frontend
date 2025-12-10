/**
 * AddPlatformCard Component
 * Ghost card for adding/connecting new platforms
 */

import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddPlatformCardProps {
  onClick: () => void
  disabled?: boolean
}

export function AddPlatformCard({ onClick, disabled }: AddPlatformCardProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'campaign-add-card',
        'min-h-[200px] w-full p-4',
        'flex flex-col items-center justify-center gap-3',
        'focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      aria-label={t('dashboard.campaign.addPlatform.ariaLabel')}
    >
      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
        <Plus className="text-muted-foreground h-5 w-5" />
      </div>
      <div className="text-center">
        <p className="text-muted-foreground text-sm font-medium">
          {t('dashboard.campaign.addPlatform.title')}
        </p>
        <p className="text-muted-foreground/70 mt-0.5 text-xs">
          {t('dashboard.campaign.addPlatform.subtitle')}
        </p>
      </div>
    </button>
  )
}
