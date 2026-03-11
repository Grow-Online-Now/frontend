/**
 * Workflows Service
 * Handles API calls for workflow automation
 */

import { apiClient } from '@/lib/api-client'
import type {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WorkflowsListResponse,
  WorkflowsQueryParams,
  WorkflowRun,
  WorkflowRunsResponse,
  NodeTypeDefinition,
  RunPartialRequest,
} from '@/types/workflow'

const ENDPOINTS = {
  workflows: '/api/workflows',
  workflowById: (id: string) => `/api/workflows/${id}`,
  nodeTypes: '/api/workflows/node-types',
  run: (id: string) => `/api/workflows/${id}/run`,
  runPartial: (id: string) => `/api/workflows/${id}/run/partial`,
  runs: (id: string) => `/api/workflows/${id}/runs`,
  runById: (workflowId: string, runId: string) =>
    `/api/workflows/${workflowId}/runs/${runId}`,
} as const

function buildQueryString(params?: WorkflowsQueryParams | { page?: number; limit?: number }): string {
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

export async function getNodeTypes(): Promise<NodeTypeDefinition[]> {
  return apiClient.get<NodeTypeDefinition[]>(ENDPOINTS.nodeTypes)
}

export async function getWorkflows(params?: WorkflowsQueryParams): Promise<WorkflowsListResponse> {
  const query = buildQueryString(params)
  return apiClient.get<WorkflowsListResponse>(`${ENDPOINTS.workflows}${query}`)
}

export async function getWorkflow(id: string): Promise<Workflow> {
  return apiClient.get<Workflow>(ENDPOINTS.workflowById(id))
}

export async function createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> {
  return apiClient.post<Workflow>(ENDPOINTS.workflows, data)
}

export async function updateWorkflow(id: string, data: UpdateWorkflowRequest): Promise<Workflow> {
  return apiClient.put<Workflow>(ENDPOINTS.workflowById(id), data)
}

export async function deleteWorkflow(id: string): Promise<void> {
  return apiClient.delete<void>(ENDPOINTS.workflowById(id))
}

export async function runWorkflow(id: string): Promise<WorkflowRun> {
  return apiClient.post<WorkflowRun>(ENDPOINTS.run(id))
}

export async function runPartialWorkflow(
  workflowId: string,
  data: RunPartialRequest
): Promise<WorkflowRun> {
  return apiClient.post<WorkflowRun>(ENDPOINTS.runPartial(workflowId), data)
}

export async function getWorkflowRuns(
  workflowId: string,
  params?: { page?: number; limit?: number }
): Promise<WorkflowRunsResponse> {
  const query = buildQueryString(params)
  return apiClient.get<WorkflowRunsResponse>(`${ENDPOINTS.runs(workflowId)}${query}`)
}

export async function getWorkflowRun(
  workflowId: string,
  runId: string
): Promise<WorkflowRun> {
  return apiClient.get<WorkflowRun>(ENDPOINTS.runById(workflowId, runId))
}

export const workflowsService = {
  getNodeTypes,
  getAll: getWorkflows,
  getById: getWorkflow,
  create: createWorkflow,
  update: updateWorkflow,
  delete: deleteWorkflow,
  run: runWorkflow,
  runPartial: runPartialWorkflow,
  getRuns: getWorkflowRuns,
  getRun: getWorkflowRun,
}
