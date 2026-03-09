/**
 * EditorHeader
 * Top bar for the workflow editor — uses CSS variable tokens.
 * Always rendered inside a .dark wrapper so tokens resolve to dark values.
 */

import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, Play, Loader2, Save, Power } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkflowStatusBadge } from '../WorkflowStatusBadge'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { WorkflowStatus } from '@/types/workflow'

interface EditorHeaderProps {
  onBack: () => void
}

export function EditorHeader({ onBack }: EditorHeaderProps) {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const isRunning = useWorkflowEditorStore((s) => s.isRunning)
  const isSaving = useWorkflowEditorStore((s) => s.isSaving)
  const isDirty = useWorkflowEditorStore((s) => s.isDirty)
  const saveWorkflow = useWorkflowEditorStore((s) => s.saveWorkflow)
  const runWorkflow = useWorkflowEditorStore((s) => s.runWorkflow)
  const setWorkflowStatus = useWorkflowEditorStore((s) => s.setWorkflowStatus)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)

  const handleSave = useCallback(async () => {
    try {
      await saveWorkflow()
      toast.success(t('dashboard.workflows.editor.toasts.saved'))
    } catch {
      toast.error(t('dashboard.workflows.editor.toasts.saveFailed'))
    }
  }, [saveWorkflow, t])

  const handleRun = useCallback(async () => {
    try {
      const run = await runWorkflow()
      if (run?.status === 'success') {
        toast.success(t('dashboard.workflows.editor.toasts.runSuccess'))
      } else if (run?.status === 'failed') {
        toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
      }
    } catch {
      toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
    }
  }, [runWorkflow, t])

  const handleToggleStatus = useCallback(async () => {
    if (!workflow || isTogglingStatus) return
    const nextStatus: Record<WorkflowStatus, WorkflowStatus> = {
      draft: 'active',
      active: 'paused',
      paused: 'active',
    }
    try {
      setIsTogglingStatus(true)
      await setWorkflowStatus(nextStatus[workflow.status])
      toast.success(t(`dashboard.workflows.editor.toasts.status.${nextStatus[workflow.status]}`))
    } catch {
      toast.error(t('dashboard.workflows.editor.toasts.statusFailed'))
    } finally {
      setIsTogglingStatus(false)
    }
  }, [workflow, isTogglingStatus, setWorkflowStatus, t])

  if (!workflow) return null

  const triggerLabel = t(
    `dashboard.workflows.card.trigger${workflow.triggerType.charAt(0).toUpperCase() + workflow.triggerType.slice(1)}`
  )

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border-subtle bg-bg-subtle px-5 py-2.5">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border-subtle bg-bg-elevated text-text-tertiary transition-all duration-150 hover:bg-bg-hover hover:text-text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <div>
          <div className="text-sm font-semibold tracking-tight text-text-primary">
            {t(workflow.name, { defaultValue: workflow.name })}
          </div>
          <div className="text-xs text-text-muted">
            {triggerLabel}
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={isTogglingStatus || isRunning}
          className="group flex items-center gap-1.5 transition-opacity duration-150 disabled:opacity-40"
          title={t(`dashboard.workflows.editor.statusToggle.${workflow.status}`)}
        >
          <WorkflowStatusBadge status={workflow.status} className="cursor-pointer group-hover:opacity-80" />
          <Power className="h-3 w-3 text-text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-150 disabled:opacity-40',
            isDirty
              ? 'border-warning/40 bg-bg-elevated text-text-primary shadow-[0_0_8px_rgba(245,158,11,0.25)] hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]'
              : 'border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-default hover:bg-bg-hover'
          )}
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isSaving
            ? t('dashboard.workflows.editor.saving')
            : t('dashboard.workflows.editor.save')}
        </button>
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning || workflow.status === 'draft'}
          className={
            isRunning
              ? 'flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-150 hover:bg-bg-hover disabled:opacity-40'
              : 'flex items-center gap-1.5 rounded-md border border-transparent bg-text-primary px-3 py-1.5 text-xs font-medium text-bg-base transition-all duration-150 hover:opacity-90 disabled:opacity-40'
          }
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('dashboard.workflows.editor.running')}
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              {t('dashboard.workflows.editor.run')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
