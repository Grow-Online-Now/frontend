/**
 * EditorTopBar Component
 * Top bar for the workflow editor with name, status, and actions
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkflowStatusBadge } from '../WorkflowStatusBadge'
import type { Workflow, WorkflowStatus } from '@/types/automations'

interface EditorTopBarProps {
  workflow: Workflow
  isSaving: boolean
  onSave: () => void
  onRun: () => void
  onNameChange: (name: string) => void
  onStatusChange: (status: WorkflowStatus) => void
}

export function EditorTopBar({
  workflow,
  isSaving,
  onSave,
  onRun,
  onNameChange,
  onStatusChange,
}: EditorTopBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(workflow.name)

  const handleNameSubmit = () => {
    if (editName.trim()) {
      onNameChange(editName.trim())
    } else {
      setEditName(workflow.name)
    }
    setIsEditing(false)
  }

  const canRun = workflow.status === 'ACTIVE'
  const canActivate = workflow.status === 'DRAFT' || workflow.status === 'PAUSED'

  return (
    <div className="bg-bg-elevated border-border flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => navigate(`/${lang}/dashboard/automations`)}
        >
          <ArrowLeft className="size-4" />
        </Button>

        {isEditing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            className="h-8 w-64"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-text-primary hover:text-text-secondary text-sm font-semibold"
          >
            {workflow.name}
          </button>
        )}

        <WorkflowStatusBadge status={workflow.status} />
      </div>

      <div className="flex items-center gap-2">
        {canActivate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange('ACTIVE')}
          >
            {t('dashboard.automations.editor.activate')}
          </Button>
        )}
        {workflow.status === 'ACTIVE' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange('PAUSED')}
          >
            {t('dashboard.automations.editor.pause')}
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" />
          ) : (
            <Save className="mr-1.5 size-4" />
          )}
          {isSaving
            ? t('dashboard.automations.editor.saving')
            : t('dashboard.automations.editor.save')}
        </Button>

        <Button size="sm" onClick={onRun} disabled={!canRun}>
          <Play className="mr-1.5 size-4" />
          {t('dashboard.automations.editor.run')}
        </Button>
      </div>
    </div>
  )
}
