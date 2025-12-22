import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { BillingInterval } from '@/types/subscription'

interface BillingIntervalToggleProps {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center">
      <div className="bg-muted/50 inline-flex gap-1 rounded-xl p-1">
        <button
          type="button"
          className={cn(
            'rounded-lg px-5 py-2 text-sm font-medium transition-all',
            value === 'monthly'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
          onClick={() => onChange('monthly')}
        >
          {t('dashboard.billing.interval.monthly')}
        </button>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all',
            value === 'yearly'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
          onClick={() => onChange('yearly')}
        >
          {t('dashboard.billing.interval.yearly')}
          <Badge className="bg-success/15 text-success border-0 text-xs">
            {t('dashboard.billing.interval.save')}
          </Badge>
        </button>
      </div>
    </div>
  )
}
