/**
 * WorkflowStatusFilter Component
 * Status filter tabs for the workflows list
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { WorkflowStatus } from '@/types/automations'

interface WorkflowStatusFilterProps {
  activeStatus: WorkflowStatus | undefined
  onStatusChange: (status: WorkflowStatus | undefined) => void
}

const statuses: { key: WorkflowStatus | undefined; translationKey: string }[] = [
  { key: undefined, translationKey: 'dashboard.automations.filter.all' },
  { key: 'DRAFT', translationKey: 'dashboard.automations.status.draft' },
  { key: 'ACTIVE', translationKey: 'dashboard.automations.status.active' },
  { key: 'PAUSED', translationKey: 'dashboard.automations.status.paused' },
  { key: 'ARCHIVED', translationKey: 'dashboard.automations.status.archived' },
]

export function WorkflowStatusFilter({
  activeStatus,
  onStatusChange,
}: WorkflowStatusFilterProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-6 flex gap-1">
      {statuses.map(({ key, translationKey }) => (
        <button
          key={translationKey}
          type="button"
          onClick={() => onStatusChange(key)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150',
            activeStatus === key
              ? 'bg-bg-elevated text-text-primary border-border border'
              : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-hover'
          )}
        >
          {t(translationKey)}
        </button>
      ))}
    </div>
  )
}
