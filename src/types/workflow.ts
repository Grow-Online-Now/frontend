/**
 * Workflow automation type definitions
 * Matches backend API at /api/workflows
 */

// ─── Core Enums ───

export type WorkflowStatus = 'active' | 'paused' | 'draft'
export type TriggerType = 'manual' | 'cron' | 'webhook'
export type RunStatus = 'running' | 'success' | 'failed' | 'paused'
export type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'cached'
export type NodeCategory = 'trigger' | 'media' | 'text' | 'logic' | 'output' | 'ai'

// ─── Workflow ───

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  config: Record<string, unknown>
}

export interface WorkflowEdge {
  id: string
  sourceNodeId: string
  sourcePortKey: string
  targetNodeId: string
  targetPortKey: string
}

export interface Workflow {
  id: string
  workspaceId: string
  name: string
  description: string | null
  status: WorkflowStatus
  triggerType: TriggerType
  triggerConfig: Record<string, unknown>
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
}

// ─── Workflow Run ───

export interface WorkflowStepResult {
  nodeId: string
  nodeType: string
  status: StepStatus
  input: Record<string, unknown> | null
  output: Record<string, unknown> | null
  error?: string
  startedAt: string
  completedAt?: string
  durationMs?: number
  sourceRunId?: string
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: RunStatus
  triggeredBy: TriggerType | 'partial'
  steps: WorkflowStepResult[]
  startedAt: string
  completedAt: string | null
  durationMs: number | null
  sourceRunId?: string
}

export interface RunPartialRequest {
  sourceRunId: string
  fromNodeId: string
  stopAfterNodeId?: string
}

// ─── Node Type Definitions (from GET /node-types) ───

export interface PortSchema {
  key: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'
  label: string
  description?: string
  required?: boolean
}

export interface ConfigFieldSchema {
  key: string
  type: 'text' | 'number' | 'select' | 'toggle' | 'textarea' | 'variable_ref' | 'cron' | 'json'
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  default?: unknown
  options?: { label: string; value: string }[]
  validation?: { min?: number; max?: number; pattern?: string }
}

export interface NodeTypeDefinition {
  type: string
  name: string
  description: string
  icon: string
  category: NodeCategory
  configSchema: ConfigFieldSchema[]
  inputPorts: PortSchema[]
  outputPorts: PortSchema[]
}

// ─── API Request/Response Types ───

export interface CreateWorkflowRequest {
  name: string
  description?: string
  triggerType: TriggerType
  triggerConfig?: Record<string, unknown>
  nodes?: WorkflowNode[]
  edges?: WorkflowEdge[]
}

export interface UpdateWorkflowRequest {
  name?: string
  description?: string
  status?: WorkflowStatus
  triggerType?: TriggerType
  triggerConfig?: Record<string, unknown>
  nodes?: WorkflowNode[]
  edges?: WorkflowEdge[]
}

export interface WorkflowsListResponse {
  workflows: Workflow[]
  total: number
}

export interface WorkflowRunsResponse {
  runs: WorkflowRun[]
  total: number
}

export interface WorkflowsQueryParams {
  status?: WorkflowStatus
  page?: number
  limit?: number
}

// ─── Frontend-only Types ───

export interface CategoryConfig {
  labelKey: string
  colorClass: string
  mutedColorClass: string
  bgAccentClass: string
}

export interface CategoryDefinition {
  key: NodeCategory
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  colorClass: string
  mutedColorClass: string
}
