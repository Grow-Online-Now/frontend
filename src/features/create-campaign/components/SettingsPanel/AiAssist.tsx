/**
 * AiAssist Component
 * Collapsible AI assistance panel
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Sparkles, Wand2, Hash, TrendingUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AiAssistProps {
  onGenerateCaptions?: () => Promise<void>
  onSuggestHashtags?: () => Promise<void>
  onOptimize?: () => Promise<void>
  disabled?: boolean
}

export function AiAssist({
  onGenerateCaptions,
  onSuggestHashtags,
  onOptimize,
  disabled,
}: AiAssistProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const handleAction = useCallback(
    async (action: () => Promise<void> | undefined, actionName: string) => {
      if (!action || disabled || loadingAction) return

      setLoadingAction(actionName)
      try {
        await action()
      } finally {
        setLoadingAction(null)
      }
    },
    [disabled, loadingAction]
  )

  const actions = [
    {
      id: 'generate',
      icon: Wand2,
      labelKey: 'dashboard.campaign.aiAssist.generate.label',
      descriptionKey: 'dashboard.campaign.aiAssist.generate.description',
      action: onGenerateCaptions,
    },
    {
      id: 'hashtags',
      icon: Hash,
      labelKey: 'dashboard.campaign.aiAssist.hashtags.label',
      descriptionKey: 'dashboard.campaign.aiAssist.hashtags.description',
      action: onSuggestHashtags,
    },
    {
      id: 'optimize',
      icon: TrendingUp,
      labelKey: 'dashboard.campaign.aiAssist.optimize.label',
      descriptionKey: 'dashboard.campaign.aiAssist.optimize.description',
      action: onOptimize,
    },
  ]

  return (
    <div className="border-border-subtle bg-surface-muted overflow-hidden rounded-lg border">
      {/* Header button */}
      <button
        onClick={toggleExpanded}
        disabled={disabled}
        className={cn(
          'flex w-full items-center justify-between p-3',
          'hover:bg-surface campaign-transition-fast text-left',
          'focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        aria-expanded={isExpanded}
        aria-controls="ai-assist-content"
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
            <Sparkles className="text-primary h-3.5 w-3.5" />
          </div>
          <span className="text-foreground text-sm font-medium">
            {t('dashboard.campaign.aiAssist.title')}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'text-muted-foreground campaign-transition-base h-4 w-4',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expandable content */}
      <div
        id="ai-assist-content"
        className={cn('campaign-expand', isExpanded && 'campaign-expand-open')}
      >
        <div className="campaign-expand-content border-border-subtle border-t">
          <div className="space-y-2 p-3">
            {actions.map((action) => {
              const Icon = action.icon
              const isLoading = loadingAction === action.id
              const isDisabled = disabled || !action.action || loadingAction !== null

              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  className={cn('h-auto w-full justify-start px-3 py-2.5', 'hover:bg-muted')}
                  onClick={() => handleAction(action.action!, action.id)}
                  disabled={isDisabled}
                >
                  <div className="flex w-full items-start gap-3">
                    <div className="bg-muted flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md">
                      {isLoading ? (
                        <Loader2 className="text-primary h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Icon className="text-muted-foreground h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-foreground text-sm font-medium">{t(action.labelKey)}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {t(action.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </Button>
              )
            })}

            {/* Coming soon note */}
            <p className="text-muted-foreground pt-2 text-center text-xs">
              {t('dashboard.campaign.aiAssist.comingSoon')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
