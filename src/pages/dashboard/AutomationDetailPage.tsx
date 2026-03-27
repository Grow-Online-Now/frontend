import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAutomation } from '@/hooks/useAutomations'
import {
  activateAutomation,
  pauseAutomation,
  triggerAutomationRun,
  deleteAutomation,
} from '@/services/automations.service'
import type { AutomationRunStatus } from '@/types/automation'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  active: 'bg-success-muted text-success',
  paused: 'bg-warning-muted text-warning',
  draft: 'bg-bg-hover text-text-tertiary',
}

const runStatusIcons: Record<AutomationRunStatus, typeof CheckCircle2> = {
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  no_new_content: AlertTriangle,
}

const runStatusColors: Record<AutomationRunStatus, string> = {
  running: 'text-info',
  completed: 'text-success',
  failed: 'text-error',
  no_new_content: 'text-warning',
}

export default function AutomationDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en', id } = useParams<{ lang: string; id: string }>()
  const { automation, isLoading, refetch } = useAutomation(id)

  if (isLoading || !automation) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="bg-bg-elevated border-border-default h-64 animate-pulse rounded-xl border" />
      </div>
    )
  }

  const isYoutube = automation.templateType === 'youtube_to_clips'
  const runs = automation.runs || []

  const handleActivate = async () => {
    try {
      await activateAutomation(automation.id)
      toast.success('Automation activated')
      refetch()
    } catch {
      toast.error('Failed to activate')
    }
  }

  const handlePause = async () => {
    try {
      await pauseAutomation(automation.id)
      toast.success('Automation paused')
      refetch()
    } catch {
      toast.error('Failed to pause')
    }
  }

  const handleRun = async () => {
    try {
      await triggerAutomationRun(automation.id)
      toast.success('Automation run started')
      refetch()
    } catch {
      toast.error('Failed to trigger run')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAutomation(automation.id)
      toast.success('Automation deleted')
      navigate(`/${lang}/dashboard/automations`)
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <button
        onClick={() => navigate(`/${lang}/dashboard/automations`)}
        className="text-text-tertiary hover:text-text-primary mb-4 flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('dashboard.automations.title')}
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-text-primary text-2xl font-semibold tracking-tight">
              {automation.name}
            </h1>
            <Badge className={`${statusColors[automation.status]} border-0 text-xs font-medium`}>
              {t(`dashboard.automations.status.${automation.status}`)}
            </Badge>
          </div>
          <p className="text-text-tertiary mt-1 text-sm">
            {isYoutube ? 'YouTube' : 'Twitch'} — {automation.sourceConfig.channelUrl}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRun}>
            <Play className="mr-1 h-4 w-4" />
            {t('dashboard.automations.detail.runNow')}
          </Button>
          {automation.status === 'active' ? (
            <Button variant="outline" size="sm" onClick={handlePause}>
              <Pause className="mr-1 h-4 w-4" />
              {t('dashboard.automations.actions.pause')}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleActivate}>
              <Play className="mr-1 h-4 w-4" />
              {t('dashboard.automations.actions.activate')}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label={t('dashboard.automations.detail.totalRuns')} value={String(runs.length)} />
        <StatCard
          label={t('dashboard.automations.detail.totalClips')}
          value={String(runs.reduce((sum, r) => sum + r.postsScheduled, 0))}
        />
        <StatCard
          label={t('dashboard.automations.card.clipsPerDay', {
            count: automation.postingConfig.clipsPerDay,
          })}
          value={automation.postingConfig.postingTimes.join(', ')}
        />
      </div>

      {/* Configuration summary */}
      <div className="bg-bg-elevated border-border-default mt-6 rounded-xl border p-5">
        <h2 className="text-text-primary text-sm font-semibold">
          {t('dashboard.automations.detail.configuration')}
        </h2>
        <div className="mt-4 space-y-3">
          <ConfigRow
            label={t('dashboard.automations.wizard.review.clipSettings')}
            value={`${automation.clipConfig.n_clips} clips, ${automation.clipConfig.clip_duration_min}-${automation.clipConfig.clip_duration_max}s, ${automation.clipConfig.tone}`}
          />
          <ConfigRow
            label={t('dashboard.automations.wizard.review.schedule')}
            value={`${automation.postingConfig.clipsPerDay} clips/day — ${automation.postingConfig.socialAccountIds.length} platform(s)`}
          />
        </div>
      </div>

      {/* Run history */}
      <div className="mt-6">
        <h2 className="text-text-primary text-sm font-semibold">
          {t('dashboard.automations.detail.runHistory')}
        </h2>

        {runs.length === 0 ? (
          <p className="text-text-muted mt-4 text-sm">{t('dashboard.automations.detail.noRuns')}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {runs.map((run) => {
              const StatusIcon = runStatusIcons[run.status as AutomationRunStatus] || Clock
              const colorClass =
                runStatusColors[run.status as AutomationRunStatus] || 'text-text-muted'

              return (
                <div
                  key={run.id}
                  className="bg-bg-elevated border-border-default flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  <StatusIcon
                    className={`h-4 w-4 ${colorClass} ${run.status === 'running' ? 'animate-spin' : ''}`}
                  />
                  <div className="flex-1">
                    <p className="text-text-primary text-sm">
                      {run.videoTitle ||
                        run.videoUrl ||
                        t(`dashboard.automations.runStatus.${run.status}`)}
                    </p>
                    <p className="text-text-muted text-xs">
                      {new Date(run.startedAt).toLocaleString()} —{' '}
                      {run.clipsGenerated > 0 &&
                        `${run.clipsGenerated} clips, ${run.postsScheduled} posts`}
                      {run.error && <span className="text-error"> {run.error}</span>}
                    </p>
                  </div>
                  <Badge
                    className={`${runStatusColors[run.status as AutomationRunStatus] || 'text-text-muted'} border-0 bg-transparent text-xs`}
                  >
                    {t(`dashboard.automations.runStatus.${run.status}`)}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-elevated border-border-default rounded-lg border px-4 py-3">
      <dt className="text-text-muted text-xs">{label}</dt>
      <dd className="text-text-primary mt-1 text-sm font-semibold">{value}</dd>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-tertiary text-sm">{label}</span>
      <span className="text-text-primary text-sm">{value}</span>
    </div>
  )
}
