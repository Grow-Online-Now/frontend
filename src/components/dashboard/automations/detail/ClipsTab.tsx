import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Film, Clock, Video, Loader2, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { getAutomationPosts } from '@/services/automations.service'
import type { Automation, AutomationPost } from '@/types/automation'
import type { SocialPlatform } from '@/types/connections'

interface ClipsTabProps {
  automation: Automation
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'completed':
      return 'border-0 bg-success-muted text-success'
    case 'pending':
      return 'border-0 bg-warning-muted text-warning'
    case 'processing':
      return 'border-0 bg-info-muted text-info'
    case 'failed':
      return 'border-0 bg-error-muted text-error'
    default:
      return 'border-0 bg-bg-hover text-text-muted'
  }
}

function getStatusKey(status: string) {
  switch (status) {
    case 'completed':
      return 'dashboard.automations.detail.clips.published'
    case 'pending':
      return 'dashboard.automations.detail.clips.scheduled'
    case 'processing':
      return 'dashboard.automations.detail.clips.processing'
    case 'failed':
      return 'dashboard.automations.detail.clips.failed'
    default:
      return 'dashboard.automations.detail.clips.pending'
  }
}

export function ClipsTab({ automation }: ClipsTabProps) {
  const { t, i18n } = useTranslation()
  const [posts, setPosts] = useState<AutomationPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const runs = automation.runs || []
  const completedRuns = runs.filter(
    (r) => r.status === 'completed' && r.clipsGenerated > 0
  )

  useEffect(() => {
    let cancelled = false

    async function fetchPosts() {
      setIsLoading(true)
      try {
        const response = await getAutomationPosts(automation.id)
        if (!cancelled) setPosts(response.posts)
      } catch {
        // Silently fall back to run-only view
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchPosts()
    return () => {
      cancelled = true
    }
  }, [automation.id])

  if (isLoading) {
    return (
      <div className="bg-bg-elevated border-border-default rounded-xl border p-8 text-center">
        <Loader2 className="text-text-muted mx-auto h-6 w-6 animate-spin" />
      </div>
    )
  }

  // No data at all
  if (posts.length === 0 && completedRuns.length === 0) {
    return (
      <div className="bg-bg-elevated border-border-default rounded-xl border p-8 text-center">
        <Film className="text-text-muted mx-auto h-6 w-6" />
        <p className="text-text-primary mt-3 text-sm font-medium">
          {t('dashboard.automations.detail.clips.empty')}
        </p>
        <p className="text-text-muted mt-1 text-sm">
          {t('dashboard.automations.detail.clips.emptyDesc')}
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  // If we have linked posts, show the rich view
  if (posts.length > 0) {
    const runMap = new Map(runs.map((r) => [r.id, r]))
    const grouped = new Map<string, AutomationPost[]>()
    for (const post of posts) {
      const key = post.automationRunId || '__unlinked__'
      const existing = grouped.get(key) || []
      existing.push(post)
      grouped.set(key, existing)
    }

    return (
      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([runId, runPosts]) => {
          const run =
            runId !== '__unlinked__' ? runMap.get(runId) : null
          const sectionTitle =
            run?.videoTitle || run?.videoUrl || t('dashboard.automations.detail.clips.noRun')

          return (
            <div key={runId} className="space-y-3">
              <div className="flex items-center gap-2">
                <Video className="text-text-muted h-4 w-4 shrink-0" />
                <p className="text-text-secondary truncate text-sm font-medium">
                  {sectionTitle}
                </p>
                <Badge className="bg-success-muted text-success ml-auto shrink-0 border-0 text-xs font-medium">
                  {runPosts.length}{' '}
                  {t('dashboard.automations.detail.clipsGenerated').toLowerCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                {runPosts.map((post, index) => {
                  const thumbnail = post.media.find(
                    (m) => m.mediaType === 'video' || m.mediaType === 'image'
                  )
                  return (
                    <div
                      key={post.id}
                      className="bg-bg-elevated border-border-default flex items-start gap-4 rounded-xl border p-4"
                    >
                      <div className="bg-bg-hover flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                        {thumbnail?.url ? (
                          thumbnail.mediaType === 'video' ? (
                            <video
                              src={thumbnail.url}
                              className="h-full w-full object-cover"
                              muted
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={thumbnail.url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )
                        ) : (
                          <Film className="text-text-muted h-6 w-6" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-text-primary text-sm font-medium">
                          {t('dashboard.automations.detail.clips.clipTitle', {
                            index: index + 1,
                          })}
                        </p>
                        <p className="text-text-secondary mt-0.5 line-clamp-2 text-xs">
                          {post.caption}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {post.social_accounts.length > 0 && (
                            <div className="flex items-center gap-1">
                              {post.social_accounts.map((account) => (
                                <PlatformIcon
                                  key={account.id}
                                  platform={
                                    account.platform as SocialPlatform
                                  }
                                  size="xs"
                                />
                              ))}
                            </div>
                          )}
                          {post.scheduled_at && (
                            <span className="text-text-tertiary flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {formatDate(post.scheduled_at)}
                            </span>
                          )}
                          <Badge
                            className={`text-xs font-medium ${getStatusStyle(post.status)}`}
                          >
                            {t(getStatusKey(post.status))}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Fallback: no linked posts but we have completed runs — show run summaries
  return (
    <div className="space-y-3">
      {completedRuns.map((run) => (
        <div
          key={run.id}
          className="bg-bg-elevated border-border-default rounded-xl border p-4"
        >
          <div className="flex items-center gap-3">
            <Video className="text-text-muted h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-text-primary truncate text-sm font-medium">
                {run.videoTitle || run.videoUrl || '—'}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-text-tertiary text-xs">
                  {t('dashboard.automations.detail.clips.generated')}:{' '}
                  {run.clipsGenerated}
                </span>
                {run.postsScheduled > 0 && (
                  <span className="text-text-tertiary flex items-center gap-1 text-xs">
                    <CheckCircle2 className="text-success h-3.5 w-3.5" />
                    {t('dashboard.automations.detail.clips.posted')}:{' '}
                    {run.postsScheduled}
                  </span>
                )}
                <span className="text-text-muted text-xs">
                  {formatDate(run.startedAt)}
                </span>
              </div>
            </div>
            <Badge className="bg-success-muted text-success shrink-0 border-0 text-xs font-medium">
              {run.clipsGenerated}{' '}
              {t('dashboard.automations.detail.clipsGenerated').toLowerCase()}
            </Badge>
          </div>

          {/* Clip placeholders within the run */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Array.from({ length: run.clipsGenerated }, (_, i) => (
              <div
                key={i}
                className="bg-bg-hover flex aspect-video items-center justify-center rounded-lg"
              >
                <Film className="text-text-muted/40 h-5 w-5" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
