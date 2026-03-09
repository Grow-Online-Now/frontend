/**
 * WorkflowCard
 * Card displaying workflow summary in the list view
 */

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Play, MoreHorizontal, Check, Clock, Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'
import type { Workflow } from '@/types/workflow'

interface WorkflowCardProps {
  workflow: Workflow
  index: number
  onClick: (id: string) => void
}

export function WorkflowCard({ workflow, index, onClick }: WorkflowCardProps) {
  const { t } = useTranslation()

  const triggerIcon = workflow.trigger.startsWith('Cron') ? (
    <Clock className="h-3 w-3" />
  ) : workflow.trigger.startsWith('Webhook') ? (
    <Link className="h-3 w-3" />
  ) : (
    <Play className="h-3 w-3" />
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(workflow.id)}
      className={cn(
        'cursor-pointer rounded-xl border border-border-subtle bg-bg-elevated p-5',
        'transition-all duration-150',
        'hover:border-border-default hover:bg-bg-hover'
      )}
    >
      {/* Row 1: Name + status + actions */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-md text-foreground font-semibold tracking-tight">
            {workflow.name}
          </span>
          <WorkflowStatusBadge status={workflow.status} />
        </div>
        <div className="flex items-center gap-2">
          {workflow.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 px-3 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="h-3 w-3" />
              {t('dashboard.workflows.card.run')}
            </Button>
          )}
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground p-1 transition-colors duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Description */}
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        {workflow.description}
      </p>

      {/* Row 3: Metadata */}
      <div className="text-muted-foreground flex items-center gap-5 text-xs">
        <span className="flex items-center gap-1.5">
          {triggerIcon}
          {workflow.trigger}
        </span>
        <span className="text-border-emphasis">·</span>
        <span>{t('dashboard.workflows.card.nodes', { count: workflow.nodeCount })}</span>
        <span className="text-border-emphasis">·</span>
        <span>{t('dashboard.workflows.card.runs', { count: workflow.runCount })}</span>
        <span className="text-border-emphasis">·</span>
        <span className="flex items-center gap-1">
          {workflow.lastStatus === 'success' && <Check className="h-3 w-3 text-success" />}
          {workflow.lastRun
            ? t('dashboard.workflows.card.lastRun', { time: workflow.lastRun })
            : t('dashboard.workflows.card.neverRun')}
        </span>
      </div>
    </motion.div>
  )
}
