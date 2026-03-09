/**
 * Workflow automation type definitions
 */

import type { LucideIcon } from 'lucide-react'

// ─── Core Types ───

export type WorkflowStatus = 'active' | 'paused' | 'draft'
export type NodeCategory = 'trigger' | 'media' | 'text' | 'logic' | 'output'
export type RunStatus = 'success' | 'failed' | 'running'

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  config: Record<string, unknown>
}

export interface WorkflowEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  trigger: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  lastRun: string | null
  lastStatus: RunStatus | null
  runCount: number
  nodeCount: number
  createdAt: string
  updatedAt: string
}

// ─── Node Type Definitions ───

export interface NodeOutput {
  key: string
  type: string
}

export type ConfigFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'toggle'
  | 'textarea'
  | 'variable_ref'
  | 'cron'
  | 'json'

export interface ConfigSchemaField {
  key: string
  type: ConfigFieldType
  labelKey: string
  required?: boolean
  defaultValue?: unknown
  options?: { labelKey: string; value: string }[]
}

export interface NodeTypeDefinition {
  key: string
  category: NodeCategory
  nameKey: string
  descriptionKey: string
  icon: LucideIcon
  configSchema: ConfigSchemaField[]
  outputs: NodeOutput[]
}

export interface CategoryDefinition {
  key: NodeCategory
  labelKey: string
  icon: LucideIcon
  colorClass: string
  mutedColorClass: string
}

// ─── Execution / Runs ───

export interface WorkflowRun {
  id: string
  workflowId: string
  status: RunStatus
  startedAt: string
  duration: string
  stepsCompleted: number
  stepsTotal: number
}

// ─── API Types ───

export interface WorkflowsListResponse {
  workflows: Workflow[]
  total: number
}

export interface WorkflowRunsResponse {
  runs: WorkflowRun[]
  total: number
}
