import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface CreateWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CreateWorkspaceModalComponent({ open, onOpenChange }: CreateWorkspaceModalProps) {
  const { t } = useTranslation()
  const { createWorkspace } = useWorkspace()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError(t('dashboard.workspace.create.errors.nameRequired'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createWorkspace({
        name: name.trim(),
        slug: slug.trim() || undefined,
      })
      toast.success(t('dashboard.workspace.create.success'))
      onOpenChange(false)
      setName('')
      setSlug('')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('dashboard.workspace.errors.createFailed')
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      setName('')
      setSlug('')
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{t('dashboard.workspace.create.title')}</DialogTitle>
          <DialogDescription>{t('dashboard.workspace.create.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">{t('dashboard.workspace.create.nameLabel')}</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('dashboard.workspace.create.namePlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-slug">{t('dashboard.workspace.create.slugLabel')}</Label>
            <Input
              id="workspace-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder={t('dashboard.workspace.create.slugPlaceholder')}
              disabled={isLoading}
            />
            <p className="text-muted-foreground text-xs">
              {t('dashboard.workspace.create.slugHint')}
            </p>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('dashboard.workspace.create.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const CreateWorkspaceModal = memo(CreateWorkspaceModalComponent)
