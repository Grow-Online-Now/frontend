/**
 * WorkflowEditorPage
 * Full-screen visual workflow editor
 */

import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { ReactFlowProvider } from '@xyflow/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { useWorkflow } from '@/hooks/useWorkflow'
import { useNodeRegistry } from '@/hooks/useNodeRegistry'
import { executeWorkflow } from '@/services/automations.service'
import { EditorTopBar } from '@/components/dashboard/automations/editor/EditorTopBar'
import { NodePalette } from '@/components/dashboard/automations/editor/NodePalette'
import { WorkflowCanvas } from '@/components/dashboard/automations/editor/WorkflowCanvas'
import { NodeConfigPanel } from '@/components/dashboard/automations/editor/NodeConfigPanel'
import type { NodeDefinition, WorkflowDefinition, WorkflowStatus } from '@/types/automations'

export default function WorkflowEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { workflow, isLoading, error, updateWorkflow } = useWorkflow(id)
  const { nodeTypes, isLoading: nodesLoading } = useNodeRegistry()
  const [selectedNode, setSelectedNode] = useState<NodeDefinition | null>(null)
  const [localDefinition, setLocalDefinition] = useState<WorkflowDefinition | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const currentDefinition = useMemo(
    () => localDefinition || workflow?.definition || { nodes: [], edges: [] },
    [localDefinition, workflow?.definition]
  )

  const handleDefinitionChange = useCallback((definition: WorkflowDefinition) => {
    setLocalDefinition(definition)
  }, [])

  const handleNodeSelect = useCallback(
    (node: NodeDefinition | null) => {
      if (node) {
        // Find from local definition to get latest config
        const def = localDefinition || workflow?.definition
        const latest = def?.nodes.find((n) => n.id === node.id) || node
        setSelectedNode(latest)
      } else {
        setSelectedNode(null)
      }
    },
    [localDefinition, workflow?.definition]
  )

  const handleNodeConfigChange = useCallback(
    (updatedNode: NodeDefinition) => {
      setSelectedNode(updatedNode)
      const def = localDefinition || workflow?.definition
      if (!def) return
      const updatedNodes = def.nodes.map((n) =>
        n.id === updatedNode.id ? updatedNode : n
      )
      setLocalDefinition({ ...def, nodes: updatedNodes })
    },
    [localDefinition, workflow?.definition]
  )

  const handleSave = useCallback(async () => {
    if (!localDefinition && !workflow) return
    setIsSaving(true)
    try {
      await updateWorkflow({ definition: currentDefinition })
      toast.success(t('dashboard.automations.editor.saved'))
    } catch {
      toast.error(t('dashboard.automations.editor.saveFailed'))
    } finally {
      setIsSaving(false)
    }
  }, [currentDefinition, localDefinition, workflow, updateWorkflow, t])

  const handleNameChange = useCallback(
    async (name: string) => {
      await updateWorkflow({ name })
    },
    [updateWorkflow]
  )

  const handleStatusChange = useCallback(
    async (status: WorkflowStatus) => {
      // Save definition first if there are unsaved changes
      if (localDefinition) {
        await updateWorkflow({ definition: localDefinition, status })
      } else {
        await updateWorkflow({ status })
      }
      toast.success(t('dashboard.automations.editor.statusChanged'))
    },
    [localDefinition, updateWorkflow, t]
  )

  const handleRun = useCallback(async () => {
    if (!id) return
    try {
      const execution = await executeWorkflow(id)
      toast.success(t('dashboard.automations.editor.executionStarted'))
      navigate(`/${lang}/dashboard/automations/executions/${execution.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('dashboard.automations.editor.executionFailed'))
    }
  }, [id, lang, navigate, t])

  // Compute available variables for the selected node
  const availableVariables = (() => {
    if (!selectedNode || selectedNode.type !== 'text-template') return []
    // Find upstream nodes through edges
    const def = currentDefinition
    const upstreamNodeIds = new Set<string>()
    const findUpstream = (nodeId: string) => {
      def.edges
        .filter((e) => e.target === nodeId)
        .forEach((e) => {
          upstreamNodeIds.add(e.source)
          findUpstream(e.source)
        })
    }
    findUpstream(selectedNode.id)
    // Collect output keys from upstream trigger nodes
    const vars: string[] = []
    def.nodes
      .filter((n) => upstreamNodeIds.has(n.id))
      .forEach((n) => {
        if (n.type === 'manual-trigger') {
          vars.push('triggeredAt', 'triggeredBy')
        }
      })
    return vars
  })()

  if (isLoading || nodesLoading) {
    return (
      <div className="bg-bg-base flex h-screen items-center justify-center">
        <Loader2 className="text-text-muted size-8 animate-spin" />
      </div>
    )
  }

  if (error || !workflow) {
    return (
      <div className="bg-bg-base flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-text-secondary text-sm">
          {error || t('dashboard.automations.editor.notFound')}
        </p>
        <button
          type="button"
          onClick={() => navigate(`/${lang}/dashboard/automations`)}
          className="text-text-primary text-sm underline"
        >
          {t('dashboard.automations.editor.backToList')}
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <EditorTopBar
        workflow={workflow}
        isSaving={isSaving}
        onSave={handleSave}
        onRun={handleRun}
        onNameChange={handleNameChange}
        onStatusChange={handleStatusChange}
      />

      <div className="flex flex-1 overflow-hidden">
        <NodePalette nodeTypes={nodeTypes} />

        <ReactFlowProvider>
          <WorkflowCanvas
            definition={currentDefinition}
            nodeRegistry={nodeTypes}
            onDefinitionChange={handleDefinitionChange}
            onNodeSelect={handleNodeSelect}
            selectedNodeId={selectedNode?.id || null}
          />
        </ReactFlowProvider>

        {selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onChange={handleNodeConfigChange}
            onClose={() => setSelectedNode(null)}
            availableVariables={availableVariables}
          />
        )}
      </div>

      <Toaster position="bottom-right" />
    </div>
  )
}
