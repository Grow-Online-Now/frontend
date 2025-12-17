/**
 * Workspace Types
 * TypeScript definitions for workspace-related entities
 */

export type WorkspaceRole = 'OWNER' | 'MEMBER'

/**
 * Base workspace entity
 */
export interface Workspace {
  id: string
  name: string
  slug: string
  isPersonal: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Workspace with the user's role in it
 */
export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole
}

/**
 * Workspace member with user details
 */
export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: WorkspaceRole
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
  createdAt: string
}

/**
 * API Response Types
 */
export interface WorkspacesResponse {
  workspaces: WorkspaceWithRole[]
}

export interface WorkspaceResponse {
  workspace: WorkspaceWithRole
}

export interface MembersResponse {
  members: WorkspaceMember[]
}

export interface MemberResponse {
  member: WorkspaceMember
}

/**
 * Input Types for API calls
 */
export interface CreateWorkspaceInput {
  name: string
  slug?: string
}

export interface UpdateWorkspaceInput {
  name?: string
}

export interface AddMemberInput {
  email: string
  role: WorkspaceRole
}

export interface UpdateMemberRoleInput {
  role: WorkspaceRole
}
