/**
 * WorkflowEditorPage
 * Full workflow editor with canvas, palette, config panel, and execution history
 */

import { useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ReactFlowProvider } from '@xyflow/react'
import { Loader2 } from 'lucide-react'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { useWorkflowDetail } from '@/hooks/useWorkflowDetail'
import { useNodeTypes } from '@/hooks/useNodeTypes'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { EditorHeader } from '@/components/dashboard/workflows/editor/EditorHeader'
import { WorkflowCanvas } from '@/components/dashboard/workflows/canvas/WorkflowCanvas'
import { NodePalette } from '@/components/dashboard/workflows/palette/NodePalette'
import { NodeConfigPanel } from '@/components/dashboard/workflows/config/NodeConfigPanel'
import { ExecutionPanel } from '@/components/dashboard/workflows/executions/ExecutionPanel'

export default function WorkflowEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const localizedHref = useLocalizedHref()
  const { workflow, isLoading: isLoadingWorkflow } = useWorkflowDetail(id)
  const { nodeTypeMap, nodesByCategory, isLoading: isLoadingNodeTypes } = useNodeTypes()
  const setWorkflow = useWorkflowEditorStore((s) => s.setWorkflow)
  const setNodeTypeMap = useWorkflowEditorStore((s) => s.setNodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const reset = useWorkflowEditorStore((s) => s.reset)

  useEffect(() => {
    if (workflow) {
      setWorkflow(workflow)
    }
  }, [workflow, setWorkflow])

  useEffect(() => {
    if (Object.keys(nodeTypeMap).length > 0) {
      setNodeTypeMap(nodeTypeMap)
    }
  }, [nodeTypeMap, setNodeTypeMap])

  useEffect(() => {
    return () => reset()
  }, [reset])

  const handleBack = useCallback(() => {
    navigate(localizedHref('/dashboard/workflows'))
  }, [navigate, localizedHref])

  if (isLoadingWorkflow || isLoadingNodeTypes) {
    return (
      <div className="-m-6 flex h-[calc(100vh-0px)] items-center justify-center lg:-m-8">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    )
  }

  return (
    <div className="dark -m-6 flex h-[calc(100vh-0px)] flex-col overflow-hidden pt-2 lg:-m-8">
      <EditorHeader onBack={handleBack} />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas + overlays */}
        <div className="flex flex-1 flex-col">
          <div className="relative flex-1">
            <ReactFlowProvider>
              <WorkflowCanvas />
            </ReactFlowProvider>
            <NodePalette nodesByCategory={nodesByCategory} />
          </div>
          <ExecutionPanel />
        </div>

        {/* Right config panel */}
        {selectedNodeId && <NodeConfigPanel />}
      </div>
    </div>
  )
}
