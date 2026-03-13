/**
 * EditorHeader
 * Top bar for the workflow editor — uses CSS variable tokens.
 * Always rendered inside a .dark wrapper so tokens resolve to dark values.
 * Includes view mode toggle (editor/execution) and running indicator.
 */

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, Play, Loader2, Save, Power, Pencil, StepForward, Eye } from 'lucide-react'
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
  const stepByStepMode = useWorkflowEditorStore((s) => s.stepByStepMode)
  const activeRun = useWorkflowEditorStore((s) => s.activeRun)
  const viewMode = useWorkflowEditorStore((s) => s.viewMode)
  const saveWorkflow = useWorkflowEditorStore((s) => s.saveWorkflow)
  const runWorkflow = useWorkflowEditorStore((s) => s.runWorkflow)
  const renameWorkflow = useWorkflowEditorStore((s) => s.renameWorkflow)
  const setWorkflowStatus = useWorkflowEditorStore((s) => s.setWorkflowStatus)
  const setStepByStepMode = useWorkflowEditorStore((s) => s.setStepByStepMode)
  const stepNode = useWorkflowEditorStore((s) => s.stepNode)
  const setViewMode = useWorkflowEditorStore((s) => s.setViewMode)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const startEditing = useCallback(() => {
    if (!workflow) return
    setEditValue(workflow.name)
    setIsEditing(true)
    requestAnimationFrame(() => inputRef.current?.select())
  }, [workflow])

  const commitRename = useCallback(async () => {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === workflow?.name) {
      setIsEditing(false)
      return
    }
    try {
      await renameWorkflow(trimmed)
      toast.success(t('dashboard.workflows.editor.toasts.renamed'))
    } catch {
      toast.error(t('dashboard.workflows.editor.toasts.renameFailed'))
    }
    setIsEditing(false)
  }, [editValue, workflow?.name, renameWorkflow, t])

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
      if (stepByStepMode && activeRun?.status === 'paused') {
        // Continue paused run: find first pending step
        const pendingStep = activeRun.steps.find((s) => s.status === 'pending')
        if (pendingStep) {
          await stepNode(activeRun.id, pendingStep.nodeId)
          return
        }
      }

      // Start a new run (non-blocking — polling handles updates)
      await runWorkflow()
    } catch {
      toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
    }
  }, [runWorkflow, stepNode, stepByStepMode, activeRun, t])

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

  const runLabel = stepByStepMode
    ? t('dashboard.workflows.editor.step')
    : isRunning
      ? t('dashboard.workflows.editor.running')
      : t('dashboard.workflows.editor.run')

  return (
    <div className="border-border-subtle bg-bg-subtle flex shrink-0 items-center justify-between border-b px-5 py-2.5">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onBack}
          className="border-border-subtle bg-bg-elevated text-text-tertiary hover:bg-bg-hover hover:text-text-secondary flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-150"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <div>
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              className="border-border-emphasis bg-bg-elevated text-text-primary focus:border-border-focus h-6 w-48 rounded-md border px-1.5 text-sm font-semibold tracking-tight outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="group/name flex items-center gap-1.5"
            >
              <span className="text-text-primary text-sm font-semibold tracking-tight">
                {t(workflow.name, { defaultValue: workflow.name })}
              </span>
              <Pencil className="text-text-muted h-3 w-3 opacity-0 transition-opacity duration-150 group-hover/name:opacity-100" />
            </button>
          )}
          <div className="text-text-muted text-xs">{triggerLabel}</div>
        </div>
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={isTogglingStatus || isRunning}
          className="group flex items-center gap-1.5 transition-opacity duration-150 disabled:opacity-40"
          title={t(`dashboard.workflows.editor.statusToggle.${workflow.status}`)}
        >
          <WorkflowStatusBadge
            status={workflow.status}
            className="cursor-pointer group-hover:opacity-80"
          />
          <Power className="text-text-muted h-3 w-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        </button>

        {/* Running indicator */}
        {isRunning && (
          <div className="flex items-center gap-1.5">
            <div className="bg-info h-2 w-2 animate-pulse rounded-full" />
            <span className="text-info text-[10px] font-medium">
              {t('dashboard.workflows.editor.running')}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* View mode segmented control */}
        <div className="border-border-subtle bg-bg-elevated flex rounded-lg border">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={cn(
              'flex items-center gap-1.5 rounded-l-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150',
              viewMode === 'editor'
                ? 'bg-bg-active text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <Pencil className="h-3 w-3" />
            {t('dashboard.workflows.execution.editorMode')}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('execution')}
            className={cn(
              'border-border-subtle flex items-center gap-1.5 rounded-r-lg border-l px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150',
              viewMode === 'execution'
                ? 'bg-bg-active text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <Eye className="h-3 w-3" />
            {t('dashboard.workflows.execution.executionMode')}
          </button>
        </div>

        {/* Step-by-step toggle */}
        <button
          type="button"
          onClick={() => setStepByStepMode(!stepByStepMode)}
          className={cn(
            'flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11px] font-medium transition-all duration-150',
            stepByStepMode
              ? 'border-info/40 bg-info-muted text-info'
              : 'border-border-subtle bg-bg-elevated text-text-muted hover:border-border-default hover:text-text-secondary'
          )}
          title={t('dashboard.workflows.editor.stepByStep')}
        >
          <StepForward className="h-3.5 w-3.5" />
        </button>

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
          {isSaving ? t('dashboard.workflows.editor.saving') : t('dashboard.workflows.editor.save')}
        </button>
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning || workflow.status === 'draft'}
          className={
            isRunning
              ? 'border-border-subtle bg-bg-elevated text-text-secondary hover:bg-bg-hover flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-150 disabled:opacity-40'
              : 'bg-text-primary text-bg-base flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium transition-all duration-150 hover:opacity-90 disabled:opacity-40'
          }
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('dashboard.workflows.editor.running')}
            </>
          ) : (
            <>
              {stepByStepMode ? (
                <StepForward className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {runLabel}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
