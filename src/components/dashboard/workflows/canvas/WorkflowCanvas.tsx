/**
 * WorkflowCanvas
 * React Flow canvas wrapper for the workflow editor
 */

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type OnNodeDrag,
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
  const isRunning = useWorkflowEditorStore((s) => s.isRunning)
  const selectNode = useWorkflowEditorStore((s) => s.selectNode)
  const updateNodePosition = useWorkflowEditorStore((s) => s.updateNodePosition)

  const nodes: Node[] = useMemo(() => {
    if (!workflow) return []
    return workflow.nodes.map((n) => ({
      id: n.id,
      type: 'custom',
      position: n.position,
      data: { nodeType: n.type, isRunning },
    }))
  }, [workflow, isRunning])

  const edges: Edge[] = useMemo(() => {
    if (!workflow) return []
    return workflow.edges.map((e) => ({
      id: e.id,
      source: e.sourceNodeId,
      target: e.targetNodeId,
      type: 'custom',
      data: { animated: isRunning },
    }))
  }, [workflow, isRunning])

  const handleNodeDragStop: OnNodeDrag = useCallback(
    (_, node) => {
      updateNodePosition(node.id, node.position)
    },
    [updateNodePosition]
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

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeDragStop={handleNodeDragStop}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
