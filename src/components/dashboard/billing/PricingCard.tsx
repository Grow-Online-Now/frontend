import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Plan, PlanType, BillingInterval } from '@/types/subscription'
import { formatLimit, canUpgrade } from '@/types/subscription'

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

  const formatPrice = (cents: number | null) => {
    if (cents === null) return t('dashboard.billing.pricing.free')
    return `$${(cents / 100).toFixed(0)}`
  }

  const handleSelect = () => {
    if (plan.id !== 'FREE') {
      onSelect(plan.id as Exclude<PlanType, 'FREE'>, billingInterval)
    }
  }

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-150 hover:shadow-md',
        isCurrentPlan && 'border-primary ring-primary ring-2',
        plan.id === 'PRO' && !isCurrentPlan && 'border-info'
      )}
    >
      {plan.id === 'PRO' && (
        <Badge className="bg-text-primary text-bg-base absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium">
          {t('dashboard.billing.pricing.mostPopular')}
        </Badge>
      )}

      <CardContent className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary text-lg font-semibold">{plan.name}</h3>
            {isCurrentPlan && (
              <Badge variant="secondary">{t('dashboard.billing.pricing.currentPlan')}</Badge>
            )}
          </div>
          <p className="text-text-muted mt-1 text-sm">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-text-primary text-4xl font-bold">
              {formatPrice(monthlyEquivalent)}
            </span>
            {price !== null && (
              <span className="text-text-muted">/{t('dashboard.billing.pricing.month')}</span>
            )}
          </div>
          {billingInterval === 'yearly' && price !== null && (
            <p className="text-text-muted text-sm">
              {t('dashboard.billing.pricing.yearlyBilled', {
                amount: `$${(price / 100).toFixed(0)}`,
              })}
            </p>
          )}
        </div>

        {/* Limits */}
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">{t('dashboard.billing.limits.workspaces')}</span>
            <span className="text-text-primary font-medium">
              {formatLimit(plan.limits.maxWorkspaces)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('dashboard.billing.limits.postsPerMonth')}</span>
            <span className="text-text-primary font-medium">
              {formatLimit(plan.limits.maxPostsPerMonth)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('dashboard.billing.limits.platforms')}</span>
            <span className="text-text-primary font-medium">
              {formatLimit(plan.limits.maxPlatformsPerWorkspace)}
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="mb-6 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Sparkles className="text-primary h-4 w-4 shrink-0" />
              <span className="text-text-secondary">
                {t(`dashboard.billing.features.${feature}`)}
              </span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="mt-auto">
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
