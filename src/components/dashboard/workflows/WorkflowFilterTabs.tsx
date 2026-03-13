/**
 * WorkflowFilterTabs
 * Horizontal filter tabs for workflow list (All / Active / Paused / Drafts)
 * Uses CSS variable tokens for light/dark theme support.
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { WorkflowStatus } from '@/types/workflow'

type FilterKey = 'all' | WorkflowStatus

interface WorkflowFilterTabsProps {
  activeFilter: FilterKey
  onFilterChange: (filter: FilterKey) => void
  counts: Record<FilterKey, number>
}

const FILTER_TABS: { key: FilterKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'dashboard.workflows.filters.all' },
  { key: 'active', labelKey: 'dashboard.workflows.filters.active' },
  { key: 'paused', labelKey: 'dashboard.workflows.filters.paused' },
  { key: 'draft', labelKey: 'dashboard.workflows.filters.drafts' },
]

export function WorkflowFilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: WorkflowFilterTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-5 flex gap-1">
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-bg-active text-text-primary'
                : 'text-text-tertiary hover:bg-bg-hover hover:text-text-secondary'
            )}
          >
            {t(tab.labelKey)}{' '}
            <span
              className={cn('ml-1 text-xs', isActive ? 'text-text-tertiary' : 'text-text-muted')}
            >
              {counts[tab.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export type { FilterKey }
