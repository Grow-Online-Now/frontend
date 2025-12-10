import { memo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useSession } from '@/lib/auth-client'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

/**
 * Route wrapper that redirects authenticated users to the dashboard.
 * Use this for pages that should only be accessible to logged-out users
 * (e.g., landing page, login, signup).
 */
function PublicOnlyRouteComponent({ children }: PublicOnlyRouteProps) {
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { data: session, isPending } = useSession()

  // While checking auth, render children to avoid flash
  if (isPending) {
    return <>{children}</>
  }

  // If authenticated, redirect to dashboard
  if (session) {
    return <Navigate to={`/${lang}/dashboard`} replace />
  }

  return <>{children}</>
}

export const PublicOnlyRoute = memo(PublicOnlyRouteComponent)
