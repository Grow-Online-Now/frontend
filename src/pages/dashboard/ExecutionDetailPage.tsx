/**
 * ExecutionDetailPage
 * Shows step-by-step execution results with real-time polling
 */

import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2, Ban } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { ExecutionStatusBadge } from '@/components/dashboard/automations/ExecutionStatusBadge'
import { StepCard } from '@/components/dashboard/automations/executions/StepCard'
import { useExecutionPolling } from '@/hooks/useExecutionPolling'
import { cancelExecution } from '@/services/automations.service'

export default function ExecutionDetailPage() {
  const { executionId } = useParams<{ executionId: string }>()
  const { t } = useTranslation()
  const { execution, isPolling, error } = useExecutionPolling(executionId)

  const handleCancel = async () => {
    if (!executionId) return
    try {
      await cancelExecution(executionId)
      toast.success(t('dashboard.automations.executions.cancelled'))
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t('dashboard.automations.executions.cancelFailed')
      )
    }
  }

  const canCancel =
    execution && (execution.status === 'PENDING' || execution.status === 'RUNNING')

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

  if (!execution && !error) {
    return (
      <div>
        <PageHeader titleKey="dashboard.automations.executions.detailTitle" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader titleKey="dashboard.automations.executions.detailTitle" />
        <p className="text-destructive text-sm">{error}</p>
      </div>
    )
  }

  if (!execution) return null

  return (
    <div>
      <PageHeader
        titleKey="dashboard.automations.executions.detailTitle"
        actions={
          canCancel ? (
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <Ban className="size-4" />
              {t('dashboard.automations.executions.cancel')}
            </Button>
          ) : undefined
        }
      />

      {/* Execution summary */}
      <div className="bg-bg-elevated border-border mb-6 rounded-xl border p-5">
        <div className="flex flex-wrap items-center gap-4">
          <ExecutionStatusBadge status={execution.status} />

          {isPolling && (
            <span className="text-text-muted flex items-center gap-1.5 text-xs">
              <Loader2 className="size-3 animate-spin" />
              {t('dashboard.automations.executions.polling')}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
              {t('dashboard.automations.executions.started')}
            </p>
            <p className="text-text-primary mt-1 text-sm">
              {formatDate(execution.startedAt)}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
              {t('dashboard.automations.executions.completed')}
            </p>
            <p className="text-text-primary mt-1 text-sm">
              {formatDate(execution.completedAt)}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
              {t('dashboard.automations.executions.durationLabel')}
            </p>
            <p className="text-text-primary mt-1 text-sm">
              {getDuration(execution.startedAt, execution.completedAt)}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
              {t('dashboard.automations.executions.steps')}
            </p>
            <p className="text-text-primary mt-1 text-sm">{execution.steps.length}</p>
          </div>
        </div>

        {execution.error && (
          <div className="bg-destructive/5 border-destructive/20 mt-4 rounded-lg border p-3">
            <p className="text-destructive text-sm">{execution.error}</p>
          </div>
        )}
      </div>

      {/* Steps */}
      <h2 className="text-text-primary mb-3 text-lg font-semibold tracking-tight">
        {t('dashboard.automations.executions.stepsTitle')}
      </h2>
      <div className="space-y-2">
        {execution.steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </div>
  )
}
