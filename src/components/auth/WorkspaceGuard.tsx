import { memo } from 'react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { Skeleton } from '@/components/ui/skeleton'

interface WorkspaceGuardProps {
  children: React.ReactNode
}

function WorkspaceLoadingSkeleton() {
  return (
    <div className="bg-surface-muted flex h-screen w-full">
      {/* Sidebar skeleton */}
      <div className="border-sidebar-border bg-sidebar hidden w-64 border-r p-4 md:block">
        <Skeleton className="mb-8 h-8 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col">
        {/* Header skeleton */}
        <div className="border-border-subtle bg-surface flex h-16 items-center justify-between border-b px-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-6">
          <Skeleton className="mb-4 h-8 w-64" />
          <Skeleton className="mb-8 h-4 w-96" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkspaceErrorState({ error }: { error: string }) {
  return (
    <div className="bg-surface-muted flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-text-primary mb-2 text-lg font-semibold">Failed to load workspaces</h2>
        <p className="text-text-secondary text-sm">{error}</p>
      </div>
    </div>
  )
}

function WorkspaceGuardComponent({ children }: WorkspaceGuardProps) {
  const { isLoading, error, currentWorkspace } = useWorkspace()

  if (isLoading) {
    return <WorkspaceLoadingSkeleton />
  }

  if (error) {
    return <WorkspaceErrorState error={error} />
  }

  // This should never happen if backend auto-creates personal workspace
  if (!currentWorkspace) {
    return <WorkspaceErrorState error="No workspace available" />
  }

  return <>{children}</>
}

export const WorkspaceGuard = memo(WorkspaceGuardComponent)
