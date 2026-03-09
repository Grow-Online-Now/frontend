/**
 * WorkflowsPage
 * List view for all workflows with filtering
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Workflow, Plus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { WorkflowCard } from '@/components/dashboard/workflows/WorkflowCard'
import { WorkflowFilterTabs, type FilterKey } from '@/components/dashboard/workflows/WorkflowFilterTabs'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { MOCK_WORKFLOWS } from '@/data/workflow-mocks'

export default function WorkflowsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const localizedHref = useLocalizedHref()
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const workflows = MOCK_WORKFLOWS

  const counts = useMemo(
    () => ({
      all: workflows.length,
      active: workflows.filter((w) => w.status === 'active').length,
      paused: workflows.filter((w) => w.status === 'paused').length,
      draft: workflows.filter((w) => w.status === 'draft').length,
    }),
    [workflows]
  )

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? workflows
        : workflows.filter((w) => w.status === activeFilter),
    [workflows, activeFilter]
  )

  const handleOpenWorkflow = useCallback(
    (id: string) => {
      navigate(localizedHref(`/dashboard/workflows/${id}`))
    },
    [navigate, localizedHref]
  )

  return (
    <>
      <PageHeader
        titleKey="dashboard.workflows.title"
        descriptionKey="dashboard.workflows.description"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>{t('dashboard.workflows.newWorkflow')}</span>
          </Button>
        }
      />

      <WorkflowFilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      <div className="mt-6 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Workflow className="h-6 w-6" />}
            titleKey="dashboard.workflows.empty.title"
            descriptionKey="dashboard.workflows.empty.description"
            ctaKey="dashboard.workflows.empty.cta"
          />
        ) : (
          filtered.map((wf, i) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              index={i}
              onClick={handleOpenWorkflow}
            />
          ))
        )}
      </div>
    </>
  )
}
