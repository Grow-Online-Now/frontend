/**
 * Automations Service
 * Handles API calls for workflow automation management
 */

import { apiClient } from '@/lib/api-client'
import type {
  NodeHandlerDescriptor,
  Workflow,
  WorkflowsListResponse,
  WorkflowsQueryParams,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowExecution,
  ExecutionsListResponse,
  ExecutionsQueryParams,
  ExecuteWorkflowRequest,
} from '@/types/automations'

const ENDPOINTS = {
  nodes: '/api/automations/nodes',
  workflows: '/api/automations',
  workflowById: (id: string) => `/api/automations/${id}`,
  execute: (id: string) => `/api/automations/${id}/execute`,
  executions: (id: string) => `/api/automations/${id}/executions`,
  executionById: (executionId: string) => `/api/automations/executions/${executionId}`,
  cancelExecution: (executionId: string) =>
    `/api/automations/executions/${executionId}/cancel`,
} as const

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

/** Fetch available node types from the registry */
export async function getNodeRegistry(): Promise<NodeHandlerDescriptor[]> {
  return apiClient.get<NodeHandlerDescriptor[]>(ENDPOINTS.nodes)
}

/** List workflows with optional filters */
export async function getWorkflows(
  params?: WorkflowsQueryParams
): Promise<WorkflowsListResponse> {
  const query = buildQueryString(params as Record<string, unknown>)
  return apiClient.get<WorkflowsListResponse>(`${ENDPOINTS.workflows}${query}`)
}

/** Get a single workflow by ID */
export async function getWorkflow(id: string): Promise<Workflow> {
  return apiClient.get<Workflow>(ENDPOINTS.workflowById(id))
}

/** Create a new workflow */
export async function createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> {
  return apiClient.post<Workflow>(ENDPOINTS.workflows, data)
}

/** Update a workflow */
export async function updateWorkflow(
  id: string,
  data: UpdateWorkflowRequest
): Promise<Workflow> {
  return apiClient.patch<Workflow>(ENDPOINTS.workflowById(id), data)
}

/** Delete a workflow */
export async function deleteWorkflow(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.workflowById(id))
}

/** Execute a workflow (returns 202 Accepted) */
export async function executeWorkflow(
  id: string,
  data?: ExecuteWorkflowRequest
): Promise<WorkflowExecution> {
  return apiClient.post<WorkflowExecution>(ENDPOINTS.execute(id), data)
}

/** List executions for a workflow */
export async function getExecutions(
  workflowId: string,
  params?: ExecutionsQueryParams
): Promise<ExecutionsListResponse> {
  const query = buildQueryString(params as Record<string, unknown>)
  return apiClient.get<ExecutionsListResponse>(
    `${ENDPOINTS.executions(workflowId)}${query}`
  )
}

/** Get execution details */
export async function getExecution(executionId: string): Promise<WorkflowExecution> {
  return apiClient.get<WorkflowExecution>(ENDPOINTS.executionById(executionId))
}

/** Cancel a running execution */
export async function cancelExecution(executionId: string): Promise<WorkflowExecution> {
  return apiClient.post<WorkflowExecution>(ENDPOINTS.cancelExecution(executionId))
}
