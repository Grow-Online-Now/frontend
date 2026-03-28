import { useTranslation } from 'react-i18next'
import type { Automation, AutomationStatus } from '@/types/automation'
import { AutomationBoardCard } from './AutomationBoardCard'

interface AutomationBoardColumnProps {
  status: AutomationStatus
  automations: Automation[]
  onRetry: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onClick: (id: string) => void
}

const statusConfig: Record<
  string,
  { dotClass: string; labelKey: string }
> = {
  active: {
    dotClass: 'bg-success',
    labelKey: 'dashboard.automations.status.active',
  },
  failed: {
    dotClass: 'bg-error',
    labelKey: 'dashboard.automations.runStatus.failed',
  },
  paused: {
    dotClass: 'bg-warning',
    labelKey: 'dashboard.automations.status.paused',
  },
}

export function AutomationBoardColumn({
  status,
  automations,
  onRetry,
  onPause,
  onResume,
  onClick,
}: AutomationBoardColumnProps) {
  const { t } = useTranslation()
  const config = statusConfig[status] || statusConfig.active

  return (
    <div className="bg-bg-subtle border-border-default min-w-0 flex-1 rounded-xl border">
      {/* Column header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
          <h3 className="text-text-primary text-sm font-semibold">
            {t(config.labelKey)}
          </h3>
        </div>
        {automations.length > 0 && (
          <span className="bg-bg-hover text-text-muted flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs">
            {automations.length}
          </span>
        )}
      </div>

      <div className="border-border-default border-t" />

      {/* Cards — scrollable within viewport */}
      <div className="max-h-[calc(100vh-13rem)] overflow-y-auto p-3">
        <div className="space-y-3">
          {automations.map((automation) => (
            <AutomationBoardCard
              key={automation.id}
              automation={automation}
              onRetry={() => onRetry(automation.id)}
              onPause={() => onPause(automation.id)}
              onResume={() => onResume(automation.id)}
              onClick={() => onClick(automation.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
