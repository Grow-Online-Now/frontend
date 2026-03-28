import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { AlertCircle, Calendar, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Subscription, UsageResponse } from '@/types/subscription'
import { PLAN_DISPLAY_NAMES, formatBytes } from '@/types/subscription'

interface CurrentSubscriptionProps {
  subscription: Subscription
  usage?: UsageResponse | null
  onChangePlan: () => void
  onManageBilling: () => void
  onCancel: () => void
  onResume: () => void
  isOpeningPortal?: boolean
  isCanceling?: boolean
  isResuming?: boolean
}

function UsageCard({
  current,
  max,
  labelKey,
  formatter,
}: {
  current: number
  max: number | null
  labelKey: string
  formatter?: (v: number) => string
}) {
  const { t } = useTranslation()
  const fmt = formatter ?? String
  const isUnlimited = max === null
  const percentage = isUnlimited ? 0 : Math.min((current / max) * 100, 100)
  const isNearLimit = !isUnlimited && percentage >= 80

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{t(labelKey)}</span>
      </div>
      <div className="mb-2 flex items-baseline gap-1">
        <span className="text-foreground text-2xl font-semibold">{fmt(current)}</span>
        <span className="text-muted-foreground text-sm">/ {isUnlimited ? '∞' : fmt(max)}</span>
      </div>
      <div className="bg-background h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isNearLimit ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: isUnlimited ? '0%' : `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function CurrentSubscription({
  subscription,
  usage,
  onChangePlan,
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
  const isFree = subscription.plan === 'FREE'

  return (
    <div className="border-border-subtle bg-card space-y-6 rounded-xl border p-5">
      {/* Plan Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-lg font-semibold tracking-tight">
              {PLAN_DISPLAY_NAMES[subscription.plan]}
            </h3>
            {subscription.status === 'ACTIVE' && !isCanceled && (
              <Badge className="bg-success/15 text-success border-0 text-xs">
                {t('dashboard.billing.status.active')}
              </Badge>
            )}
            {isCanceled && (
              <Badge variant="error" className="text-xs">
                {t('dashboard.billing.status.canceling')}
              </Badge>
            )}
          </div>

          {/* Billing details */}
          {isPaid && (
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              {subscription.billingInterval && (
                <span className="bg-muted rounded-md px-2 py-0.5">
                  {t(`dashboard.billing.current.${subscription.billingInterval}Billing`)}
                </span>
              )}
              {subscription.currentPeriodEnd && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {isCanceled
                    ? t('dashboard.billing.current.accessUntil')
                    : t('dashboard.billing.current.renews')}{' '}
                  {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          )}

          {isFree && (
            <p className="text-muted-foreground text-sm">
              {t('dashboard.billing.current.freeDescription')}
            </p>
          )}
        </div>

        {/* Change Plan / Upgrade Button */}
        <Button onClick={onChangePlan} size="lg">
          {isFree
            ? t('dashboard.billing.actions.upgrade')
            : t('dashboard.billing.actions.changePlan')}
        </Button>
      </div>

      {/* Warning Banners */}
      {isCanceled && subscription.currentPeriodEnd && (
        <div className="bg-warning/10 border-warning/20 flex items-start gap-3 rounded-xl border px-4 py-3.5">
          <AlertCircle className="text-warning mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-warning text-sm leading-relaxed">
            {t('dashboard.billing.current.cancelWarning', {
              date: format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy'),
            })}
          </p>
        </div>
      )}

      {subscription.status === 'PAST_DUE' && (
        <div className="bg-error/10 border-error/20 flex items-start gap-3 rounded-xl border px-4 py-3.5">
          <AlertCircle className="text-error mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-error text-sm leading-relaxed">
            {t('dashboard.billing.current.pastDueWarning')}
          </p>
        </div>
      )}

      {/* Usage Section */}
      <div className="space-y-4">
        <h4 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {t('dashboard.billing.usage.title')}
        </h4>

        <div className="grid gap-4 md:grid-cols-3">
          <UsageCard
            current={usage?.clips.used ?? 0}
            max={subscription.limits.maxClipsPerMonth}
            labelKey="dashboard.billing.limits.clipsPerMonth"
          />
          <UsageCard
            current={usage?.storage.used ?? 0}
            max={subscription.limits.maxStorageBytes}
            labelKey="dashboard.billing.limits.storage"
            formatter={formatBytes}
          />
          <UsageCard
            current={usage?.workspaces.used ?? 0}
            max={subscription.limits.maxWorkspaces}
            labelKey="dashboard.billing.limits.workspaces"
          />
        </div>
      </div>

      {/* Actions */}
      {isPaid && (
        <div className="border-border-subtle flex items-center gap-3 border-t pt-5">
          <Button variant="outline" onClick={onManageBilling} disabled={isOpeningPortal}>
            <CreditCard className="mr-2 h-4 w-4" />
            {isOpeningPortal
              ? t('dashboard.billing.actions.opening')
              : t('dashboard.billing.actions.manageBilling')}
          </Button>

          {!isCanceled ? (
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={onCancel}
              disabled={isCanceling}
            >
              {isCanceling
                ? t('dashboard.billing.actions.canceling')
                : t('dashboard.billing.actions.cancel')}
            </Button>
          ) : (
            <Button variant="outline" onClick={onResume} disabled={isResuming}>
              {isResuming
                ? t('dashboard.billing.actions.resuming')
                : t('dashboard.billing.actions.resume')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
