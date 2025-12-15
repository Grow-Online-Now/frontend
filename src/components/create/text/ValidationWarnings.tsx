/**
 * ValidationWarnings Component
 * Displays validation warnings for selected platforms with AI shorten action
 */

import { useTranslation } from 'react-i18next'
import { AlertTriangle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { ValidationWarning } from '@/types/create'

interface ValidationWarningsProps {
  warnings: ValidationWarning[]
  onShortenWithAI?: (platformId: string) => void
  className?: string
}

export function ValidationWarnings({
  warnings,
  onShortenWithAI,
  className,
}: ValidationWarningsProps) {
  const { t } = useTranslation()

  // Filter to only show over_limit warnings (actionable)
  const overLimitWarnings = warnings.filter((w) => w.type === 'over_limit')

  if (overLimitWarnings.length === 0) return null

  const handleShortenClick = (platformId: string) => {
    if (onShortenWithAI) {
      onShortenWithAI(platformId)
    } else {
      // Placeholder - AI shorten not implemented
      toast.info(t('dashboard.create.text.validation.shortenComingSoon'))
    }
  }

  return (
    <div className={cn('mt-4 space-y-2', className)}>
      {overLimitWarnings.map((warning) => (
        <div
          key={warning.platformId}
          className={cn(
            'flex items-center justify-between',
            'rounded-lg px-4 py-3',
            'bg-warning/5 border-warning/20 border'
          )}
        >
          <div className="text-warning flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <PlatformIcon platform={warning.platform} size="xs" />
            <span>{t(warning.messageKey, warning.messageParams)}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShortenClick(warning.platformId)}
            className="text-warning hover:text-warning hover:bg-warning/10"
          >
            <Sparkles className="mr-1 h-4 w-4" />
            {t('dashboard.create.text.validation.shortenWithAI')}
          </Button>
        </div>
      ))}
    </div>
  )
}
