import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, Loader2 } from 'lucide-react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { InfoHint } from '@/components/dashboard/shared/InfoHint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { WorkspaceMembersList } from './WorkspaceMembersList'
import { InviteMemberModal } from './InviteMemberModal'

function WorkspaceSettingsComponent() {
  const { t } = useTranslation()
  const { currentWorkspace, isOwner, isPersonalWorkspace, updateWorkspace, deleteWorkspace } =
    useWorkspace()

  const [name, setName] = useState(currentWorkspace?.name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  if (!currentWorkspace) return null

  const handleSave = async () => {
    if (!name.trim() || name === currentWorkspace.name) return

    setIsSaving(true)
    try {
      await updateWorkspace(currentWorkspace.id, { name: name.trim() })
      toast.success(t('dashboard.workspace.settings.updateSuccess'))
    } catch {
      toast.error(t('dashboard.workspace.errors.updateFailed'))
      setName(currentWorkspace.name)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteWorkspace(currentWorkspace.id)
      toast.success(t('dashboard.workspace.settings.deleteSuccess'))
    } catch {
      toast.error(t('dashboard.workspace.errors.deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  const canEdit = isOwner
  const canDelete = isOwner && !isPersonalWorkspace

  return (
    <>
      {/* Workspace Info */}
      <DashboardCard titleKey="dashboard.workspace.settings.title" className="mb-6">
        <InfoHint textKey="dashboard.hints.settings.workspace" variant="tip" className="mb-6" />
        <div className="space-y-5">
          {/* Workspace Icon & Info */}
          <div className="border-border-subtle flex items-center gap-4 border-b pb-5">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-xl">
              <Building2 className="text-primary h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-base font-medium">{currentWorkspace.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                  {currentWorkspace.slug}
                </code>
                {isPersonalWorkspace && (
                  <Badge variant="secondary" className="text-xs">
                    {t('dashboard.workspace.selector.personal')}
                  </Badge>
                )}
                <Badge variant={isOwner ? 'default' : 'secondary'} className="text-xs">
                  {isOwner
                    ? t('dashboard.workspace.roles.owner')
                    : t('dashboard.workspace.roles.member')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="workspace-name" className="text-muted-foreground text-sm font-medium">
              {t('dashboard.workspace.settings.nameLabel')}
            </Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canEdit || isSaving}
              className="rounded-lg"
            />
          </div>

          {/* Slug (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="workspace-slug" className="text-muted-foreground text-sm font-medium">
              {t('dashboard.workspace.settings.slugLabel')}
            </Label>
            <Input
              id="workspace-slug"
              value={currentWorkspace.slug}
              disabled
              className="rounded-lg"
            />
            <p className="text-muted-foreground text-xs">
              {t('dashboard.workspace.settings.slugHint')}
            </p>
          </div>

          {canEdit && (
            <div className="pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !name.trim() || name === currentWorkspace.name}
                className="rounded-lg"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving
                  ? t('dashboard.workspace.settings.saving')
                  : t('dashboard.workspace.settings.save')}
              </Button>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Members Section */}
      <DashboardCard titleKey="dashboard.workspace.members.title" className="mb-6">
        <InfoHint textKey="dashboard.hints.settings.members" variant="tip" className="mb-6" />
        <WorkspaceMembersList />
        {isOwner && (
          <div className="border-border-subtle mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
              {t('dashboard.workspace.members.invite')}
            </Button>
          </div>
        )}
      </DashboardCard>

      {/* Danger Zone - Delete Workspace */}
      {canDelete && (
        <DashboardCard className="border-destructive/20 bg-destructive/[0.03]">
          <h3 className="text-destructive mb-2 text-base font-semibold tracking-tight">
            {t('dashboard.workspace.settings.delete.title')}
          </h3>
          <p className="text-destructive/70 mb-4 text-sm leading-relaxed">
            {t('dashboard.workspace.settings.delete.description')}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="rounded-lg" disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('dashboard.workspace.settings.delete.button')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('dashboard.workspace.settings.delete.confirmTitle')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('dashboard.workspace.settings.delete.confirmDescription', {
                    name: currentWorkspace.name,
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('dashboard.workspace.settings.delete.button')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DashboardCard>
      )}

      <InviteMemberModal open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} />
    </>
  )
}

export const WorkspaceSettings = memo(WorkspaceSettingsComponent)
