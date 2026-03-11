/**
 * Zustand store for the workflow editor state
 */

import { create } from 'zustand'
import {
  updateWorkflow,
  runWorkflow as runWorkflowApi,
  runPartialWorkflow as runPartialApi,
} from '@/services/workflows.service'
import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowRun,
  NodeTypeDefinition,
} from '@/types/workflow'

type RightPanelTab = 'config' | 'preview' | 'output'
type BottomPanelTab = 'executions' | 'logs'

interface WorkflowEditorState {
  workflow: Workflow | null
  nodeTypeMap: Record<string, NodeTypeDefinition>
  selectedNodeId: string | null
  isRunning: boolean
  isSaving: boolean
  lastRun: WorkflowRun | null
  rightPanelTab: RightPanelTab
  bottomPanelOpen: boolean
  bottomPanelTab: BottomPanelTab
  selectedRunId: string | null
  isDirty: boolean
  runCount: number
  stepByStepMode: boolean
}

interface WorkflowEditorActions {
  setWorkflow: (workflow: Workflow) => void
  setNodeTypeMap: (map: Record<string, NodeTypeDefinition>) => void
  selectNode: (nodeId: string | null) => void
  setRunning: (running: boolean) => void
  setRightPanelTab: (tab: RightPanelTab) => void
  toggleBottomPanel: () => void
  setBottomPanelOpen: (open: boolean) => void
  setBottomPanelTab: (tab: BottomPanelTab) => void
  selectRun: (runId: string | null) => void
  addNode: (node: WorkflowNode) => void
  removeNode: (nodeId: string) => void
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void
  addEdge: (edge: WorkflowEdge) => void
  removeEdge: (edgeId: string) => void
  setWorkflowStatus: (status: 'active' | 'paused' | 'draft') => Promise<void>
  renameWorkflow: (name: string) => Promise<void>
  saveWorkflow: () => Promise<void>
  runWorkflow: () => Promise<WorkflowRun | null>
  retryFromNode: (sourceRunId: string, nodeId: string) => Promise<WorkflowRun | null>
  runFromNode: (sourceRunId: string, nodeId: string) => Promise<WorkflowRun | null>
  stepNode: (sourceRunId: string, nodeId: string) => Promise<WorkflowRun | null>
  setStepByStepMode: (enabled: boolean) => void
  reset: () => void
}

const initialState: WorkflowEditorState = {
  workflow: null,
  nodeTypeMap: {},
  selectedNodeId: null,
  isRunning: false,
  isSaving: false,
  lastRun: null,
  rightPanelTab: 'config',
  bottomPanelOpen: true,
  bottomPanelTab: 'executions',
  selectedRunId: null,
  isDirty: false,
  runCount: 0,
  stepByStepMode: false,
}

