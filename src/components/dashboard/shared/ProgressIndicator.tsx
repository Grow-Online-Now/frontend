import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  current: number
  total: number
  labelKey: string
  showBar?: boolean
  className?: string
}

export function ProgressIndicator({
  current,
  total,
  labelKey,
  showBar = false,
  className,
}: ProgressIndicatorProps) {
  const { t } = useTranslation()
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-muted-foreground text-[13px]">{t(labelKey, { current, total })}</p>
      {showBar && (
        <div className="bg-surface-muted h-1 w-full overflow-hidden rounded-full">
          <div
            className="from-primary to-primary/80 h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}
