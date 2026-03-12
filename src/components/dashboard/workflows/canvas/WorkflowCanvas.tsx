/**
 * WorkflowCanvas
 * React Flow canvas wrapper for the workflow editor
 * Uses local state for smooth drag interactions, syncs back to store
 * In execution mode: nodes show per-step status, canvas is read-only
 */

import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './workflow-canvas.css'
import { CustomNode } from './CustomNode'
import { CustomEdge } from './CustomEdge'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

const nodeTypes = { custom: CustomNode }
const edgeTypes = { custom: CustomEdge }

export function WorkflowCanvas() {
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const selectNode = useWorkflowEditorStore((s) => s.selectNode)
  const updateNodePosition = useWorkflowEditorStore((s) => s.updateNodePosition)
  const addEdgeToStore = useWorkflowEditorStore((s) => s.addEdge)
  const removeNode = useWorkflowEditorStore((s) => s.removeNode)
  const removeEdge = useWorkflowEditorStore((s) => s.removeEdge)
  const viewMode = useWorkflowEditorStore((s) => s.viewMode)
  const nodeStepMap = useWorkflowEditorStore((s) => s.nodeStepMap)

  const isExecMode = viewMode === 'execution'

  // Build React Flow nodes from workflow state
  const storeNodes: Node[] = useMemo(() => {
    if (!workflow) return []
    return workflow.nodes.map((n) => {
      const def = nodeTypeMap[n.type]
      return {
        id: n.id,
        type: 'custom',
        position: n.position,
        selected: n.id === selectedNodeId,
        draggable: !isExecMode,
        data: {
          name: def?.name ?? n.type,
          description: def?.description ?? '',
          icon: def?.icon ?? 'zap',
          category: def?.category ?? 'trigger',
          stepStatus: nodeStepMap[n.id]?.status,
          viewMode,
          nodeId: n.id,
        },
      }
    })
  }, [workflow, nodeTypeMap, selectedNodeId, viewMode, nodeStepMap, isExecMode])

  // Local state for smooth drag interactions
  const [nodes, setNodes] = useState<Node[]>(storeNodes)
  const prevStoreNodesRef = useRef(storeNodes)

  // Sync store → local when store changes (new nodes added, etc.)
  useEffect(() => {
    if (storeNodes !== prevStoreNodesRef.current) {
      setNodes(storeNodes)
      prevStoreNodesRef.current = storeNodes
    }
  }, [storeNodes])

  // Build edges with status-based data
  const storeEdges: Edge[] = useMemo(() => {
    if (!workflow) return []
    return workflow.edges.map((e) => {
      const sourceStatus = nodeStepMap[e.sourceNodeId]?.status
      const targetStatus = nodeStepMap[e.targetNodeId]?.status
      return {
        id: e.id,
        source: e.sourceNodeId,
        target: e.targetNodeId,
        type: 'custom',
        data: {
          sourceStatus,
          targetStatus,
          viewMode,
        },
      }
    })
  }, [workflow, nodeStepMap, viewMode])

  // Local edge state for selection tracking (same pattern as nodes)
  const [localEdges, setLocalEdges] = useState<Edge[]>(storeEdges)
  const prevStoreEdgesRef = useRef(storeEdges)

  useEffect(() => {
    if (storeEdges !== prevStoreEdgesRef.current) {
      setLocalEdges(storeEdges)
      prevStoreEdgesRef.current = storeEdges
    }
  }, [storeEdges])

  // Handle all node changes (drag, select, remove) with smooth local updates
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // In execution mode, only allow selection changes
      if (isExecMode) {
        const selectOnly = changes.filter((c) => c.type === 'select')
        if (selectOnly.length) setNodes((nds) => applyNodeChanges(selectOnly, nds))
        return
      }

      const removals = changes.filter((c) => c.type === 'remove')
      const rest = changes.filter((c) => c.type !== 'remove')

      for (const r of removals) removeNode(r.id)
      if (rest.length) setNodes((nds) => applyNodeChanges(rest, nds))

      // Sync final position to store on drag stop
      for (const change of rest) {
        if (change.type === 'position' && change.dragging === false && change.position) {
          updateNodePosition(change.id, change.position)
        }
      }
    },
    [isExecMode, removeNode, updateNodePosition]
  )

  // Handle edge changes (select, remove)
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (isExecMode) return // read-only in execution mode

      const removals = changes.filter((c) => c.type === 'remove')
      const rest = changes.filter((c) => c.type !== 'remove')

      for (const r of removals) removeEdge(r.id)
      if (rest.length) setLocalEdges((eds) => applyEdgeChanges(rest, eds))
    },
    [isExecMode, removeEdge]
  )

  const handlePaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const handleConnect: OnConnect = useCallback(
    (params) => {
      if (isExecMode) return // no edge creation in execution mode
      if (!params.source || !params.target) return
      addEdgeToStore({
        id: `edge_${Date.now()}`,
        sourceNodeId: params.source,
        sourcePortKey: params.sourceHandle ?? 'default',
        targetNodeId: params.target,
        targetPortKey: params.targetHandle ?? 'default',
      })
    },
    [isExecMode, addEdgeToStore]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={localEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      deleteKeyCode={isExecMode ? [] : ['Delete', 'Backspace']}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      onConnect={handleConnect}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      defaultEdgeOptions={{ type: 'custom' }}
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
      snapToGrid
      snapGrid={[10, 10]}
      nodesDraggable={!isExecMode}
      nodesConnectable={!isExecMode}
      elementsSelectable
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
