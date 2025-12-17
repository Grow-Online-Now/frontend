import { useState, useEffect, useCallback } from 'react'
import {
  getWorkspaceMembers,
  addWorkspaceMember,
  updateMemberRole,
  removeMember,
  leaveWorkspace,
} from '@/services/workspace.service'
import { ApiError } from '@/lib/api-client'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { WorkspaceMember, AddMemberInput, WorkspaceRole } from '@/types/workspace'

interface UseWorkspaceMembersState {
  members: WorkspaceMember[]
  isLoading: boolean
  error: string | null
}

interface UseWorkspaceMembersReturn extends UseWorkspaceMembersState {
  addMember: (input: AddMemberInput) => Promise<void>
  updateRole: (userId: string, role: WorkspaceRole) => Promise<void>
  remove: (userId: string) => Promise<void>
  leave: () => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Hook to manage workspace members
 * Handles fetching, adding, updating roles, removing, and leaving
 */
export function useWorkspaceMembers(): UseWorkspaceMembersReturn {
  const { currentWorkspace, refetchWorkspaces } = useWorkspace()
  const [state, setState] = useState<UseWorkspaceMembersState>({
    members: [],
    isLoading: true,
    error: null,
  })

  /**
   * Fetch all members for current workspace
   */
  const fetchMembers = useCallback(async () => {
    if (!currentWorkspace) {
      setState({ members: [], isLoading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getWorkspaceMembers(currentWorkspace.id)
      setState({
        members: response.members,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load members'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [currentWorkspace])

  /**
   * Add a new member to the workspace
   */
  const addMember = useCallback(
    async (input: AddMemberInput) => {
      if (!currentWorkspace) return

      try {
        await addWorkspaceMember(currentWorkspace.id, input)
        await fetchMembers()
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to add member'
        setState((prev) => ({ ...prev, error: message }))
        throw err
      }
    },
    [currentWorkspace, fetchMembers]
  )

  /**
   * Update a member's role
   */
  const updateRole = useCallback(
    async (userId: string, role: WorkspaceRole) => {
      if (!currentWorkspace) return

      try {
        await updateMemberRole(currentWorkspace.id, userId, { role })
        await fetchMembers()
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to update role'
        setState((prev) => ({ ...prev, error: message }))
        throw err
      }
    },
    [currentWorkspace, fetchMembers]
  )

  /**
   * Remove a member from the workspace
   */
  const remove = useCallback(
    async (userId: string) => {
      if (!currentWorkspace) return

      try {
        await removeMember(currentWorkspace.id, userId)
        await fetchMembers()
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to remove member'
        setState((prev) => ({ ...prev, error: message }))
        throw err
      }
    },
    [currentWorkspace, fetchMembers]
  )

  /**
   * Leave the current workspace
   */
  const leave = useCallback(async () => {
    if (!currentWorkspace) return

    try {
      await leaveWorkspace(currentWorkspace.id)
      // Refetch workspaces to update the list and switch to another workspace
      await refetchWorkspaces()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to leave workspace'
      setState((prev) => ({ ...prev, error: message }))
      throw err
    }
  }, [currentWorkspace, refetchWorkspaces])

  // Fetch members when workspace changes
  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  return {
    ...state,
    addMember,
    updateRole,
    remove,
    leave,
    refetch: fetchMembers,
  }
}
