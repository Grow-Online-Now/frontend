import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Plan, PlanType, BillingInterval } from '@/types/subscription'
import { formatLimit, formatBytes, canUpgrade } from '@/types/subscription'

interface PricingCardProps {
  plan: Plan
  currentPlan: PlanType
  billingInterval: BillingInterval
  onSelect: (plan: Exclude<PlanType, 'FREE'>, interval: BillingInterval) => void
  isLoading?: boolean
}

export function PricingCard({
  plan,
  currentPlan,
  billingInterval,
  onSelect,
  isLoading,
}: PricingCardProps) {
  const { t } = useTranslation()

  const isCurrentPlan = plan.id === currentPlan
  const isUpgrade = canUpgrade(currentPlan, plan.id)
  const isFree = plan.id === 'FREE'

  const price = billingInterval === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly

  const monthlyEquivalent = billingInterval === 'yearly' && price ? Math.round(price / 12) : price

  const formatPrice = (amount: number | null) => {
    if (isFree) return t('dashboard.billing.pricing.free')
    if (amount === null) return '—'
    return `$${Math.round(amount)}`
  }

  const handleSelect = () => {
    if (plan.id !== 'FREE') {
      onSelect(plan.id as Exclude<PlanType, 'FREE'>, billingInterval)
    }
  }

  const isRecommended = plan.id === 'PRO' && !isCurrentPlan

  return (
    <Card
      className={cn(
        'relative flex min-h-[520px] flex-col transition-all duration-150',
        isCurrentPlan && 'ring-primary ring-2',
        isRecommended && 'ring-info/40 bg-bg-elevated scale-[1.02] ring-2'
      )}
    >
      <CardContent className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary text-lg font-semibold">{plan.name}</h3>
            {isCurrentPlan && (
              <Badge variant="secondary">{t('dashboard.billing.pricing.currentPlan')}</Badge>
            )}
          </div>
          {isRecommended && (
            <Badge className="bg-info/15 text-info mt-2 border-0">
              {t('dashboard.billing.pricing.recommended')}
            </Badge>
          )}
          <p className="text-text-muted mt-2 text-sm">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-text-primary text-4xl font-bold tracking-tight">
              {formatPrice(monthlyEquivalent)}
            </span>
            {!isFree && price !== null && (
              <span className="text-text-muted">/{t('dashboard.billing.pricing.month')}</span>
            )}
          </div>
          {billingInterval === 'yearly' && price !== null && !isFree && (
            <p className="text-text-muted mt-1 text-sm">
              {t('dashboard.billing.pricing.yearlyBilled', {
                amount: `$${Math.round(price)}`,
              })}
            </p>
          )}
        </div>

        {/* Limits */}
        <div className="border-border-default mb-6 space-y-2.5 border-b pb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">{t('dashboard.billing.limits.clipsPerMonth')}</span>
            <span className="text-text-primary font-medium">
              {formatLimit(plan.limits.maxClipsPerMonth)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('dashboard.billing.limits.storage')}</span>
            <span className="text-text-primary font-medium">
              {plan.limits.maxStorageBytes ? formatBytes(plan.limits.maxStorageBytes) : formatLimit(null)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('dashboard.billing.limits.workspaces')}</span>
            <span className="text-text-primary font-medium">
              {formatLimit(plan.limits.maxWorkspaces)}
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm">
              <Check className="text-success h-4 w-4 shrink-0" />
              <span className="text-text-secondary">
                {t(`dashboard.billing.features.${feature}`)}
              </span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="mt-6 pt-4">
          {isCurrentPlan ? (
            <Button className="w-full" variant="outline" disabled>
              {t('dashboard.billing.pricing.currentPlan')}
            </Button>
          ) : isFree ? (
            <Button className="w-full" variant="outline" disabled>
              {t('dashboard.billing.pricing.freePlan')}
            </Button>
          ) : (
            <Button className="w-full" onClick={handleSelect} disabled={isLoading}>
              {isLoading
                ? t('dashboard.billing.pricing.loading')
                : isUpgrade
                  ? t('dashboard.billing.pricing.upgrade')
                  : t('dashboard.billing.pricing.switchPlan')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
