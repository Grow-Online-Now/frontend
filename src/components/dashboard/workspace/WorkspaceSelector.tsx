import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Check, Plus, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/hooks/useWorkspace'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'

function getWorkspaceInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface WorkspaceAvatarProps {
  name: string
  size?: 'sm' | 'md'
}

function WorkspaceAvatar({ name, size = 'md' }: WorkspaceAvatarProps) {
  const initials = getWorkspaceInitials(name)

  return (
    <div
      className={cn(
        'bg-muted text-foreground flex shrink-0 items-center justify-center rounded-md font-semibold',
        size === 'md' ? 'h-8 w-8 text-xs' : 'h-6 w-6 text-xs'
      )}
    >
      {initials}
    </div>
  )
}

interface WorkspaceSelectorProps {
  className?: string
}

function WorkspaceSelectorComponent({ className }: WorkspaceSelectorProps) {
  const { t } = useTranslation()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { workspaces, currentWorkspace, selectWorkspace, isOwner } = useWorkspace()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleSelectWorkspace = (workspaceId: string) => {
    if (workspaceId === currentWorkspace?.id) return

    // Update workspace in context and localStorage
    selectWorkspace(workspaceId)

    // Navigate to dashboard and reload to refresh all data
    window.location.href = `/${lang}/dashboard`
  }

  if (!currentWorkspace) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'hover:bg-accent/50 flex w-full items-center gap-2 rounded-lg p-2 transition-all duration-150',
              className
            )}
          >
            <WorkspaceAvatar name={currentWorkspace.name} size="md" />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-foreground truncate text-sm font-medium">
                {currentWorkspace.name}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {isOwner
                  ? t('dashboard.workspace.roles.owner')
                  : t('dashboard.workspace.roles.member')}
              </p>
            </div>
            <ChevronsUpDown className="text-muted-foreground h-4 w-4 shrink-0 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-64">
          <div className="px-2 py-1.5">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              {t('dashboard.workspace.selector.title')}
            </p>
          </div>
          <DropdownMenuSeparator />
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => handleSelectWorkspace(workspace.id)}
              className="flex cursor-pointer items-center gap-2"
            >
              <WorkspaceAvatar name={workspace.name} size="sm" />
              <div className="flex-1">
                <p className="truncate text-sm">{workspace.name}</p>
                {workspace.isPersonal && (
                  <span className="text-muted-foreground text-xs">
                    {t('dashboard.workspace.selector.personal')}
                  </span>
                )}
              </div>
              {workspace.id === currentWorkspace.id && <Check className="text-primary h-4 w-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            <span>{t('dashboard.workspace.selector.create')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  )
}

export const WorkspaceSelector = memo(WorkspaceSelectorComponent)
