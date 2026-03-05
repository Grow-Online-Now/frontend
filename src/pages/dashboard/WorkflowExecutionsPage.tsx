/**
 * WorkflowExecutionsPage
 * Shows execution history for a workflow and allows running new executions
 */

import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Play, History } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/components/common/LocalizedLink'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import { ExecutionStatusBadge } from '@/components/dashboard/automations/ExecutionStatusBadge'
import { TriggerDataDialog } from '@/components/dashboard/automations/executions/TriggerDataDialog'
import { useWorkflow } from '@/hooks/useWorkflow'
import { useWorkflowExecutions } from '@/hooks/useWorkflowExecutions'
import { executeWorkflow } from '@/services/automations.service'

export default function WorkflowExecutionsPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { workflow } = useWorkflow(id)
  const { executions, isLoading, error, refetch } = useWorkflowExecutions(id)
  const [isTriggerOpen, setIsTriggerOpen] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleExecute = useCallback(
    async (triggerData: Record<string, unknown>) => {
      if (!id) return
      setIsExecuting(true)
      try {
        await executeWorkflow(id, { triggerData })
        toast.success(t('dashboard.automations.executions.executionStarted'))
        setIsTriggerOpen(false)
        refetch()
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('dashboard.automations.executions.executionFailed')
        )
      } finally {
        setIsExecuting(false)
      }
    },
    [id, refetch, t]
  )

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleString()
  }

  const getDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return '-'
    const ms = new Date(end).getTime() - new Date(start).getTime()
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader titleKey="dashboard.automations.executions.title" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader titleKey="dashboard.automations.executions.title" />
        <ErrorAlert message={error} />
      </div>
    )
  }

  const canRun = workflow?.status === 'ACTIVE'

  return (
    <div>
      <PageHeader
        titleKey="dashboard.automations.executions.title"
        descriptionKey="dashboard.automations.executions.description"
        actions={
          <Button
            onClick={() => setIsTriggerOpen(true)}
            disabled={!canRun}
            className="gap-2"
          >
            <Play className="size-4" />
            {t('dashboard.automations.executions.run')}
          </Button>
        }
      />

      {workflow && (
        <p className="text-text-secondary mb-6 -mt-4 text-sm">
          {workflow.name}
        </p>
      )}

      {executions.length === 0 ? (
        <EmptyState
          icon={<History />}
          titleKey="dashboard.automations.executions.empty.title"
          descriptionKey="dashboard.automations.executions.empty.description"
          ctaKey={canRun ? 'dashboard.automations.executions.run' : undefined}
          onCtaClick={canRun ? () => setIsTriggerOpen(true) : undefined}
        />
      ) : (
        <div className="space-y-2">
          {executions.map((execution) => (
            <Link
              key={execution.id}
              to={`/dashboard/automations/executions/${execution.id}`}
              className="bg-bg-elevated border-border hover:border-border-emphasis flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-150"
            >
              <ExecutionStatusBadge status={execution.status} />
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium">
                  {formatDate(execution.createdAt)}
                </p>
                <p className="text-text-muted text-xs">
                  {t('dashboard.automations.executions.stepsCount', {
                    count: execution.steps.length,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-xs">
                  {getDuration(execution.startedAt, execution.completedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <TriggerDataDialog
        open={isTriggerOpen}
        onOpenChange={setIsTriggerOpen}
        onExecute={handleExecute}
        isExecuting={isExecuting}
      />
    </div>
  )
}
