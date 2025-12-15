import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InfoHint } from './InfoHint'

interface EmptyStateProps {
  icon: React.ReactNode
  titleKey: string
  descriptionKey: string
  ctaKey?: string
  onCtaClick?: () => void
  secondaryCtaKey?: string
  onSecondaryCtaClick?: () => void
  hintKey?: string
  compact?: boolean
  className?: string
}

export function EmptyState({
  icon,
  titleKey,
  descriptionKey,
  ctaKey,
  onCtaClick,
  secondaryCtaKey,
  onSecondaryCtaClick,
  hintKey,
  compact = false,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-bg-subtle text-center',
        compact ? 'px-5 py-8' : 'px-6 py-14',
        className
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          'mb-5 flex items-center justify-center rounded-xl border border-border-default bg-bg-hover',
          compact ? 'h-12 w-12' : 'h-14 w-14'
        )}
      >
        <span
          className={cn(
            'text-muted-foreground',
            compact ? '[&>svg]:h-5 [&>svg]:w-5' : '[&>svg]:h-6 [&>svg]:w-6'
          )}
        >
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3
        className={cn(
          'text-foreground mb-2 font-semibold tracking-tight',
          compact ? 'text-sm' : 'text-base'
        )}
      >
        {t(titleKey)}
      </h3>

      {/* Description */}
      <p
        className={cn(
          'text-muted-foreground max-w-sm leading-relaxed',
          compact ? 'mb-4 text-xs' : 'mb-6 text-sm'
        )}
      >
        {t(descriptionKey)}
      </p>

      {/* Actions */}
      {(ctaKey || secondaryCtaKey) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {ctaKey && onCtaClick && (
            <Button onClick={onCtaClick} size={compact ? 'sm' : 'default'}>
              {t(ctaKey)}
            </Button>
          )}
          {secondaryCtaKey && onSecondaryCtaClick && (
            <Button
              onClick={onSecondaryCtaClick}
              variant="outline"
              size={compact ? 'sm' : 'default'}
            >
              {t(secondaryCtaKey)}
            </Button>
          )}
        </div>
      )}

      {/* Optional hint */}
      {hintKey && <InfoHint textKey={hintKey} variant="tip" className="mt-6 max-w-md" />}
    </div>
  )
}
