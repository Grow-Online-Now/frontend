/**
 * WorkflowEditorPage
 * Full workflow editor with canvas, palette, config panel, and execution history
 */

import { useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ReactFlowProvider } from '@xyflow/react'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { MOCK_WORKFLOWS, MOCK_EDITOR_NODES, MOCK_EDITOR_EDGES } from '@/data/workflow-mocks'
import { EditorHeader } from '@/components/dashboard/workflows/editor/EditorHeader'
import { WorkflowCanvas } from '@/components/dashboard/workflows/canvas/WorkflowCanvas'
import { NodePalette } from '@/components/dashboard/workflows/palette/NodePalette'
import { NodeConfigPanel } from '@/components/dashboard/workflows/config/NodeConfigPanel'
import { ExecutionPanel } from '@/components/dashboard/workflows/executions/ExecutionPanel'

export default function WorkflowEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const localizedHref = useLocalizedHref()
  const setWorkflow = useWorkflowEditorStore((s) => s.setWorkflow)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const reset = useWorkflowEditorStore((s) => s.reset)

  useEffect(() => {
    const wf = MOCK_WORKFLOWS.find((w) => w.id === id)
    if (wf) {
      setWorkflow({
        ...wf,
        nodes: MOCK_EDITOR_NODES,
        edges: MOCK_EDITOR_EDGES,
      })
    }
    return () => reset()
  }, [id, setWorkflow, reset])

  const handleBack = useCallback(() => {
    navigate(localizedHref('/dashboard/workflows'))
  }, [navigate, localizedHref])

  return (
    <div className="-m-6 flex h-[calc(100vh-0px)] flex-col overflow-hidden lg:-m-8">
      <EditorHeader onBack={handleBack} />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas + overlays */}
        <div className="flex flex-1 flex-col">
          <div className="relative flex-1">
            <ReactFlowProvider>
              <WorkflowCanvas />
            </ReactFlowProvider>
            <NodePalette />
          </div>
          <ExecutionPanel />
        </div>

        {/* Right config panel */}
        {selectedNodeId && <NodeConfigPanel />}
      </div>
    </div>
  )
}
