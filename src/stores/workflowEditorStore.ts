/**
 * Zustand store for the workflow editor state
 */

import { create } from 'zustand'
import type { Workflow, WorkflowNode, WorkflowEdge } from '@/types/workflow'

type RightPanelTab = 'config' | 'preview' | 'output'

interface WorkflowEditorState {
  workflow: Workflow | null
  selectedNodeId: string | null
  isRunning: boolean
  rightPanelTab: RightPanelTab
  bottomPanelOpen: boolean
  isDirty: boolean
}

interface WorkflowEditorActions {
  setWorkflow: (workflow: Workflow) => void
  selectNode: (nodeId: string | null) => void
  setRunning: (running: boolean) => void
  setRightPanelTab: (tab: RightPanelTab) => void
  toggleBottomPanel: () => void
  setBottomPanelOpen: (open: boolean) => void
  addNode: (node: WorkflowNode) => void
  removeNode: (nodeId: string) => void
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void
  addEdge: (edge: WorkflowEdge) => void
  removeEdge: (edgeId: string) => void
  reset: () => void
}

const initialState: WorkflowEditorState = {
  workflow: null,
  selectedNodeId: null,
  isRunning: false,
  rightPanelTab: 'config',
  bottomPanelOpen: true,
  isDirty: false,
}

export const useWorkflowEditorStore = create<WorkflowEditorState & WorkflowEditorActions>(
  (set) => ({
    ...initialState,

    setWorkflow: (workflow) => set({ workflow, isDirty: false }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId, rightPanelTab: 'config' }),

    setRunning: (running) => set({ isRunning: running }),

    setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

    toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),

    setBottomPanelOpen: (open) => set({ bottomPanelOpen: open }),

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

    reset: () => set(initialState),
  })
)
