/**
 * WorkflowCanvas Component
 * React Flow canvas for the workflow editor
 */

import { useCallback, useRef, useMemo } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type OnConnect,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { WorkflowNodeMemo, type WorkflowNodeData } from './WorkflowNode'
import type {
  NodeDefinition,
  EdgeDefinition,
  NodeHandlerDescriptor,
  WorkflowDefinition,
} from '@/types/automations'

interface WorkflowCanvasProps {
  definition: WorkflowDefinition
  nodeRegistry: NodeHandlerDescriptor[]
  onDefinitionChange: (definition: WorkflowDefinition) => void
  onNodeSelect: (node: NodeDefinition | null) => void
  selectedNodeId: string | null
}

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNodeMemo,
}

let nodeIdCounter = 0
function generateNodeId() {
  nodeIdCounter++
  return `node_${Date.now()}_${nodeIdCounter}`
}

function generateEdgeId() {
  return `edge_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function toFlowNodes(
  nodes: NodeDefinition[],
  registry: NodeHandlerDescriptor[]
): Node[] {
  return nodes.map((n) => {
    const descriptor = registry.find((r) => r.type === n.type)
    return {
      id: n.id,
      type: 'workflowNode',
      position: n.position || { x: 0, y: 0 },
      data: {
        label: n.label,
        nodeType: n.type,
        category: descriptor?.category || 'processor',
        description: descriptor?.description,
      } satisfies WorkflowNodeData,
    }
  })
}

function toFlowEdges(edges: EdgeDefinition[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: 'var(--border-emphasis)' },
  }))
}

export function WorkflowCanvas({
  definition,
  nodeRegistry,
  onDefinitionChange,
  onNodeSelect,
  selectedNodeId,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(
    toFlowNodes(definition.nodes, nodeRegistry)
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    toFlowEdges(definition.edges)
  )

  // Sync definition changes back to parent
  const syncDefinition = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      const nodeDefs: NodeDefinition[] = newNodes.map((n) => {
        const existing = definition.nodes.find((dn) => dn.id === n.id)
        const data = n.data as unknown as WorkflowNodeData
        return {
          id: n.id,
          type: data.nodeType,
          label: data.label,
          config: existing?.config || {},
          position: { x: n.position.x, y: n.position.y },
        }
      })

      const edgeDefs: EdgeDefinition[] = newEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      }))

      onDefinitionChange({ nodes: nodeDefs, edges: edgeDefs })
    },
    [definition.nodes, onDefinitionChange]
  )

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          { ...params, id: generateEdgeId(), animated: true, style: { stroke: 'var(--border-emphasis)' } },
          eds
        )
        // Sync after state update
        setTimeout(() => syncDefinition(nodes, newEdges), 0)
        return newEdges
      })
    },
    [setEdges, nodes, syncDefinition]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const existing = definition.nodes.find((n) => n.id === node.id)
      if (existing) {
        onNodeSelect(existing)
      }
    },
    [definition.nodes, onNodeSelect]
  )

  const onPaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes)
      // Sync positions on drag end
      const hasDragEnd = changes.some(
        (c) => c.type === 'position' && !('dragging' in c && c.dragging)
      )
      if (hasDragEnd) {
        setNodes((currentNodes) => {
          setTimeout(() => syncDefinition(currentNodes, edges), 0)
          return currentNodes
        })
      }
    },
    [onNodesChange, setNodes, edges, syncDefinition]
  )

  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes)
      setEdges((currentEdges) => {
        setTimeout(() => syncDefinition(nodes, currentEdges), 0)
        return currentEdges
      })
    },
    [onEdgesChange, setEdges, nodes, syncDefinition]
  )

  // Handle drop from palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const data = event.dataTransfer.getData('application/reactflow-node')
      if (!data) return

      const nodeType: NodeHandlerDescriptor = JSON.parse(data)

      const bounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!bounds) return

      const position = {
        x: event.clientX - bounds.left - 90,
        y: event.clientY - bounds.top - 30,
      }

      const newNodeId = generateNodeId()
      const newNode: Node = {
        id: newNodeId,
        type: 'workflowNode',
        position,
        data: {
          label: nodeType.label,
          nodeType: nodeType.type,
          category: nodeType.category,
          description: nodeType.description,
        } satisfies WorkflowNodeData,
      }

      const newNodeDef: NodeDefinition = {
        id: newNodeId,
        type: nodeType.type,
        label: nodeType.label,
        config: {},
        position,
      }

      setNodes((nds) => [...nds, newNode])
      onDefinitionChange({
        nodes: [...definition.nodes, newNodeDef],
        edges: definition.edges,
      })
    },
    [definition, onDefinitionChange, setNodes]
  )

  // Update nodes when definition changes externally (e.g., config panel edits)
  const selectedNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === selectedNodeId,
      })),
    [nodes, selectedNodeId]
  )

  return (
    <div ref={reactFlowWrapper} className="flex-1">
      <ReactFlow
        nodes={selectedNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-bg-base"
      >
        <Controls className="!bg-bg-elevated !border-border !shadow-sm [&>button]:!bg-bg-elevated [&>button]:!border-border [&>button]:!fill-text-secondary hover:[&>button]:!bg-bg-hover" />
        <MiniMap
          className="!bg-bg-elevated !border-border"
          nodeColor="var(--border-emphasis)"
          maskColor="var(--bg-base)"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border-default)" />
      </ReactFlow>
    </div>
  )
}