export const useWorkflowEditorStore = create<WorkflowEditorState & WorkflowEditorActions>(
  (set, get) => ({
    ...initialState,

    setWorkflow: (workflow) => set({ workflow, isDirty: false }),

    setNodeTypeMap: (map) => set({ nodeTypeMap: map }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId, rightPanelTab: 'config' }),

    setRunning: (running) => set({ isRunning: running }),

    setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

    toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),

    setBottomPanelOpen: (open) => set({ bottomPanelOpen: open }),

    setBottomPanelTab: (tab) => set({ bottomPanelTab: tab }),

    selectRun: (runId) => set({ selectedRunId: runId, bottomPanelTab: 'logs' }),

    addNode: (node) =>
      set((state) => {
        if (!state.workflow) return state
        return {
          workflow: { ...state.workflow, nodes: [...state.workflow.nodes, node] },
          isDirty: true,
        }
      }),

    removeNode: (nodeId) =>
      set((state) => {
        if (!state.workflow) return state
        return {
          workflow: {
            ...state.workflow,
            nodes: state.workflow.nodes.filter((n) => n.id !== nodeId),
            edges: state.workflow.edges.filter(
              (e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId
            ),
          },
          selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
          isDirty: true,
        }
      }),

    updateNodeConfig: (nodeId, config) =>
      set((state) => {
        if (!state.workflow) return state
        return {
          workflow: {
            ...state.workflow,
            nodes: state.workflow.nodes.map((n) =>
              n.id === nodeId ? { ...n, config: { ...n.config, ...config } } : n
            ),
          },
          isDirty: true,
        }
      }),

    updateNodePosition: (nodeId, position) =>
      set((state) => {
        if (!state.workflow) return state
        return {
          workflow: {
            ...state.workflow,
            nodes: state.workflow.nodes.map((n) =>
              n.id === nodeId ? { ...n, position } : n
            ),
          },
          isDirty: true,
        }
      }),

    addEdge: (edge) =>
      set((state) => {
        if (!state.workflow) return state
        return {
          workflow: { ...state.workflow, edges: [...state.workflow.edges, edge] },
          isDirty: true,
        }
      }),

    removeEdge: (edgeId) =>
      set((state) => {
        if (!state.workflow) return state
        return {
          workflow: {
            ...state.workflow,
            edges: state.workflow.edges.filter((e) => e.id !== edgeId),
          },
          isDirty: true,
        }
      }),

    setWorkflowStatus: async (status) => {
      const { workflow } = get()
      if (!workflow) return
      try {
        const updated = await updateWorkflow(workflow.id, { status })
        set({ workflow: { ...workflow, status: updated.status } })
      } catch {
        throw new Error('Failed to update workflow status')
      }
    },

    renameWorkflow: async (name: string) => {
      const { workflow } = get()
      if (!workflow) return
      try {
        const updated = await updateWorkflow(workflow.id, { name })
        set({ workflow: { ...workflow, name: updated.name } })
      } catch {
        throw new Error('Failed to rename workflow')
      }
    },

    saveWorkflow: async () => {
      const { workflow } = get()
      if (!workflow) return
      try {
        set({ isSaving: true })
        const updated = await updateWorkflow(workflow.id, {
          name: workflow.name,
          description: workflow.description ?? undefined,
          nodes: workflow.nodes,
          edges: workflow.edges,
          triggerType: workflow.triggerType,
          triggerConfig: workflow.triggerConfig,
        })
        set({ workflow: updated, isDirty: false, isSaving: false })
      } catch {
        set({ isSaving: false })
        throw new Error('Failed to save workflow')
      }
    },

    runWorkflow: async () => {
      const { workflow } = get()
      if (!workflow) return null
      try {
        set({ isRunning: true })
        const run = await runWorkflowApi(workflow.id)
        set((state) => ({ isRunning: false, lastRun: run, runCount: state.runCount + 1 }))
        return run
      } catch {
        set({ isRunning: false })
        throw new Error('Failed to run workflow')
      }
    },

    retryFromNode: async (sourceRunId, nodeId) => {
      const { workflow } = get()
      if (!workflow) return null
      try {
        set({ isRunning: true })
        const run = await runPartialApi(workflow.id, { sourceRunId, fromNodeId: nodeId })
        set((state) => ({ isRunning: false, lastRun: run, runCount: state.runCount + 1 }))
        return run
      } catch {
        set({ isRunning: false })
        throw new Error('Failed to retry from node')
      }
    },

    runFromNode: async (sourceRunId, nodeId) => {
      const { workflow } = get()
      if (!workflow) return null
      try {
        set({ isRunning: true })
        const run = await runPartialApi(workflow.id, { sourceRunId, fromNodeId: nodeId })
        set((state) => ({ isRunning: false, lastRun: run, runCount: state.runCount + 1 }))
        return run
      } catch {
        set({ isRunning: false })
        throw new Error('Failed to run from node')
      }
    },

    stepNode: async (sourceRunId, nodeId) => {
      const { workflow } = get()
      if (!workflow) return null
      try {
        set({ isRunning: true })
        const run = await runPartialApi(workflow.id, {
          sourceRunId,
          fromNodeId: nodeId,
          stopAfterNodeId: nodeId,
        })
        set((state) => ({ isRunning: false, lastRun: run, runCount: state.runCount + 1 }))
        return run
      } catch {
        set({ isRunning: false })
        throw new Error('Failed to step node')
      }
    },

    setStepByStepMode: (enabled) => set({ stepByStepMode: enabled }),

    reset: () => set(initialState),
  })
)
