import { useTranslation } from 'react-i18next'
import { RefreshCw, Pause, Play, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChannelBanner } from './ChannelBanner'
import type { Automation } from '@/types/automation'

interface AutomationBoardCardProps {
  automation: Automation
  onRetry: () => void
  onPause: () => void
  onResume: () => void
  onClick: () => void
}

function extractChannelInfo(automation: Automation) {
  const url = automation.sourceConfig.channelUrl
  const meta = automation.sourceConfig.channelMeta
  const isYoutube = automation.templateType === 'youtube_to_clips'

  let handle = ''
  if (isYoutube) {
    const match = url.match(/@([^/?\s]+)/)
    handle = match ? `@${match[1]}` : url
  } else {
    const match = url.match(/twitch\.tv\/([^/?\s]+)/)
    handle = match ? `@${match[1]}` : url
  }

  return {
    name: meta?.name || automation.name,
    handle: meta?.handle || handle,
    initial: (meta?.name || automation.name).charAt(0).toUpperCase(),
    subscriberCount: meta?.subscriberCount || null,
    videoCount: meta?.videoCount || null,
    isYoutube,
  }
}

function formatCount(count: number | null): string {
  if (count === null) return ''
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return String(count)
}

export function AutomationBoardCard({
  automation,
  onRetry,
  onPause,
  onResume,
  onClick,
}: AutomationBoardCardProps) {
  const { t } = useTranslation()
  const channel = extractChannelInfo(automation)
  const thumbnailUrl = automation.sourceConfig.channelMeta?.thumbnailUrl
  const runs = automation.runs || []
  const failedRuns = runs.filter((r) => r.status === 'failed')
  const lastError = failedRuns[0]?.error || null

  return (
    <div
      onClick={onClick}
      className="bg-bg-elevated border-border-default hover:border-border-emphasis cursor-pointer overflow-hidden rounded-xl border transition-all duration-150"
    >
      {/* Banner */}
      <ChannelBanner
        channelName={channel.name}
        platform={channel.isYoutube ? 'youtube' : 'twitch'}
        size="sm"
      />

      {/* Avatar + Info */}
      <div className="-mt-5 px-4">
        <div className="relative inline-block">
          <div className="bg-bg-active border-bg-elevated flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-semibold">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={channel.name}
                className="h-full w-full object-cover"
              />
            ) : (
              channel.initial
            )}
          </div>
          <div
            className={`absolute -right-0.5 bottom-0 h-3 w-3 rounded-full border-2 ${
              channel.isYoutube ? 'bg-[#FF0000]' : 'bg-[#9146FF]'
            } border-bg-elevated`}
          />
        </div>
      </div>

      <div className="px-4 pt-1.5 pb-4">
        <h3 className="text-text-primary text-sm font-semibold">{channel.name}</h3>
        <p className="text-text-muted text-xs">{channel.handle}</p>
        {channel.subscriberCount !== null && (
          <p className="text-text-tertiary mt-0.5 text-xs">
            <span className="inline-flex items-center gap-1">
              {formatCount(channel.subscriberCount)}{' '}
              {t('dashboard.automations.board.subscribers')}
              {channel.videoCount !== null && (
                <>
                  {' · '}
                  {channel.videoCount} {t('dashboard.automations.board.videos')}
                </>
              )}
            </span>
          </p>
        )}

        {/* Status-specific content */}
        {automation.status === 'active' && (
          <ActiveCardFooter automation={automation} />
        )}
        {automation.status === 'failed' && (
          <FailedCardFooter
            failedRuns={failedRuns}
            lastError={lastError}
            onRetry={onRetry}
            onPause={onPause}
          />
        )}
        {automation.status === 'paused' && (
          <PausedCardFooter onResume={onResume} />
        )}
      </div>
    </div>
  )
}

function ActiveCardFooter({ automation }: { automation: Automation }) {
  const { t } = useTranslation()
  const { postingTimes, clipsPerDay } = automation.postingConfig

  return (
    <div className="border-border-default mt-3 flex items-center justify-between border-t pt-3">
      <div className="flex gap-1">
        {postingTimes.slice(0, 3).map((time) => (
          <span
            key={time}
            className="bg-bg-hover text-text-tertiary rounded px-1.5 py-0.5 text-xs"
          >
            {time}
          </span>
        ))}
      </div>
      <span className="text-text-muted text-xs">
        {t('dashboard.automations.card.clipsPerDay', { count: clipsPerDay })}
      </span>
    </div>
  )
}

function FailedCardFooter({
  failedRuns,
  lastError,
  onRetry,
  onPause,
}: {
  failedRuns: Automation['runs'] & object
  lastError: string | null
  onRetry: () => void
  onPause: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="mt-3">
      <div className="bg-error-muted/50 -mx-4 border-t border-red-900/20 px-4 pt-3 pb-0">
        <div className="flex items-center justify-between">
          <p className="text-error flex items-center gap-1.5 text-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            {lastError
              ? lastError.length > 35
                ? lastError.slice(0, 35) + '...'
                : lastError
              : t('dashboard.automations.runStatus.failed')}
          </p>
          <Badge className="bg-error/15 text-error border-0 text-xs">
            {t('dashboard.automations.board.failureCount', {
              count: failedRuns.length,
            })}
          </Badge>
        </div>

        {/* Recent failure log */}
        <div className="mt-2 space-y-1">
          {failedRuns.slice(0, 2).map((run) => (
            <p key={run.id} className="text-error/70 text-xs">
              <span className="mr-1">{'•'}</span>
              {new Date(run.startedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              — {t('dashboard.automations.board.timeout')}
            </p>
          ))}
        </div>

        {/* Action buttons */}
        <div className="-mx-4 mt-3 flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-success hover:bg-success/10 flex-1 rounded-none border-t border-r border-green-900/20"
            onClick={(e) => {
              e.stopPropagation()
              onRetry()
            }}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            {t('dashboard.automations.board.retryNow')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-warning hover:bg-warning/10 flex-1 rounded-none border-t border-yellow-900/20"
            onClick={(e) => {
              e.stopPropagation()
              onPause()
            }}
          >
            <Pause className="mr-1.5 h-3.5 w-3.5" />
            {t('dashboard.automations.actions.pause')}
          </Button>
        </div>
      </div>
    </div>
  )
}

function PausedCardFooter({ onResume }: { onResume: () => void }) {
  const { t } = useTranslation()

  return (
    <div className="mt-3">
      <div className="bg-warning-muted/50 -mx-4 border-t border-yellow-900/20 px-4 pt-3 pb-0">
        <p className="text-warning flex items-center gap-1.5 text-xs">
          <AlertCircle className="h-3.5 w-3.5" />
          {t('dashboard.automations.board.autoPaused')}
        </p>
        <div className="-mx-4 mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-success hover:bg-success/10 w-full rounded-none border-t border-green-900/20"
            onClick={(e) => {
              e.stopPropagation()
              onResume()
            }}
          >
            <Play className="mr-1.5 h-3.5 w-3.5" />
            {t('dashboard.automations.board.resumeRetry')}
          </Button>
        </div>
      </div>
    </div>
  )
}
