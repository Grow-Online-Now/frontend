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
        'border-border-muted/50 from-surface-muted/30 to-surface-muted/60 flex flex-col items-center justify-center rounded-2xl border border-dashed bg-gradient-to-b text-center',
        compact ? 'px-5 py-8' : 'px-6 py-14',
        className
      )}
    >
      {/* Icon container with subtle gradient and ring */}
      <div className="relative mb-5">
        <div className="from-primary/5 to-primary/10 absolute -inset-2 rounded-2xl bg-gradient-to-br blur-lg" />
        <div
          className={cn(
            'from-primary/10 to-primary/5 ring-primary/10 relative flex items-center justify-center rounded-2xl bg-gradient-to-br ring-1',
            compact ? 'h-12 w-12' : 'h-14 w-14'
          )}
        >
          <span
            className={cn(
              'text-primary',
              compact ? '[&>svg]:h-5 [&>svg]:w-5' : '[&>svg]:h-6 [&>svg]:w-6'
            )}
          >
            {icon}
          </span>
        </div>
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
            <Button
              onClick={onCtaClick}
              size={compact ? 'sm' : 'default'}
              className="shadow-primary/20 hover:shadow-primary/25 rounded-lg shadow-sm transition-all duration-150 hover:-translate-y-px hover:shadow-md active:translate-y-0"
            >
              {t(ctaKey)}
            </Button>
          )}
          {secondaryCtaKey && onSecondaryCtaClick && (
            <Button
              onClick={onSecondaryCtaClick}
              variant="outline"
              size={compact ? 'sm' : 'default'}
              className="hover:bg-accent/50 rounded-lg transition-all duration-150"
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
