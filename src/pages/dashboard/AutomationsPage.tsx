/**
 * AutomationsPage
 * Workflow list and management page
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Workflow, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import { WorkflowCard } from '@/components/dashboard/automations/WorkflowCard'
import { CreateWorkflowDialog } from '@/components/dashboard/automations/CreateWorkflowDialog'
import { WorkflowStatusFilter } from '@/components/dashboard/automations/WorkflowStatusFilter'
import { useWorkflows } from '@/hooks/useWorkflows'
import type { WorkflowStatus } from '@/types/automations'

export default function AutomationsPage() {
  const { t } = useTranslation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<WorkflowStatus | undefined>(undefined)

  const { workflows, isLoading, error, updateFilters, refetch, deleteWorkflowById } =
    useWorkflows({ status: activeStatus })

  const handleStatusFilter = (status: WorkflowStatus | undefined) => {
    setActiveStatus(status)
    updateFilters({ status })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteWorkflowById(deleteId)
    setDeleteId(null)
  }

  if (isLoading && workflows.length === 0) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.automations.title"
          descriptionKey="dashboard.automations.description"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.automations.title"
          descriptionKey="dashboard.automations.description"
        />
        <ErrorAlert message={error} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.automations.title"
        descriptionKey="dashboard.automations.description"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="size-4" />
            {t('dashboard.automations.create')}
          </Button>
        }
      />

      <WorkflowStatusFilter
        activeStatus={activeStatus}
        onStatusChange={handleStatusFilter}
      />

      {workflows.length === 0 && !activeStatus ? (
        <EmptyState
          icon={<Workflow />}
          titleKey="dashboard.automations.empty.title"
          descriptionKey="dashboard.automations.empty.description"
          ctaKey="dashboard.automations.empty.cta"
          onCtaClick={() => setIsCreateOpen(true)}
        />
      ) : workflows.length === 0 ? (
        <EmptyState
          icon={<Workflow />}
          titleKey="dashboard.automations.empty.filteredTitle"
          descriptionKey="dashboard.automations.empty.filteredDescription"
          compact
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <CreateWorkflowDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={refetch}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.automations.deleteDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.automations.deleteDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('dashboard.automations.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
