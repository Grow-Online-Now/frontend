import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAutomation } from '@/hooks/useAutomations'
import {
  activateAutomation,
  pauseAutomation,
  triggerAutomationRun,
  deleteAutomation,
} from '@/services/automations.service'
import { ChannelBanner } from '@/components/dashboard/automations/ChannelBanner'
import { OverviewTab } from '@/components/dashboard/automations/detail/OverviewTab'
import { ClipsTab } from '@/components/dashboard/automations/detail/ClipsTab'
import { ConfigurationTab } from '@/components/dashboard/automations/detail/ConfigurationTab'
import { LogsTab } from '@/components/dashboard/automations/detail/LogsTab'
import { toast } from 'sonner'

const statusColors: Record<string, string> = {
  active: 'bg-success-muted text-success',
  paused: 'bg-warning-muted text-warning',
  failed: 'bg-error-muted text-error',
  draft: 'bg-bg-hover text-text-tertiary',
}

export default function AutomationDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en', id } = useParams<{ lang: string; id: string }>()
  const { automation, isLoading, refetch } = useAutomation(id)

  if (isLoading || !automation) {
    return (
      <div>
        <div className="bg-bg-elevated border-border-default h-32 animate-pulse rounded-xl border" />
        <div className="bg-bg-elevated border-border-default mt-4 h-64 animate-pulse rounded-xl border" />
      </div>
    )
  }

  const isYoutube = automation.templateType === 'youtube_to_clips'
  const runs = automation.runs || []
  const failedRuns = runs.filter((r) => r.status === 'failed')
  const consecutiveFailures = getConsecutiveFailures(runs)
  const channelMeta = automation.sourceConfig.channelMeta
  const channelName = channelMeta?.name || automation.name
  const channelHandle =
    channelMeta?.handle || extractHandle(automation.sourceConfig.channelUrl, isYoutube)

  const handleActivate = async () => {
    try {
      await activateAutomation(automation.id)
      toast.success(t('dashboard.automations.board.resumed'))
      refetch()
    } catch {
      toast.error(t('dashboard.automations.board.resumeFailed'))
    }
  }

  const handlePause = async () => {
    try {
      await pauseAutomation(automation.id)
      toast.success(t('dashboard.automations.board.paused'))
      refetch()
    } catch {
      toast.error(t('dashboard.automations.board.pauseFailed'))
    }
  }

  const handleRun = async () => {
    try {
      await triggerAutomationRun(automation.id)
      toast.success(t('dashboard.automations.board.retryStarted'))
      refetch()
    } catch {
      toast.error(t('dashboard.automations.board.retryFailed'))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAutomation(automation.id)
      toast.success(t('dashboard.automations.actions.delete'))
      navigate(`/${lang}/dashboard/automations`)
    } catch {
      toast.error(t('dashboard.automations.board.retryFailed'))
    }
  }

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate(`/${lang}/dashboard/automations`)}
        className="text-text-tertiary hover:text-text-primary mb-4 flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('dashboard.automations.title')}
      </button>

      {/* Channel banner header */}
      <div className="border-border-default overflow-hidden rounded-xl border">
        <ChannelBanner
          channelName={channelName}
          platform={isYoutube ? 'youtube' : 'twitch'}
          size="lg"
        />

        {/* Avatar row — overlaps banner */}
        <div className="-mt-7 px-5">
          <div className="relative inline-block">
            <div className="bg-bg-active border-bg-subtle flex h-14 w-14 items-center justify-center rounded-full border-4 text-lg font-semibold">
              {channelMeta?.thumbnailUrl ? (
                <img
                  src={channelMeta.thumbnailUrl}
                  alt={channelName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                channelName.charAt(0).toUpperCase()
              )}
            </div>
            <div
              className={`absolute -right-0.5 bottom-0 h-3.5 w-3.5 rounded-full border-2 ${
                isYoutube ? 'bg-[#FF0000]' : 'bg-[#9146FF]'
              } border-bg-subtle`}
            />
          </div>
        </div>

        {/* Info + actions row — fully below banner */}
        <div className="flex items-start justify-between px-5 pt-2 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-text-primary text-xl font-semibold tracking-tight">
                {channelName}
              </h1>
              <Badge
                className={`${statusColors[automation.status]} border-0 text-xs font-medium`}
              >
                {t(`dashboard.automations.status.${automation.status}`)}
              </Badge>
            </div>
            <p className="text-text-tertiary mt-0.5 text-sm">
              {isYoutube ? 'youtube.com/' : 'twitch.tv/'}
              {channelHandle}
              {channelMeta?.subscriberCount != null && (
                <>
                  {' · '}
                  {formatCount(channelMeta.subscriberCount)}{' '}
                  {t('dashboard.automations.board.subscribers')}
                </>
              )}
              {channelMeta?.videoCount != null && (
                <>
                  {' · '}
                  {channelMeta.videoCount}{' '}
                  {t('dashboard.automations.board.videos')}
                </>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {automation.status === 'active' && (
              <>
                <Button size="sm" onClick={handleRun} className="gap-1.5">
                  <Play className="h-3.5 w-3.5" />
                  {t('dashboard.automations.detail.runNow')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePause}
                  className="gap-1.5"
                >
                  <Pause className="h-3.5 w-3.5" />
                  {t('dashboard.automations.actions.pause')}
                </Button>
              </>
            )}
            {(automation.status === 'failed' ||
              (automation.status === 'paused' && failedRuns.length > 0)) && (
              <>
                <Button size="sm" onClick={handleRun} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t('dashboard.automations.detail.retryNow')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePause}
                  className="gap-1.5"
                >
                  <Pause className="h-3.5 w-3.5" />
                  {t('dashboard.automations.actions.pause')}
                </Button>
              </>
            )}
            {automation.status === 'paused' && failedRuns.length === 0 && (
              <Button size="sm" onClick={handleActivate} className="gap-1.5">
                <Play className="h-3.5 w-3.5" />
                {t('dashboard.automations.actions.activate')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-text-muted hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error alert banner (failed automations) */}
      {consecutiveFailures > 0 && automation.status !== 'active' && (
        <div className="bg-error-muted/50 border-border-default mt-4 rounded-xl border border-red-900/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-error mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-error text-sm font-medium">
                {t('dashboard.automations.detail.pipelineFailing', {
                  count: consecutiveFailures,
                })}
              </p>
              <p className="text-text-secondary mt-1 text-sm">
                {t('dashboard.automations.detail.pipelineFailingDesc')}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={handleRun} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t('dashboard.automations.detail.retryNow')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const logsTab = document.querySelector(
                      '[data-value="logs"]'
                    ) as HTMLElement
                    logsTab?.click()
                  }}
                  className="gap-1.5"
                >
                  {t('dashboard.automations.detail.viewLogs')}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  {t('dashboard.automations.detail.editConfiguration')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabbed content */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border-default bg-transparent p-0">
          {(['overview', 'clips', 'configuration', 'logs'] as const).map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                data-value={tab}
                className="h-auto flex-none rounded-none border-0 border-b-2 border-b-transparent bg-transparent px-0 pt-0 pb-3 text-sm font-normal text-text-muted shadow-none transition-none hover:text-text-secondary data-[state=active]:border-b-text-primary data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-text-primary data-[state=active]:shadow-none"
              >
                {t(`dashboard.automations.detail.tabs.${tab}`)}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab automation={automation} />
        </TabsContent>
        <TabsContent value="clips" className="mt-6">
          <ClipsTab automation={automation} />
        </TabsContent>
        <TabsContent value="configuration" className="mt-6">
          <ConfigurationTab automation={automation} />
        </TabsContent>
        <TabsContent value="logs" className="mt-6">
          <LogsTab automation={automation} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function extractHandle(url: string, isYoutube: boolean): string {
  if (isYoutube) {
    const match = url.match(/@([^/?\s]+)/)
    return match ? `@${match[1]}` : url
  }
  const match = url.match(/twitch\.tv\/([^/?\s]+)/)
  return match ? match[1] : url
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return String(count)
}

function getConsecutiveFailures(
  runs: NonNullable<import('@/types/automation').Automation['runs']>
): number {
  let count = 0
  for (const run of runs) {
    if (run.status === 'failed') {
      count++
    } else {
      break
    }
  }
  return count
}
