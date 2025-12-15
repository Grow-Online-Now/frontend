/**
 * PreviewPanel Component
 * Desktop-only preview panel showing how the post will look
 * Fixed width 360px, sticky positioning
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { PlatformWithValidation } from '@/types/create'

interface PreviewPanelProps {
  content: string
  selectedPlatforms: PlatformWithValidation[]
  className?: string
}

export function PreviewPanel({ content, selectedPlatforms, className }: PreviewPanelProps) {
  const { t } = useTranslation()

  // Get the first selected platform for preview
  const previewPlatform = selectedPlatforms[0]

  if (!previewPlatform) {
    return (
      <div
        className={cn(
          'bg-surface-subtle border-border flex h-fit w-[360px] flex-col rounded-2xl border p-6',
          className
        )}
      >
        <div className="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase">
          {t('dashboard.create.text.preview.title')}
        </div>
        <div className="text-muted-foreground flex flex-1 items-center justify-center py-12 text-center text-sm">
          {t('dashboard.create.text.preview.selectPlatform')}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-surface-subtle border-border h-fit w-[360px] rounded-2xl border p-6',
        className
      )}
    >
      {/* Header */}
      <div className="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase">
        {t('dashboard.create.text.preview.title')}
      </div>

      {/* Preview card */}
      <div className="bg-surface-elevated border-border overflow-hidden rounded-xl border">
        {/* Platform header */}
        <div className="border-border flex items-center gap-3 border-b p-4">
          <PlatformIcon platform={previewPlatform.platform} size="md" showBackground />
          <div className="min-w-0 flex-1">
            <div className="text-foreground truncate text-sm font-medium">
              {previewPlatform.displayName || previewPlatform.platformUsername}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              @{previewPlatform.platformUsername}
            </div>
          </div>
        </div>

        {/* Content preview */}
        <div className="p-4">
          {content.trim() ? (
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              {t('dashboard.create.text.preview.noContent')}
            </p>
          )}
        </div>

        {/* Character count footer */}
        <div className="border-border border-t px-4 py-3">
          <div
            className={cn(
              'font-mono text-xs',
              previewPlatform.isOverLimit && 'text-error',
              previewPlatform.isNearLimit && !previewPlatform.isOverLimit && 'text-warning',
              !previewPlatform.isOverLimit &&
                !previewPlatform.isNearLimit &&
                'text-muted-foreground'
            )}
          >
            {previewPlatform.characterCount}/{previewPlatform.characterLimit}{' '}
            {t('dashboard.create.text.preview.characters')}
          </div>
        </div>
      </div>

      {/* Multiple platforms indicator */}
      {selectedPlatforms.length > 1 && (
        <div className="text-muted-foreground mt-4 text-center text-xs">
          {t('dashboard.create.text.preview.otherPlatforms', {
            count: selectedPlatforms.length - 1,
          })}
        </div>
      )}
    </div>
  )
}
