import { useTranslation } from 'react-i18next'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/hooks/useSubscription'
import { useUpgradePrompt } from '@/contexts/UpgradePromptContext'

interface WorkspaceLimitBannerProps {
  currentCount: number
  maxWorkspaces: number
}

export function WorkspaceLimitBanner({ currentCount, maxWorkspaces }: WorkspaceLimitBannerProps) {
  const { t } = useTranslation()
  const { subscription } = useSubscription()
  const { showUpgradePrompt } = useUpgradePrompt()

  if (!subscription) return null

  return (
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
      <Button
        size="sm"
        onClick={() =>
          showUpgradePrompt('workspaces', currentCount, maxWorkspaces, subscription.plan)
        }
      >
        {t('dashboard.billing.limits.banner.upgrade')}
      </Button>
    </div>
  )
}
