import { memo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useSession } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function DashboardSkeleton() {
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
            <Skeleton className="h-32 w-full rounded-[19px]" />
            <Skeleton className="h-32 w-full rounded-[19px]" />
            <Skeleton className="h-32 w-full rounded-[19px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProtectedRouteComponent({ children }: ProtectedRouteProps) {
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <DashboardSkeleton />
  }

  if (!session) {
    return <Navigate to={`/${lang}/login`} replace />
  }

  return <>{children}</>
}

export const ProtectedRoute = memo(ProtectedRouteComponent)
