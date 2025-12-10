import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { TooltipIcon } from './TooltipIcon'
import { InfoHint } from './InfoHint'

interface DashboardCardProps {
  titleKey?: string
  descriptionKey?: string
  tooltipKey?: string
  hintKey?: string
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function DashboardCard({
  titleKey,
  descriptionKey,
  tooltipKey,
  hintKey,
  children,
  className,
  padding = 'md',
  hover = false,
}: DashboardCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'border-border-subtle bg-card rounded-xl border transition-all duration-150',
        paddingStyles[padding],
        hover && 'hover:border-border hover:bg-surface-elevated',
        className
      )}
    >
      {(titleKey || descriptionKey) && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {titleKey && (
              <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
                {t(titleKey)}
              </h3>
            )}
            {tooltipKey && <TooltipIcon tooltipKey={tooltipKey} />}
          </div>
          {descriptionKey && (
            <p className="text-muted-foreground mt-1 text-sm">{t(descriptionKey)}</p>
          )}
        </div>
      )}
      {children}
      {hintKey && <InfoHint textKey={hintKey} className="mt-4" />}
    </div>
  )
}
