import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PricingCard } from './PricingCard'
import { BillingIntervalToggle } from './BillingIntervalToggle'
import { PLAN_DISPLAY_NAMES } from '@/types/subscription'
import type { Plan, PlanType, BillingInterval } from '@/types/subscription'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  plans: Plan[]
  currentPlan: PlanType
  onSelectPlan: (plan: Exclude<PlanType, 'FREE'>, interval: BillingInterval) => void
  isLoading?: boolean
}

export function UpgradeModal({
  open,
  onClose,
  plans,
  currentPlan,
  onSelectPlan,
  isLoading,
}: UpgradeModalProps) {
  const { t } = useTranslation()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly')

  // Filter to only show paid plans (users can't downgrade to FREE through modal)
  const paidPlans = plans.filter((p) => p.id !== 'FREE')

  const isFree = currentPlan === 'FREE'
  const title = isFree
    ? t('dashboard.billing.modal.upgradeTitle')
    : t('dashboard.billing.modal.changePlanTitle')
  const description = isFree
    ? t('dashboard.billing.modal.upgradeDescription')
    : t('dashboard.billing.modal.changePlanDescription', {
        plan: PLAN_DISPLAY_NAMES[currentPlan],
      })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <BillingIntervalToggle value={billingInterval} onChange={setBillingInterval} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {paidPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              billingInterval={billingInterval}
              onSelect={onSelectPlan}
              isLoading={isLoading}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
