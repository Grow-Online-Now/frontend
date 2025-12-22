import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpgradeModal } from './UpgradeModal'
import { useSubscription } from '@/hooks/useSubscription'

interface WorkspaceLimitBannerProps {
  currentCount: number
  maxWorkspaces: number
}

export function WorkspaceLimitBanner({ currentCount, maxWorkspaces }: WorkspaceLimitBannerProps) {
  const { t } = useTranslation()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { subscription, plans, startCheckout, isCheckingOut } = useSubscription()

  if (!subscription || !plans) return null

  return (
    <>
      <div className="bg-warning/5 border-warning/15 flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5">
        <div className="flex items-start gap-3">
          <Zap className="text-warning mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-text-primary text-sm font-medium">
              {t('dashboard.billing.limits.banner.title')}
            </p>
            <p className="text-text-muted text-sm">
              {t('dashboard.billing.limits.banner.description', {
                current: currentCount,
                max: maxWorkspaces,
                plan: subscription.plan,
              })}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowUpgrade(true)}>
          {t('dashboard.billing.limits.banner.upgrade')}
        </Button>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        plans={plans}
        currentPlan={subscription.plan}
        onSelectPlan={(plan, interval) => {
          startCheckout(plan, interval)
        }}
        isLoading={isCheckingOut}
      />
    </>
  )
}
