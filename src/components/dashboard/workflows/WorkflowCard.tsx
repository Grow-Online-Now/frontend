/**
 * WorkflowCard
 * Card displaying workflow summary in the list view.
 * Uses CSS variable tokens for light/dark theme support.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, MoreHorizontal, Clock, Link, Layers, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'
import type { Workflow } from '@/types/workflow'

interface WorkflowCardProps {
  workflow: Workflow
  index?: number
  onClick: (id: string) => void
  onDelete?: (id: string) => Promise<boolean>
  onRename?: (id: string, name: string) => Promise<boolean>
}

export function WorkflowCard({ workflow, onClick, onDelete, onRename }: WorkflowCardProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const triggerIcon =
    workflow.triggerType === 'cron' ? (
      <Clock className="h-3 w-3" />
    ) : workflow.triggerType === 'webhook' ? (
      <Link className="h-3 w-3" />
    ) : (
      <Play className="h-3 w-3" />
    )

  const triggerLabel = t(
    `dashboard.workflows.card.trigger${workflow.triggerType.charAt(0).toUpperCase() + workflow.triggerType.slice(1)}`
  )

  const startEditing = useCallback(() => {
    setEditValue(workflow.name)
    setIsEditing(true)
  }, [workflow.name])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select()
    }
  }, [isEditing])

  const commitRename = useCallback(async () => {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === workflow.name) {
      setIsEditing(false)
      return
    }
    await onRename?.(workflow.id, trimmed)
    setIsEditing(false)
  }, [editValue, workflow.name, workflow.id, onRename])

  return (
    <div
      onClick={() => !isEditing && onClick(workflow.id)}
      className="cursor-pointer rounded-xl border border-border-subtle bg-bg-elevated p-5 transition-all duration-150 hover:border-border-default hover:bg-bg-hover"
    >
      {/* Row 1: Name + status + actions */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
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
              onClick={(e) => e.stopPropagation()}
              className="h-7 w-48 rounded-md border border-border-emphasis bg-bg-elevated px-2 text-md font-semibold tracking-tight text-text-primary outline-none focus:border-border-focus"
            />
          ) : (
            <span className="text-md font-semibold tracking-tight text-text-primary">
              {t(workflow.name, { defaultValue: workflow.name })}
            </span>
          )}
          <WorkflowStatusBadge status={workflow.status} />
        </div>
        <div className="flex items-center gap-2">
          {workflow.status !== 'draft' && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-150 hover:border-border-default hover:bg-bg-hover"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="h-3 w-3" />
              {t('dashboard.workflows.card.run')}
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-1 text-text-muted transition-colors duration-150 hover:text-text-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={startEditing}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('dashboard.workflows.card.rename')}
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(workflow.id)}
                  className="text-error focus:text-error"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('dashboard.workflows.card.delete')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2: Description */}
      {workflow.description && (
        <p className="mb-4 text-sm leading-relaxed text-text-tertiary">
          {workflow.description}
        </p>
      )}

      {/* Row 3: Metadata */}
      <div className="flex items-center gap-5 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          {triggerIcon}
          {triggerLabel}
        </span>
        <span className="text-border-emphasis">·</span>
        <span className="flex items-center gap-1.5">
          <Layers className="h-3 w-3" />
          {t('dashboard.workflows.card.nodes', { count: workflow.nodes.length })}
        </span>
      </div>
    </div>
  )
}
