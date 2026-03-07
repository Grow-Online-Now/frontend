/**
 * WorkflowCard Component
 * Displays a workflow summary card in the list view
 */

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { MoreHorizontal, Pencil, Play, Trash2, History } from 'lucide-react'
import { Link } from '@/components/common/LocalizedLink'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'
import type { Workflow } from '@/types/automations'

interface WorkflowCardProps {
  workflow: Workflow
  onDelete: (id: string) => void
}

export function WorkflowCard({ workflow, onDelete }: WorkflowCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  const nodeCount = workflow.definition.nodes.length
  const updatedDate = new Date(workflow.updatedAt).toLocaleDateString()

  return (
    <Link
      to={`/dashboard/automations/${workflow.id}/edit`}
      className="bg-bg-elevated border-border hover:border-border-emphasis group block rounded-xl border p-5 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-text-primary truncate text-base font-semibold tracking-tight">
            {workflow.name}
          </h3>
          {workflow.description && (
            <p className="text-text-secondary mt-1 line-clamp-2 text-sm">
              {workflow.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/${lang}/dashboard/automations/${workflow.id}/edit`)}
            >
              <Pencil className="mr-2 size-4" />
              {t('dashboard.automations.actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate(`/${lang}/dashboard/automations/${workflow.id}/executions`)
              }
            >
              <History className="mr-2 size-4" />
              {t('dashboard.automations.actions.executions')}
            </DropdownMenuItem>
            {workflow.status === 'ACTIVE' && (
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/${lang}/dashboard/automations/${workflow.id}/executions`)
                }
              >
                <Play className="mr-2 size-4" />
                {t('dashboard.automations.actions.run')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(workflow.id)}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              {t('dashboard.automations.actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <WorkflowStatusBadge status={workflow.status} />
        <span className="text-text-tertiary text-xs">
          {t('dashboard.automations.card.nodes', { count: nodeCount })}
        </span>
        <span className="text-text-muted text-xs">{updatedDate}</span>
      </div>
    </Link>
  )
}
