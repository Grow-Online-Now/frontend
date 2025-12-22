import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'
import { CurrentSubscription } from '@/components/dashboard/billing/CurrentSubscription'
import { PricingCard } from '@/components/dashboard/billing/PricingCard'
import { BillingIntervalToggle } from '@/components/dashboard/billing/BillingIntervalToggle'
import { EnterpriseContact } from '@/components/dashboard/billing/EnterpriseContact'
import { Skeleton } from '@/components/ui/skeleton'
import type { BillingInterval, PlanType } from '@/types/subscription'

export function BillingSettings() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly')

  const {
    subscription,
    plans,
    isLoading,
    error,
    startCheckout,
    openPortal,
    cancel,
    resume,
    isCheckingOut,
    isOpeningPortal,
    isCanceling,
    isResuming,
  } = useSubscription()

  // Handle success/cancel from Stripe redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success(t('dashboard.billing.toast.success'))
      setSearchParams({})
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info(t('dashboard.billing.toast.canceled'))
      setSearchParams({})
    }
  }, [searchParams, setSearchParams, t])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !subscription || !plans) {
    return (
      <div className="bg-error/5 border-error/15 rounded-xl border p-6 text-center">
        <p className="text-error text-sm">{error || t('dashboard.billing.error.load')}</p>
      </div>
    )
  }

  const handleSelectPlan = (plan: Exclude<PlanType, 'FREE'>, interval: BillingInterval) => {
    startCheckout(plan, interval)
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <CurrentSubscription
        subscription={subscription}
        onManageBilling={openPortal}
        onCancel={cancel}
        onResume={resume}
        isOpeningPortal={isOpeningPortal}
        isCanceling={isCanceling}
        isResuming={isResuming}
      />

      {/* Upgrade Section */}
      {subscription.plan !== 'GROWTH' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-text-primary text-lg font-semibold tracking-tight">
                {subscription.plan === 'FREE'
                  ? t('dashboard.billing.upgrade.title')
                  : t('dashboard.billing.upgrade.changePlan')}
              </h3>
              <p className="text-text-muted text-sm">
                {t('dashboard.billing.upgrade.description')}
              </p>
            </div>
            <BillingIntervalToggle value={billingInterval} onChange={setBillingInterval} />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currentPlan={subscription.plan}
                billingInterval={billingInterval}
                onSelect={handleSelectPlan}
                isLoading={isCheckingOut}
              />
            ))}
          </div>

          {/* Enterprise Contact */}
          <EnterpriseContact />
        </div>
      )}
    </div>
  )
}
