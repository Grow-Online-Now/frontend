import { Skeleton } from '../ui/skeleton'

export function DashboardPageLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 rounded-[19px]" />
        <Skeleton className="h-32 rounded-[19px]" />
        <Skeleton className="h-32 rounded-[19px]" />
      </div>
    </div>
  )
}
