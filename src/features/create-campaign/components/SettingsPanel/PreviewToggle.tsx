/**
 * PreviewToggle Component
 * Switch between edit and preview modes
 */

import { useTranslation } from 'react-i18next'
import { Eye, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PreviewToggleProps {
  isPreviewMode: boolean
  onChange: (isPreview: boolean) => void
  disabled?: boolean
}

export function PreviewToggle({ isPreviewMode, onChange, disabled }: PreviewToggleProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {t('dashboard.campaign.preview.title')}
      </h3>

      <div
        className={cn('bg-muted flex rounded-lg p-1', disabled && 'opacity-50')}
        role="tablist"
        aria-label={t('dashboard.campaign.preview.ariaLabel')}
      >
        <button
          role="tab"
          aria-selected={!isPreviewMode}
          onClick={() => onChange(false)}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm',
            'campaign-transition-fast',
            'focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
            !isPreviewMode
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>{t('dashboard.campaign.preview.edit')}</span>
        </button>

        <button
          role="tab"
          aria-selected={isPreviewMode}
          onClick={() => onChange(true)}
          disabled={disabled}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm',
            'campaign-transition-fast',
            'focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
            isPreviewMode
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t('dashboard.campaign.preview.preview')}</span>
        </button>
      </div>
    </div>
  )
}
