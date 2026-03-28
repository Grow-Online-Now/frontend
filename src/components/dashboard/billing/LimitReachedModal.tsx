import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Zap, Layers, Headset, Users, Code, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUpgradePrompt } from '@/contexts/UpgradePromptContext'
import { useSubscription } from '@/hooks/useSubscription'
import type { BillingInterval, PlanType, Plan } from '@/types/subscription'

type SelectedPlan = 'PRO' | 'GROWTH'

interface FeatureItem {
  icon: React.ReactNode
  titleKey: string
  descriptionKey: string
}

const PRO_FEATURES: FeatureItem[] = [
  {
    icon: <Zap className="h-4 w-4" />,
    titleKey: 'dashboard.billing.limitReached.features.clips50.title',
    descriptionKey: 'dashboard.billing.limitReached.features.clips50.description',
  },
  {
    icon: <Layers className="h-4 w-4" />,
    titleKey: 'dashboard.billing.limitReached.features.unlimitedWorkspaces.title',
    descriptionKey: 'dashboard.billing.limitReached.features.unlimitedWorkspaces.description',
  },
  {
    icon: <Headset className="h-4 w-4" />,
    titleKey: 'dashboard.billing.limitReached.features.prioritySupport.title',
    descriptionKey: 'dashboard.billing.limitReached.features.prioritySupport.description',
  },
]

const GROWTH_FEATURES: FeatureItem[] = [
  {
    icon: <Zap className="h-4 w-4" />,
    titleKey: 'dashboard.billing.limitReached.features.clips500.title',
    descriptionKey: 'dashboard.billing.limitReached.features.clips500.description',
  },
  {
    icon: <Users className="h-4 w-4" />,
    titleKey: 'dashboard.billing.limitReached.features.teamCollaboration.title',
    descriptionKey: 'dashboard.billing.limitReached.features.teamCollaboration.description',
  },
  {
    icon: <Code className="h-4 w-4" />,
    titleKey: 'dashboard.billing.limitReached.features.apiAccess.title',
    descriptionKey: 'dashboard.billing.limitReached.features.apiAccess.description',
  },
]

export function LimitReachedModal() {
  const { t } = useTranslation()
  const { state, closeUpgradePrompt } = useUpgradePrompt()
  const { plans, startCheckout, isCheckingOut } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>('PRO')
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly')

  const plan = plans.find((p) => p.id === selectedPlan) as Plan | undefined
  const features = selectedPlan === 'PRO' ? PRO_FEATURES : GROWTH_FEATURES

  const monthlyPrice = plan?.pricing.monthly
  const yearlyPrice = plan?.pricing.yearly
  const displayPrice =
    billingInterval === 'yearly' && yearlyPrice ? Math.round(yearlyPrice / 12) : monthlyPrice
  const showSaving = billingInterval === 'yearly' && monthlyPrice && yearlyPrice

  const handleUpgrade = () => {
    startCheckout(selectedPlan, billingInterval)
  }

  return (
    <Dialog open={state.isOpen} onOpenChange={closeUpgradePrompt}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        {/* Decorative gradient header */}
        <div className="relative overflow-hidden px-6 pt-10 pb-6">
          {/* Aurora glow circles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-6 h-36 w-36 rounded-full bg-[#8b5cf6]/30 blur-3xl" />
            <div className="absolute -top-6 right-2 h-32 w-32 rounded-full bg-[#ec4899]/25 blur-3xl" />
            <div className="absolute top-4 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#3b82f6]/20 blur-3xl" />
          </div>

          <div className="relative space-y-3 text-center">
            <h2 className="text-text-primary text-2xl font-semibold tracking-tight">
              {t(`dashboard.billing.limitReached.${state.limitType}.title`)}
            </h2>
            <p className="text-text-secondary mx-auto max-w-xs text-sm leading-relaxed">
              {t(`dashboard.billing.limitReached.${state.limitType}.subtitle`)}
            </p>
          </div>
        </div>

        {/* Plan toggle */}
        <div className="flex justify-center px-6">
          <div className="bg-bg-subtle inline-flex rounded-full p-1">
            {(['PRO', 'GROWTH'] as const).map((planId) => (
              <button
                key={planId}
                onClick={() => setSelectedPlan(planId)}
                className={cn(
                  'relative rounded-full px-6 py-1.5 text-sm font-medium transition-all duration-150',
                  selectedPlan === planId
                    ? 'bg-bg-elevated text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {planId === 'PRO' ? 'Pro' : 'Growth'}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1 px-6 pt-5 pb-4">
          {features.map((feature) => (
            <div
              key={feature.titleKey}
              className="flex items-start gap-3.5 rounded-lg px-2 py-2.5"
            >
              <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                {feature.icon}
              </div>
              <div className="min-w-0">
                <p className="text-text-primary text-sm font-medium">
                  {t(feature.titleKey)}
                </p>
                <p className="text-text-muted text-xs leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-border-default mx-6 border-t" />

        {/* Pricing + CTA */}
        <div className="space-y-4 px-6 pt-4 pb-5">
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-text-primary text-4xl font-bold tracking-tight">
                ${displayPrice ?? '—'}
              </span>
              {showSaving && (
                <span className="text-text-muted text-sm line-through">
                  ${monthlyPrice}
                </span>
              )}
              <span className="text-text-muted text-sm">
                {t('dashboard.billing.limitReached.perMonth')}
              </span>
            </div>

            {/* Billing toggle */}
            <div className="bg-bg-subtle flex rounded-full p-0.5 text-xs font-medium">
              {(['yearly', 'monthly'] as const).map((interval) => (
                <button
                  key={interval}
                  onClick={() => setBillingInterval(interval)}
                  className={cn(
                    'rounded-full px-3 py-1 transition-all duration-150',
                    billingInterval === interval
                      ? 'bg-bg-elevated text-text-primary shadow-sm'
                      : 'text-text-muted'
                  )}
                >
                  {t(`dashboard.billing.interval.${interval}`)}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleUpgrade}
            disabled={isCheckingOut}
            className="h-11 w-full text-sm font-semibold"
            size="lg"
          >
            {isCheckingOut
              ? t('dashboard.billing.pricing.loading')
              : t('dashboard.billing.limitReached.upgradeToLabel', {
                  plan: selectedPlan === 'PRO' ? 'Pro' : 'Growth',
                })}
            {!isCheckingOut && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>

          {/* Trust signal */}
          <p className="text-text-muted text-center text-xs">
            {t('dashboard.billing.limitReached.cancelAnytime')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
