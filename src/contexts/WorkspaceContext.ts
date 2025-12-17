/**
 * Workspace Context
 * Provides workspace state to the application
 */

import { createContext } from 'react'
import type {
  WorkspaceWithRole,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '@/types/workspace'

export interface WorkspaceContextValue {
  // State
  workspaces: WorkspaceWithRole[]
  currentWorkspace: WorkspaceWithRole | null
  isLoading: boolean
  error: string | null

  // Derived
  isOwner: boolean
  isPersonalWorkspace: boolean

  // Actions
  selectWorkspace: (workspaceId: string) => void
  refetchWorkspaces: () => Promise<void>
  createWorkspace: (input: CreateWorkspaceInput) => Promise<WorkspaceWithRole>
  updateWorkspace: (workspaceId: string, input: UpdateWorkspaceInput) => Promise<void>
  deleteWorkspace: (workspaceId: string) => Promise<void>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
