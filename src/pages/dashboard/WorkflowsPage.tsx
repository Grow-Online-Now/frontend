/**
 * WorkflowsPage
 * List view for all workflows with filtering.
 * Uses CSS variable tokens for light/dark theme support.
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Workflow, Plus, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { WorkflowCard } from '@/components/dashboard/workflows/WorkflowCard'
import { WorkflowFilterTabs, type FilterKey } from '@/components/dashboard/workflows/WorkflowFilterTabs'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { useWorkflows } from '@/hooks/useWorkflows'
import { Skeleton } from '@/components/ui/skeleton'

export default function WorkflowsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const localizedHref = useLocalizedHref()
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const {
    workflows,
    isLoading,
    counts,
    createWorkflow,
    deleteWorkflow,
    setFilter,
  } = useWorkflows()

  const handleFilterChange = useCallback(
    (f: FilterKey) => {
      setActiveFilter(f)
      setFilter(f)
    },
    [setFilter]
  )

  const handleOpenWorkflow = useCallback(
    (id: string) => {
      navigate(localizedHref(`/dashboard/workflows/${id}`))
    },
    [navigate, localizedHref]
  )

  const [isCreating, setIsCreating] = useState(false)

  const handleCreateWorkflow = useCallback(async () => {
    setIsCreating(true)
    const wf = await createWorkflow({
      name: t('dashboard.workflows.newWorkflowDefault'),
      triggerType: 'manual',
    })
    setIsCreating(false)
    if (wf) {
      navigate(localizedHref(`/dashboard/workflows/${wf.id}`))
    }
  }, [createWorkflow, navigate, localizedHref, t])

  return (
    <>
      <PageHeader
        titleKey="dashboard.workflows.title"
        descriptionKey="dashboard.workflows.description"
        actions={
          <Button className="gap-2" onClick={handleCreateWorkflow} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>{t('dashboard.workflows.newWorkflow')}</span>
          </Button>
        }
      />

      <WorkflowFilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        counts={counts}
      />

      <div className="mt-6 flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))
        ) : workflows.length === 0 ? (
          <EmptyState
            icon={<Workflow className="h-6 w-6" />}
            titleKey="dashboard.workflows.empty.title"
            descriptionKey="dashboard.workflows.empty.description"
            ctaKey="dashboard.workflows.empty.cta"
            onCtaClick={handleCreateWorkflow}
          />
        ) : (
          workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onClick={handleOpenWorkflow}
              onDelete={deleteWorkflow}
            />
          ))
        )}
      </div>
    </>
  )
}
