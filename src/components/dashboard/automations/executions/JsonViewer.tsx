/**
 * JsonViewer Component
 * Formatted JSON display for step input/output data
 */

import { cn } from '@/lib/utils'

interface JsonViewerProps {
  data: Record<string, unknown> | null
  className?: string
}

export function JsonViewer({ data, className }: JsonViewerProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <span className="text-text-muted text-xs italic">-</span>
    )
  }

  return (
    <pre
      className={cn(
        'bg-bg-subtle border-border overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-relaxed',
        className
      )}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
