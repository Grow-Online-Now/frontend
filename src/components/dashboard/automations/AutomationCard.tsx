import { useTranslation } from 'react-i18next'
import {
  Play,
  Pause,
  Trash2,
  Zap,
  MoreVertical,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { Automation } from '@/types/automation'
import type { SocialPlatform } from '@/types/connections'

interface AutomationCardProps {
  automation: Automation
  onActivate: () => void
  onPause: () => void
  onDelete: () => void
  onTrigger: () => void
  onClick: () => void
}

const statusColors: Record<string, string> = {
  active: 'bg-success-muted text-success',
  paused: 'bg-warning-muted text-warning',
  draft: 'bg-bg-hover text-text-tertiary',
}

export function AutomationCard({
  automation,
  onActivate,
  onPause,
  onDelete,
  onTrigger,
  onClick,
}: AutomationCardProps) {
  const { t } = useTranslation()

  const sourceConfig = automation.sourceConfig
  const postingConfig = automation.postingConfig
  const lastRun = automation.runs?.[0]

  // Extract platform names from social account IDs (simplified - would need connection data)
  const isYoutube = automation.templateType === 'youtube_to_clips'

  const getLastRunText = () => {
    if (!lastRun) return t('dashboard.automations.card.noRuns')
    if (lastRun.status === 'no_new_content')
      return t('dashboard.automations.card.noNewContent')
    if (lastRun.status === 'completed' && lastRun.postsScheduled > 0) {
      const timeAgo = getTimeAgo(lastRun.completedAt || lastRun.startedAt)
      return `${timeAgo} — ${t('dashboard.automations.card.clipsPosted', { count: lastRun.postsScheduled })}`
    }
    if (lastRun.status === 'failed') return lastRun.error || 'Failed'
    if (lastRun.status === 'running') return t('dashboard.automations.runStatus.running')
    return t('dashboard.automations.card.noRuns')
  }

  return (
    <div
      onClick={onClick}
      className="bg-bg-elevated border-border-default hover:border-border-emphasis group cursor-pointer rounded-xl border p-5 transition-all duration-150"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-bg-hover flex h-10 w-10 items-center justify-center rounded-lg">
            <Zap className="text-text-secondary h-5 w-5" />
          </div>
          <div>
            <h3 className="text-text-primary text-sm font-medium">
              {automation.name}
            </h3>
            <p className="text-text-tertiary mt-0.5 text-xs">
              {isYoutube ? 'YouTube' : 'Twitch'} — {sourceConfig.channelUrl}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={`${statusColors[automation.status]} border-0 text-xs font-medium`}
          >
            {t(`dashboard.automations.status.${automation.status}`)}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onTrigger}>
                <Play className="mr-2 h-4 w-4" />
                {t('dashboard.automations.actions.run')}
              </DropdownMenuItem>
              {automation.status === 'active' ? (
                <DropdownMenuItem onClick={onPause}>
                  <Pause className="mr-2 h-4 w-4" />
                  {t('dashboard.automations.actions.pause')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={onActivate}>
                  <Play className="mr-2 h-4 w-4" />
                  {t('dashboard.automations.actions.activate')}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('dashboard.automations.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-text-tertiary text-xs">
          {t('dashboard.automations.card.clipsPerDay', {
            count: postingConfig.clipsPerDay,
          })}
        </span>
        <div className="flex gap-1">
          {/* Show posting times */}
          {postingConfig.postingTimes.slice(0, 3).map((time) => (
            <span
              key={time}
              className="bg-bg-hover text-text-tertiary rounded px-1.5 py-0.5 text-xs"
            >
              {time}
            </span>
          ))}
        </div>
      </div>

      <div className="border-border-default mt-3 border-t pt-3">
        <p className="text-text-muted text-xs">{getLastRunText()}</p>
      </div>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
