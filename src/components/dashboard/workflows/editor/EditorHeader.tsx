/**
 * EditorHeader
 * Top bar for the workflow editor with back button, name, status, and run action
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkflowStatusBadge } from '../WorkflowStatusBadge'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

interface EditorHeaderProps {
  onBack: () => void
}

export function EditorHeader({ onBack }: EditorHeaderProps) {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const isRunning = useWorkflowEditorStore((s) => s.isRunning)
  const setRunning = useWorkflowEditorStore((s) => s.setRunning)

  const handleRun = useCallback(() => {
    setRunning(true)
    setTimeout(() => setRunning(false), 3000)
  }, [setRunning])

  if (!workflow) return null

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-6 py-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-border-subtle bg-bg-elevated text-sm text-muted-foreground transition-all duration-150 hover:bg-bg-hover hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <div className="text-md font-semibold tracking-tight text-foreground">
            {workflow.name}
          </div>
          <div className="text-xs text-muted-foreground">{workflow.trigger}</div>
        </div>
        <WorkflowStatusBadge status={workflow.status} />
      </div>

      <div className="flex items-center gap-3">
        {workflow.lastRun && (
          <span className="text-xs text-muted-foreground">
            {t('dashboard.workflows.editor.lastRun', { time: workflow.lastRun })}
          </span>
        )}
        <Button
          onClick={handleRun}
          disabled={isRunning}
          variant={isRunning ? 'outline' : 'default'}
          size="sm"
          className="gap-1.5"
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
        </Button>
      </div>
    </div>
  )
}
