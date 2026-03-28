import { useTranslation } from 'react-i18next'
import { format, isToday, isYesterday } from 'date-fns'
import { ScrollText } from 'lucide-react'
import type { Automation, AutomationRunStatus } from '@/types/automation'

interface LogsTabProps {
  automation: Automation
}

const dotColors: Record<AutomationRunStatus, string> = {
  completed: 'bg-success',
  failed: 'bg-error',
  running: 'bg-warning',
  no_new_content: 'bg-warning',
}

export function LogsTab({ automation }: LogsTabProps) {
  const { t } = useTranslation()

  const runs = automation.runs || []

  if (runs.length === 0) {
    return (
      <div className="bg-bg-elevated border-border-default rounded-xl border p-8 text-center">
        <ScrollText className="text-text-muted mx-auto h-6 w-6" />
        <p className="text-text-primary mt-3 text-sm font-medium">
          {t('dashboard.automations.detail.logs.empty')}
        </p>
        <p className="text-text-muted mt-1 text-sm">
          {t('dashboard.automations.detail.logs.emptyDesc')}
        </p>
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      {runs.map((run, index) => {
        const date = new Date(run.startedAt)
        const timestamp = formatTimestamp(date)
        const isLast = index === runs.length - 1
        const status = run.status as AutomationRunStatus

        const statusTitle = getStatusTitle(status, run.clipsGenerated, run.error, t)

        return (
          <div key={run.id} className="relative flex gap-4 pb-6">
            {/* Timeline line */}
            {!isLast && (
              <div className="bg-border-default absolute left-[7px] top-5 bottom-0 w-px" />
            )}

            {/* Dot */}
            <div
              className={`relative z-10 mt-1.5 h-4 w-4 flex-shrink-0 rounded-full ${dotColors[status] || 'bg-text-muted'}`}
            />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-text-muted text-xs">{timestamp}</p>
              <p className="text-text-primary mt-0.5 text-sm font-medium">{statusTitle}</p>

              {run.videoTitle && (
                <p className="text-text-tertiary mt-1 text-xs">
                  {t('dashboard.automations.detail.logs.processing')}{' '}
                  &lsquo;{run.videoTitle}&rsquo;
                </p>
              )}

              {status === 'failed' && run.error && (
                <div className="mt-2 rounded bg-error-muted/50 px-3 py-1.5 font-mono text-xs text-error">
                  {run.error}
                </div>
              )}

              {status === 'completed' && run.postsScheduled > 0 && (
                <p className="text-text-tertiary mt-1 text-xs">
                  {t('dashboard.automations.detail.logs.postedTo', {
                    platforms: `${run.postsScheduled} platform(s)`,
                  })}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatTimestamp(date: Date): string {
  const time = format(date, 'HH:mm')
  if (isToday(date)) return `Today, ${time}`
  if (isYesterday(date)) return `Yesterday, ${time}`
  return `${format(date, 'MMM d')}, ${time}`
}

function getStatusTitle(
  status: AutomationRunStatus,
  clipsGenerated: number,
  error: string | null,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  switch (status) {
    case 'failed':
      return error?.toLowerCase().includes('timeout')
        ? t('dashboard.automations.detail.logs.failedTimeout')
        : `${t('dashboard.automations.runStatus.failed')} — ${error || t('dashboard.automations.detail.logs.error')}`
    case 'completed':
      return t('dashboard.automations.detail.logs.success', { count: clipsGenerated })
    case 'running':
      return t('dashboard.automations.runStatus.running')
    case 'no_new_content':
      return t('dashboard.automations.runStatus.no_new_content')
    default:
      return status
  }
}
