import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { AlertCircle, Calendar, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { Badge } from '@/components/ui/badge'
import type { Subscription } from '@/types/subscription'
import { PLAN_DISPLAY_NAMES, formatLimit } from '@/types/subscription'

interface CurrentSubscriptionProps {
  subscription: Subscription
  onManageBilling: () => void
  onCancel: () => void
  onResume: () => void
  isOpeningPortal?: boolean
  isCanceling?: boolean
  isResuming?: boolean
}

export function CurrentSubscription({
  subscription,
  onManageBilling,
  onCancel,
  onResume,
  isOpeningPortal,
  isCanceling,
  isResuming,
}: CurrentSubscriptionProps) {
  const { t } = useTranslation()

  const isPaid = subscription.plan !== 'FREE'
  const isCanceled = subscription.cancelAtPeriodEnd

  return (
    <DashboardCard titleKey="dashboard.billing.current.title">
      <div className="space-y-6">
        {/* Plan Badge */}
        <div className="flex items-center justify-between">
          <p className="text-text-secondary text-sm">
            {t('dashboard.billing.current.description')}
          </p>
          <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'error'}>
            {PLAN_DISPLAY_NAMES[subscription.plan]}
          </Badge>
        </div>

        {/* Cancellation Warning */}
        {isCanceled && subscription.currentPeriodEnd && (
          <div className="bg-error/5 border-error/15 flex items-start gap-3 rounded-xl border px-4 py-3.5">
            <AlertCircle className="text-error mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-error text-sm leading-relaxed">
              {t('dashboard.billing.current.cancelWarning', {
                date: format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy'),
              })}
            </p>
          </div>
        )}

        {/* Past Due Warning */}
        {subscription.status === 'PAST_DUE' && (
          <div className="bg-error/5 border-error/15 flex items-start gap-3 rounded-xl border px-4 py-3.5">
            <AlertCircle className="text-error mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-error text-sm leading-relaxed">
              {t('dashboard.billing.current.pastDueWarning')}
            </p>
          </div>
        )}

        {/* Plan Limits */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-bg-subtle rounded-lg p-4">
            <p className="text-text-muted text-sm">{t('dashboard.billing.limits.workspaces')}</p>
            <p className="text-text-primary mt-1 text-2xl font-bold">
              {formatLimit(subscription.limits.maxWorkspaces)}
            </p>
          </div>
          <div className="bg-bg-subtle rounded-lg p-4">
            <p className="text-text-muted text-sm">{t('dashboard.billing.limits.postsPerMonth')}</p>
            <p className="text-text-primary mt-1 text-2xl font-bold">
              {formatLimit(subscription.limits.maxPostsPerMonth)}
            </p>
          </div>
          <div className="bg-bg-subtle rounded-lg p-4">
            <p className="text-text-muted text-sm">{t('dashboard.billing.limits.platforms')}</p>
            <p className="text-text-primary mt-1 text-2xl font-bold">
              {formatLimit(subscription.limits.maxPlatformsPerWorkspace)}
            </p>
          </div>
        </div>

        {/* Billing Info */}
        {isPaid && subscription.currentPeriodEnd && (
          <div className="text-text-muted flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {isCanceled
                  ? t('dashboard.billing.current.accessUntil')
                  : t('dashboard.billing.current.renews')}{' '}
                {format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}
              </span>
            </div>
            {subscription.billingInterval && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{t(`dashboard.billing.current.${subscription.billingInterval}Billing`)}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isPaid && (
            <Button variant="outline" onClick={onManageBilling} disabled={isOpeningPortal}>
              {isOpeningPortal
                ? t('dashboard.billing.actions.opening')
                : t('dashboard.billing.actions.manageBilling')}
            </Button>
          )}

          {isPaid && !isCanceled && (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={onCancel}
              disabled={isCanceling}
            >
              {isCanceling
                ? t('dashboard.billing.actions.canceling')
                : t('dashboard.billing.actions.cancel')}
            </Button>
          )}

          {isCanceled && (
            <Button onClick={onResume} disabled={isResuming}>
              {isResuming
                ? t('dashboard.billing.actions.resuming')
                : t('dashboard.billing.actions.resume')}
            </Button>
          )}
        </div>
      </div>
    </DashboardCard>
  )
}
