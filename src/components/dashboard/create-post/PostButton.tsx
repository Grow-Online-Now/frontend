/**
 * PostButton Component
 * Smart CTA with status dropdown showing per-platform readiness
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Check, AlertTriangle, X, Loader2 } from 'lucide-react'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { SocialPlatform, Connection } from '@/types/connections'
import type { ScheduleType } from '@/types/posts'

type PlatformStatus = 'ready' | 'warning' | 'error'

interface PlatformValidation {
  platform: SocialPlatform
  status: PlatformStatus
  message?: string
}

interface PostButtonProps {
  scheduleType: ScheduleType
  selectedAccounts: Connection[]
  validations: PlatformValidation[]
  isSubmitting: boolean
  onSubmit: () => void
  className?: string
}

export function PostButton({
  scheduleType,
  selectedAccounts,
  validations,
  isSubmitting,
  onSubmit,
  className,
}: PostButtonProps) {
  const { t } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const readyCount = validations.filter((v) => v.status === 'ready').length
  const hasErrors = validations.some((v) => v.status === 'error')
  const hasWarnings = validations.some((v) => v.status === 'warning')
  const isDisabled = selectedAccounts.length === 0 || hasErrors || isSubmitting

  const getButtonLabel = () => {
    if (isSubmitting) return t('dashboard.common.loading')

    switch (scheduleType) {
      case 'draft':
        return t('dashboard.createPost.actions.saveDraft')
      case 'scheduled':
        return selectedAccounts.length > 0
          ? t('dashboard.createPost.postButton.scheduleCount', { count: selectedAccounts.length })
          : t('dashboard.createPost.actions.schedule')
      default:
        return selectedAccounts.length > 0
          ? t('dashboard.createPost.postButton.postCount', { count: selectedAccounts.length })
          : t('dashboard.createPost.actions.postNow')
    }
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() =>
          selectedAccounts.length > 0 ? setIsDropdownOpen(!isDropdownOpen) : onSubmit()
        }
        disabled={isDisabled}
        className={cn(
          'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all',
          !isDisabled &&
            !hasWarnings &&
            'from-primary to-primary/90 bg-gradient-to-r hover:-translate-y-px hover:shadow-lg',
          !isDisabled && hasWarnings && 'from-warning to-warning/90 bg-gradient-to-r',
          isDisabled && 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>{getButtonLabel()}</span>
            {selectedAccounts.length > 0 && <ChevronDown className="h-4 w-4" />}
          </>
        )}
      </button>

      {/* Dropdown */}
      {isDropdownOpen && selectedAccounts.length > 0 && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

          <div className="bg-card border-border-subtle absolute top-full right-0 z-50 mt-2 w-72 rounded-xl border p-3 shadow-xl">
            <p className="text-muted-foreground mb-3 text-[11px] font-medium tracking-wide uppercase">
              {t('dashboard.createPost.postButton.readyToPost')}
            </p>

            <div className="space-y-1">
              {validations.map((validation) => (
                <div
                  key={validation.platform}
                  className="flex items-center gap-2.5 rounded-lg py-2"
                >
                  <PlatformIcon platform={validation.platform} size="xs" showBackground />
                  <span className="text-foreground flex-1 text-sm">
                    {t(`dashboard.accounts.platforms.${validation.platform}`)}
                  </span>
                  <StatusBadge status={validation.status} message={validation.message} />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="border-border-subtle mt-3 flex gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false)
                  onSubmit()
                }}
                disabled={readyCount === 0}
                className={cn(
                  'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
                  readyCount > 0
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                {scheduleType === 'draft'
                  ? t('dashboard.createPost.actions.saveDraft')
                  : scheduleType === 'scheduled'
                    ? t('dashboard.createPost.postButton.scheduleReady', { count: readyCount })
                    : t('dashboard.createPost.postButton.postReady', { count: readyCount })}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status, message }: { status: PlatformStatus; message?: string }) {
  const { t } = useTranslation()

  const config = {
    ready: {
      icon: Check,
      label: t('dashboard.createPost.postButton.status.ready'),
      className: 'text-success',
    },
    warning: {
      icon: AlertTriangle,
      label: message || t('dashboard.createPost.postButton.status.warning'),
      className: 'text-warning',
    },
    error: {
      icon: X,
      label: message || t('dashboard.createPost.postButton.status.error'),
      className: 'text-destructive',
    },
  }

  const { icon: Icon, label, className } = config[status]

  return (
    <span className={cn('flex items-center gap-1 text-xs font-medium', className)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
