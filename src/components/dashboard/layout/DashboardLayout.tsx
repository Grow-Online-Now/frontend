import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { DashboardSidebar } from './DashboardSidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { GettingStartedModal } from '../shared/GettingStartedModal'
import { LimitReachedModal } from '../billing/LimitReachedModal'
import { UpgradePromptProvider } from '@/contexts/UpgradePromptContext'
import { useConnections } from '@/hooks/useConnections'

export default function DashboardLayout() {
  const { connections } = useConnections()

  // Mock data - replace with actual data from your backend
  const hasConnectedAccounts = connections.length > 0
  const hasCreatedPost = false // Replace with actual check
  const hasScheduledPost = false // Replace with actual check

  return (
    <UpgradePromptProvider>
      <div className="bg-surface-muted flex h-screen w-full">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />

        {/* Getting Started Modal - bottom right corner */}
        <GettingStartedModal
          hasConnectedAccounts={hasConnectedAccounts}
          hasCreatedPost={hasCreatedPost}
          hasScheduledPost={hasScheduledPost}
        />

        {/* Limit reached upgrade modal */}
        <LimitReachedModal />

        {/* Toast notifications */}
        <Toaster position="bottom-right" />
      </div>
    </UpgradePromptProvider>
  )
}
