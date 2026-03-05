/**
 * Automation Workflows Type Definitions
 */

// Status types
export type WorkflowStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
export type ExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type StepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED'
export type NodeCategory = 'trigger' | 'processor' | 'action'

// Node registry (from GET /api/automations/nodes)
export interface NodeHandlerDescriptor {
  type: string
  label: string
  category: NodeCategory
  description: string
  configSchema: Record<string, unknown>
  inputSchema?: Record<string, unknown>
  outputSchema?: Record<string, unknown>
}

// Workflow definition (the graph)
export interface NodeDefinition {
  id: string
  type: string
  label: string
  config: Record<string, unknown>
  position?: { x: number; y: number }
}

export interface EdgeDefinition {
  id: string
  source: string
  target: string
}

export interface WorkflowDefinition {
  nodes: NodeDefinition[]
  edges: EdgeDefinition[]
}

// Workflow (from API responses)
export interface Workflow {
  id: string
  workspaceId: string
  name: string
  description: string | null
  status: WorkflowStatus
  definition: WorkflowDefinition
  createdBy: string
  createdAt: string
  updatedAt: string
}

// Workflow CRUD request types
export interface CreateWorkflowRequest {
  name: string
  description?: string
  definition: WorkflowDefinition
}

export interface UpdateWorkflowRequest {
  name?: string
  description?: string
  status?: WorkflowStatus
  definition?: WorkflowDefinition
}

// Workflow list response
export interface WorkflowsListResponse {
  workflows: Workflow[]
  total: number
}

// Query params for listing workflows
export interface WorkflowsQueryParams {
  status?: WorkflowStatus
  limit?: number
  offset?: number
}

// Execution request
export interface ExecuteWorkflowRequest {
  triggerData?: Record<string, unknown>
}

// Step execution (from API responses)
export interface StepExecution {
  id: string
  executionId: string
  nodeId: string
  nodeType: string
  status: StepStatus
  inputData: Record<string, unknown> | null
  outputData: Record<string, unknown> | null
  externalJobId: string | null
  startedAt: string | null
  completedAt: string | null
  error: string | null
  retryCount: number
  createdAt: string
  updatedAt: string
}

// Workflow execution (from API responses)
export interface WorkflowExecution {
  id: string
  workflowId: string
  status: ExecutionStatus
  definitionSnapshot: WorkflowDefinition
  triggerData: Record<string, unknown> | null
  startedAt: string | null
  completedAt: string | null
  error: string | null
  createdAt: string
  updatedAt: string
  steps: StepExecution[]
}

// Executions list response
export interface ExecutionsListResponse {
  executions: WorkflowExecution[]
  total: number
}

// Query params for listing executions
export interface ExecutionsQueryParams {
  limit?: number
  offset?: number
}
