import { useContext } from 'react'
import { WorkspaceContext } from '@/contexts/WorkspaceContext'

/**
 * Hook to access workspace context
 * Must be used within a WorkspaceProvider
 */
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

// Alias for consistency with other hooks
export const useWorkspaceContext = useWorkspace
