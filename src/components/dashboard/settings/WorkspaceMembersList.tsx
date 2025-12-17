import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreHorizontal, Loader2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { WorkspaceMember, WorkspaceRole } from '@/types/workspace'

function WorkspaceMembersListComponent() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { isOwner, isPersonalWorkspace } = useWorkspace()
  const { members, isLoading, updateRole, remove, leave } = useWorkspaceMembers()

  const [removingUserId, setRemovingUserId] = useState<string | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  const currentUserId = session?.user?.id

  const handleRoleChange = async (userId: string, newRole: WorkspaceRole) => {
    try {
      await updateRole(userId, newRole)
      toast.success(t('dashboard.workspace.members.roleUpdated'))
    } catch {
      toast.error(t('dashboard.workspace.errors.updateRoleFailed'))
    }
  }

  const handleRemove = async () => {
    if (!memberToRemove) return

    setRemovingUserId(memberToRemove.userId)
    try {
      await remove(memberToRemove.userId)
      toast.success(t('dashboard.workspace.members.removed'))
    } catch {
      toast.error(t('dashboard.workspace.errors.removeFailed'))
    } finally {
      setRemovingUserId(null)
      setMemberToRemove(null)
    }
  }

  const handleLeave = async () => {
    setIsLeaving(true)
    try {
      await leave()
      toast.success(t('dashboard.workspace.members.left'))
    } catch {
      toast.error(t('dashboard.workspace.errors.leaveFailed'))
    } finally {
      setIsLeaving(false)
      setShowLeaveDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId
          const userInitials = (member.user.name || 'U')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

          return (
            <div
              key={member.id}
              className="hover:bg-accent/50 -mx-2 flex items-center gap-3 rounded-lg p-2 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user.image || undefined} alt={member.user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{member.user.name}</p>
                  {isCurrentUser && (
                    <span className="text-muted-foreground text-xs">
                      {t('dashboard.workspace.members.you')}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground truncate text-xs">{member.user.email}</p>
              </div>
              <Badge
                variant={member.role === 'OWNER' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {member.role === 'OWNER'
                  ? t('dashboard.workspace.roles.owner')
                  : t('dashboard.workspace.roles.member')}
              </Badge>

              {/* Actions dropdown - only for owners */}
              {isOwner && !isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleRoleChange(
                          member.userId,
                          member.role === 'OWNER' ? 'MEMBER' : 'OWNER'
                        )
                      }
                    >
                      {member.role === 'OWNER'
                        ? t('dashboard.workspace.members.makeMembers')
                        : t('dashboard.workspace.members.makeOwner')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setMemberToRemove(member)}
                      className="text-destructive focus:text-destructive"
                    >
                      {t('dashboard.workspace.members.remove')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Leave button - for non-owners on non-personal workspaces */}
              {isCurrentUser && !isOwner && !isPersonalWorkspace && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLeaveDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  {t('dashboard.workspace.members.leave')}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Remove Member Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.workspace.members.removeConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.workspace.members.removeConfirmDescription', {
                name: memberToRemove?.user.name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={!!removingUserId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removingUserId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('dashboard.workspace.members.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Workspace Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.workspace.members.leaveConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.workspace.members.leaveConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeave}
              disabled={isLeaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLeaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('dashboard.workspace.members.leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const WorkspaceMembersList = memo(WorkspaceMembersListComponent)
