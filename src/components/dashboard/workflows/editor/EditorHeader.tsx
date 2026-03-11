/**
 * EditorHeader
 * Top bar for the workflow editor — uses CSS variable tokens.
 * Always rendered inside a .dark wrapper so tokens resolve to dark values.
 */

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, Play, Loader2, Save, Power, Pencil, StepForward } from 'lucide-react'
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
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)
  const saveWorkflow = useWorkflowEditorStore((s) => s.saveWorkflow)
  const runWorkflow = useWorkflowEditorStore((s) => s.runWorkflow)
  const renameWorkflow = useWorkflowEditorStore((s) => s.renameWorkflow)
  const setWorkflowStatus = useWorkflowEditorStore((s) => s.setWorkflowStatus)
  const setStepByStepMode = useWorkflowEditorStore((s) => s.setStepByStepMode)
  const stepNode = useWorkflowEditorStore((s) => s.stepNode)
  const runFromNode = useWorkflowEditorStore((s) => s.runFromNode)
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
      if (stepByStepMode && lastRun?.status === 'paused') {
        // Continue paused run: find first pending step
        const pendingStep = lastRun.steps.find((s) => s.status === 'pending')
        if (pendingStep) {
          const run = await stepNode(lastRun.id, pendingStep.nodeId)
          if (run?.status === 'success') {
            toast.success(t('dashboard.workflows.editor.toasts.runSuccess'))
          } else if (run?.status === 'failed') {
            toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
          }
          return
        }
      }

      if (stepByStepMode && workflow) {
        // Start fresh step-by-step: run the entire workflow but stop after first non-trigger node
        // For the first step, we do a full run then the user can step through from the paused run
        const run = await runWorkflow()
        if (run?.status === 'success') {
          toast.success(t('dashboard.workflows.editor.toasts.runSuccess'))
        } else if (run?.status === 'failed') {
          toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
        }
        return
      }

      const run = await runWorkflow()
      if (run?.status === 'success') {
        toast.success(t('dashboard.workflows.editor.toasts.runSuccess'))
      } else if (run?.status === 'failed') {
        toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
      }
    } catch {
      toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
    }
  }, [runWorkflow, stepNode, runFromNode, stepByStepMode, lastRun, workflow, t])

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

  const showStepButton = stepByStepMode && lastRun?.status === 'paused'
  const runLabel = showStepButton
    ? t('dashboard.workflows.editor.step')
    : stepByStepMode
      ? t('dashboard.workflows.editor.step')
      : isRunning
        ? t('dashboard.workflows.editor.running')
        : t('dashboard.workflows.editor.run')

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
              className="h-6 w-48 rounded-md border border-border-emphasis bg-bg-elevated px-1.5 text-sm font-semibold tracking-tight text-text-primary outline-none focus:border-border-focus"
            />
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="group/name flex items-center gap-1.5"
            >
              <span className="text-sm font-semibold tracking-tight text-text-primary">
                {t(workflow.name, { defaultValue: workflow.name })}
              </span>
              <Pencil className="h-3 w-3 text-text-muted opacity-0 transition-opacity duration-150 group-hover/name:opacity-100" />
            </button>
          )}
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
        {/* Step-by-step toggle */}
        <button
          type="button"
          onClick={() => setStepByStepMode(!stepByStepMode)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-150',
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
