import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Building2, Plus, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/hooks/useWorkspace'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'

interface WorkspaceSelectorProps {
  className?: string
}

function WorkspaceSelectorComponent({ className }: WorkspaceSelectorProps) {
  const { t } = useTranslation()
  const { workspaces, currentWorkspace, selectWorkspace, isOwner } = useWorkspace()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  if (!currentWorkspace) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg p-2 transition-all duration-150',
              className
            )}
          >
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Building2 className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-foreground truncate text-sm font-medium">
                {currentWorkspace.name}
              </p>
              <div className="flex items-center gap-1.5">
                {currentWorkspace.isPersonal && (
                  <span className="text-muted-foreground text-xs">
                    {t('dashboard.workspace.selector.personal')}
                  </span>
                )}
                <Badge
                  variant={isOwner ? 'default' : 'secondary'}
                  className="px-1.5 py-0 text-[10px]"
                >
                  {isOwner
                    ? t('dashboard.workspace.roles.owner')
                    : t('dashboard.workspace.roles.member')}
                </Badge>
              </div>
            </div>
            <ChevronDown className="text-muted-foreground/50 h-4 w-4" />
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
              onClick={() => selectWorkspace(workspace.id)}
              className="flex cursor-pointer items-center gap-2"
            >
              <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-md">
                <Building2 className="text-primary h-4 w-4" />
              </div>
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
