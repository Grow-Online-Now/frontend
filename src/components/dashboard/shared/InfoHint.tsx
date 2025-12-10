import { useTranslation } from 'react-i18next'
import { Lightbulb, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoHintProps {
  textKey: string
  icon?: React.ReactNode
  learnMoreUrl?: string
  learnMoreKey?: string
  variant?: 'default' | 'info' | 'warning' | 'success' | 'tip'
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const variantStyles = {
  default: 'bg-surface-muted/50 border-border-subtle text-muted-foreground',
  info: 'bg-info/5 border-info/15 text-info',
  warning: 'bg-warning/5 border-warning/15 text-warning',
  success: 'bg-success/5 border-success/15 text-success',
  tip: 'bg-gradient-to-r from-primary/[0.06] to-purple-500/[0.06] border-primary/15 text-muted-foreground dark:from-primary/[0.08] dark:to-purple-500/[0.08]',
}

const variantIconStyles = {
  default: 'text-muted-foreground',
  info: 'text-info',
  warning: 'text-warning',
  success: 'text-success',
  tip: 'text-primary',
}

const variantIcons = {
  default: Lightbulb,
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  tip: Lightbulb,
}

export function InfoHint({
  textKey,
  icon,
  learnMoreUrl,
  learnMoreKey = 'common.learnMore',
  variant = 'default',
  dismissible = false,
  onDismiss,
  className,
}: InfoHintProps) {
  const { t } = useTranslation()
  const IconComponent = variantIcons[variant]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3.5',
        variantStyles[variant],
        className
      )}
    >
      <span className={cn('mt-0.5 shrink-0', variantIconStyles[variant])}>
        {icon || <IconComponent className="h-4 w-4" strokeWidth={1.75} />}
      </span>
      <p className="flex-1 text-[13px] leading-relaxed">
        {t(textKey)}
        {learnMoreUrl && (
          <>
            {' '}
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
            >
              {t(learnMoreKey)}
            </a>
          </>
        )}
      </p>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted-foreground/50 hover:bg-foreground/5 hover:text-muted-foreground -mt-0.5 -mr-1 rounded p-1 transition-colors"
          aria-label={t('common.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
