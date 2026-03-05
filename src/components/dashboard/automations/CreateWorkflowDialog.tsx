/**
 * CreateWorkflowDialog Component
 * Dialog for creating a new workflow
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createWorkflow } from '@/services/automations.service'

interface CreateWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function CreateWorkflowDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateWorkflowDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    setError(null)

    try {
      const workflow = await createWorkflow({
        name: name.trim(),
        description: description.trim() || undefined,
        definition: { nodes: [], edges: [] },
      })
      onOpenChange(false)
      onCreated?.()
      setName('')
      setDescription('')
      navigate(`/${lang}/dashboard/automations/${workflow.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workflow')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.automations.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.automations.createDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">
                {t('dashboard.automations.createDialog.nameLabel')}
              </Label>
              <Input
                id="workflow-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('dashboard.automations.createDialog.namePlaceholder')}
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">
                {t('dashboard.automations.createDialog.descriptionLabel')}
              </Label>
              <Input
                id="workflow-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t(
                  'dashboard.automations.createDialog.descriptionPlaceholder'
                )}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim() || isCreating}>
              {isCreating
                ? t('dashboard.automations.createDialog.creating')
                : t('dashboard.automations.createDialog.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
