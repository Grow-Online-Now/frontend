/**
 * ContentPreview Component
 * Shows a truncated preview of post content on Steps 2 & 3
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ContentPreviewProps {
  content: string
  maxLines?: number
  className?: string
}

export function ContentPreview({ content, maxLines = 2, className }: ContentPreviewProps) {
  const { t } = useTranslation()

  if (!content.trim()) return null

  return (
    <div className={cn('bg-surface-elevated border-border rounded-xl border p-4', className)}>
      <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
        {t('dashboard.create.text.contentPreview.label')}
      </div>
      <p
        className={cn(
          'text-secondary text-sm leading-relaxed',
          maxLines === 2 && 'line-clamp-2',
          maxLines === 3 && 'line-clamp-3'
        )}
      >
        {content}
      </p>
    </div>
  )
}
