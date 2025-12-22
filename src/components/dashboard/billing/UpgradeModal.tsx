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

  // Filter to only show paid plans
  const paidPlans = plans.filter((p) => p.id !== 'FREE')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('dashboard.billing.upgrade.title')}</DialogTitle>
          <DialogDescription>{t('dashboard.billing.upgrade.description')}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <BillingIntervalToggle value={billingInterval} onChange={setBillingInterval} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
