import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { BillingInterval } from '@/types/subscription'

interface BillingIntervalToggleProps {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="bg-bg-subtle inline-flex gap-1 rounded-lg p-1">
        <button
          type="button"
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
            value === 'monthly'
              ? 'bg-bg-elevated text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
          onClick={() => onChange('monthly')}
        >
          {t('dashboard.billing.interval.monthly')}
        </button>
        <button
          type="button"
          className={cn(
            'relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
            value === 'yearly'
              ? 'bg-bg-elevated text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
          onClick={() => onChange('yearly')}
        >
          {t('dashboard.billing.interval.yearly')}
          <span className="bg-success text-success-foreground absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-xs font-medium">
            -20%
          </span>
        </button>
      </div>
    </div>
  )
}
