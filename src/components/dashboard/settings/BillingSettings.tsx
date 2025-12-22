import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'
import { CurrentSubscription } from '@/components/dashboard/billing/CurrentSubscription'
import { UpgradeModal } from '@/components/dashboard/billing/UpgradeModal'
import { Skeleton } from '@/components/ui/skeleton'
import type { BillingInterval, PlanType } from '@/types/subscription'

export function BillingSettings() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      setIsModalOpen(false)
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info(t('dashboard.billing.toast.canceled'))
      setSearchParams({})
    }
  }, [searchParams, setSearchParams, t])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !subscription || !plans) {
    return (
      <div className="bg-error/10 border-error/20 rounded-xl border p-6 text-center">
        <p className="text-error text-sm">{error || t('dashboard.billing.error.load')}</p>
      </div>
    )
  }

  const handleSelectPlan = (plan: Exclude<PlanType, 'FREE'>, interval: BillingInterval) => {
    startCheckout(plan, interval)
  }

  const handleCancel = async () => {
    await cancel()
    toast.success(t('dashboard.billing.toast.cancelSuccess'))
  }

  const handleResume = async () => {
    await resume()
    toast.success(t('dashboard.billing.toast.resumeSuccess'))
  }

  // TODO: Replace with actual usage data from API
  const mockUsage = {
    workspaces: 1,
    postsThisMonth: 12,
    platforms: 3,
  }

  return (
    <>
      <CurrentSubscription
        subscription={subscription}
        usage={mockUsage}
        onChangePlan={() => setIsModalOpen(true)}
        onManageBilling={openPortal}
        onCancel={handleCancel}
        onResume={handleResume}
        isOpeningPortal={isOpeningPortal}
        isCanceling={isCanceling}
        isResuming={isResuming}
      />

      <UpgradeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plans={plans}
        currentPlan={subscription.plan}
        onSelectPlan={handleSelectPlan}
        isLoading={isCheckingOut}
      />
    </>
  )
}
