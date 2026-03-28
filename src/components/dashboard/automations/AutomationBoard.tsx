import type { Automation, AutomationStatus } from '@/types/automation'
import { AutomationBoardColumn } from './AutomationBoardColumn'

interface AutomationBoardProps {
  automations: Automation[]
  onRetry: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onClick: (id: string) => void
}

const COLUMN_ORDER: AutomationStatus[] = ['active', 'paused']
const FAILED_STATUS = 'failed'

export function AutomationBoard({
  automations,
  onRetry,
  onPause,
  onResume,
  onClick,
}: AutomationBoardProps) {
  const grouped = automations.reduce<Record<string, Automation[]>>(
    (acc, a) => {
      // Map any non-standard status to a column
      const key =
        a.status === 'active'
          ? 'active'
          : a.status === 'paused' || a.status === 'draft'
            ? 'paused'
            : 'failed'

      // Check if has recent failures — override to failed column
      const hasRecentFailures =
        a.runs?.some((r) => r.status === 'failed') && a.status !== 'active'

      const finalKey = hasRecentFailures && key === 'paused' ? 'failed' : key

      if (!acc[finalKey]) acc[finalKey] = []
      acc[finalKey].push(a)
      return acc
    },
    { active: [], failed: [], paused: [] }
  )

  return (
    <div className="mt-6 flex gap-4">
      <AutomationBoardColumn
        status="active"
        automations={grouped.active}
        onRetry={onRetry}
        onPause={onPause}
        onResume={onResume}
        onClick={onClick}
      />
      <AutomationBoardColumn
        status={FAILED_STATUS as AutomationStatus}
        automations={grouped.failed}
        onRetry={onRetry}
        onPause={onPause}
        onResume={onResume}
        onClick={onClick}
      />
      <AutomationBoardColumn
        status={COLUMN_ORDER[1]}
        automations={grouped.paused}
        onRetry={onRetry}
        onPause={onPause}
        onResume={onResume}
        onClick={onClick}
      />
    </div>
  )
}
