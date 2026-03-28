import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Zap } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import { useUpgradePrompt } from '@/contexts/UpgradePromptContext'
import { CurrentSubscription } from '@/components/dashboard/billing/CurrentSubscription'
import { UpgradeModal } from '@/components/dashboard/billing/UpgradeModal'
import { WelcomeUpgradeModal } from '@/components/dashboard/billing/WelcomeUpgradeModal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { BillingInterval, PlanType } from '@/types/subscription'

export function BillingSettings() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const { showUpgradePrompt } = useUpgradePrompt()

  const {
    subscription,
    plans,
    usage,
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
      setShowWelcome(true)
      setSearchParams({}, { replace: true })
      setIsModalOpen(false)
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info(t('dashboard.billing.toast.canceled'))
      setSearchParams({}, { replace: true })
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

  const isOverClipLimit =
    usage && usage.clips.limit !== null && usage.clips.used >= usage.clips.limit

  const handleUpgradeClick = () => {
    if (isOverClipLimit && usage) {
      showUpgradePrompt('clips', usage.clips.used, usage.clips.limit!, subscription.plan)
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      {/* Over-limit banner */}
      {isOverClipLimit && usage && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8b5cf6]/15">
              <Zap className="h-4 w-4 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium">
                {t('dashboard.billing.limitReached.clips.title')}
              </p>
              <p className="text-text-muted text-sm">
                {t('dashboard.billing.limitReached.currentUsage', {
                  used: usage.clips.used,
                  limit: usage.clips.limit,
                })}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() =>
              showUpgradePrompt('clips', usage.clips.used, usage.clips.limit!, subscription.plan)
            }
          >
            {t('dashboard.billing.actions.upgrade')}
          </Button>
        </div>
      )}

      <CurrentSubscription
        subscription={subscription}
        usage={usage}
        onChangePlan={handleUpgradeClick}
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

      <WelcomeUpgradeModal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        plan={subscription.plan}
      />
    </>
  )
}
