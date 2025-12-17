/**
 * Workspace Service
 * Handles API calls for workspace management
 */

import { apiClient } from '@/lib/api-client'
import type {
  WorkspaceWithRole,
  WorkspacesResponse,
  WorkspaceResponse,
  WorkspaceMember,
  MembersResponse,
  MemberResponse,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  AddMemberInput,
  UpdateMemberRoleInput,
} from '@/types/workspace'

const ENDPOINTS = {
  workspaces: '/api/workspaces',
  workspace: (id: string) => `/api/workspaces/${id}`,
  members: (workspaceId: string) => `/api/workspaces/${workspaceId}/members`,
  member: (workspaceId: string, userId: string) =>
    `/api/workspaces/${workspaceId}/members/${userId}`,
  leave: (workspaceId: string) => `/api/workspaces/${workspaceId}/leave`,
} as const

/**
 * Get all workspaces for the authenticated user
 */
export async function getWorkspaces(): Promise<WorkspacesResponse> {
  return apiClient.get<WorkspacesResponse>(ENDPOINTS.workspaces)
}

/**
 * Get a single workspace by ID
 */
export async function getWorkspace(workspaceId: string): Promise<WorkspaceWithRole> {
  const response = await apiClient.get<WorkspaceResponse>(ENDPOINTS.workspace(workspaceId))
  return response.workspace
}

/**
 * Create a new workspace
 */
export async function createWorkspace(input: CreateWorkspaceInput): Promise<WorkspaceWithRole> {
  const response = await apiClient.post<WorkspaceResponse>(ENDPOINTS.workspaces, input)
  return response.workspace
}

/**
 * Update a workspace (owner only)
 */
export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<WorkspaceWithRole> {
  const response = await apiClient.patch<WorkspaceResponse>(ENDPOINTS.workspace(workspaceId), input)
  return response.workspace
}

/**
 * Delete a workspace (owner only, non-personal)
 */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.workspace(workspaceId))
}

/**
 * Get members of a workspace
 */
export async function getWorkspaceMembers(workspaceId: string): Promise<MembersResponse> {
  return apiClient.get<MembersResponse>(ENDPOINTS.members(workspaceId))
}

/**
 * Add a member to a workspace (owner only)
 */
export async function addWorkspaceMember(
  workspaceId: string,
  input: AddMemberInput
): Promise<WorkspaceMember> {
  const response = await apiClient.post<MemberResponse>(ENDPOINTS.members(workspaceId), input)
  return response.member
}

/**
 * Update a member's role (owner only)
 */
export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  input: UpdateMemberRoleInput
): Promise<WorkspaceMember> {
  const response = await apiClient.patch<MemberResponse>(
    ENDPOINTS.member(workspaceId, userId),
    input
  )
  return response.member
}

/**
 * Remove a member from a workspace (owner only)
 */
export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.member(workspaceId, userId))
}

/**
 * Leave a workspace (non-owner, non-personal)
 */
export async function leaveWorkspace(workspaceId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.leave(workspaceId))
}

/**
 * Workspace service object (alternative API)
 */
export const workspaceService = {
  getAll: getWorkspaces,
  get: getWorkspace,
  create: createWorkspace,
  update: updateWorkspace,
  delete: deleteWorkspace,
  getMembers: getWorkspaceMembers,
  addMember: addWorkspaceMember,
  updateMemberRole,
  removeMember,
  leave: leaveWorkspace,
}
