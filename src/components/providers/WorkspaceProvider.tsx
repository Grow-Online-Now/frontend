import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { WorkspaceContext, type WorkspaceContextValue } from '@/contexts/WorkspaceContext'
import { setWorkspaceIdGetter, clearWorkspaceIdGetter } from '@/lib/api-client'
import {
  getWorkspaces,
  createWorkspace as createWorkspaceApi,
  updateWorkspace as updateWorkspaceApi,
  deleteWorkspace as deleteWorkspaceApi,
} from '@/services/workspace.service'
import type {
  WorkspaceWithRole,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '@/types/workspace'

const STORAGE_KEY = 'growonline-workspace'

function getStoredWorkspaceId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

function storeWorkspaceId(workspaceId: string): void {
  localStorage.setItem(STORAGE_KEY, workspaceId)
}

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([])
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(() =>
    getStoredWorkspaceId()
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use ref to avoid stale closure in getter
  const currentWorkspaceIdRef = useRef(currentWorkspaceId)
  currentWorkspaceIdRef.current = currentWorkspaceId

  // Register workspace ID getter with API client
  useEffect(() => {
    setWorkspaceIdGetter(() => currentWorkspaceIdRef.current)
    return () => clearWorkspaceIdGetter()
  }, [])

  // Fetch workspaces on mount
  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getWorkspaces()
      setWorkspaces(response.workspaces)

      // Auto-select workspace if none selected or current selection is invalid
      if (response.workspaces.length > 0) {
        const storedId = getStoredWorkspaceId()
        const storedWorkspace = storedId ? response.workspaces.find((w) => w.id === storedId) : null

        if (storedWorkspace) {
          setCurrentWorkspaceId(storedWorkspace.id)
        } else {
          // Default to personal workspace or first available
          const personalWorkspace = response.workspaces.find((w) => w.isPersonal)
          const defaultWorkspace = personalWorkspace || response.workspaces[0]
          setCurrentWorkspaceId(defaultWorkspace.id)
          storeWorkspaceId(defaultWorkspace.id)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspaces')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  // Current workspace object
  const currentWorkspace = useMemo(
    () => workspaces.find((w) => w.id === currentWorkspaceId) ?? null,
    [workspaces, currentWorkspaceId]
  )

  // Derived values
  const isOwner = currentWorkspace?.role === 'OWNER'
  const isPersonalWorkspace = currentWorkspace?.isPersonal ?? false

  // Actions
  const selectWorkspace = useCallback((workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId)
    storeWorkspaceId(workspaceId)
  }, [])

  const refetchWorkspaces = useCallback(async () => {
    await fetchWorkspaces()
  }, [fetchWorkspaces])

  const createWorkspace = useCallback(
    async (input: CreateWorkspaceInput): Promise<WorkspaceWithRole> => {
      const workspace = await createWorkspaceApi(input)
      // Refetch to get updated list
      await fetchWorkspaces()
      // Select the newly created workspace
      selectWorkspace(workspace.id)
      return workspace
    },
    [fetchWorkspaces, selectWorkspace]
  )

  const updateWorkspace = useCallback(
    async (workspaceId: string, input: UpdateWorkspaceInput): Promise<void> => {
      await updateWorkspaceApi(workspaceId, input)
      // Refetch to get updated data
      await fetchWorkspaces()
    },
    [fetchWorkspaces]
  )

  const deleteWorkspace = useCallback(
    async (workspaceId: string): Promise<void> => {
      await deleteWorkspaceApi(workspaceId)
      // If deleting current workspace, switch to personal
      if (workspaceId === currentWorkspaceId) {
        const personalWorkspace = workspaces.find((w) => w.isPersonal && w.id !== workspaceId)
        if (personalWorkspace) {
          selectWorkspace(personalWorkspace.id)
        }
      }
      // Refetch to get updated list
      await fetchWorkspaces()
    },
    [currentWorkspaceId, workspaces, fetchWorkspaces, selectWorkspace]
  )

  const value: WorkspaceContextValue = {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    isOwner,
    isPersonalWorkspace,
    selectWorkspace,
    refetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
