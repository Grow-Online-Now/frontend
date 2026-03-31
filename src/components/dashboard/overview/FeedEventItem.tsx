import { useTranslation } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { ActivityFeedItem, ActivityEventType } from '@/types/activity'
import type { SocialPlatform } from '@/types/connections'
export function FeedEventItem({ item }: { item: ActivityFeedItem }) {
  const initials = item.userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const hasThumbnail = item.type === 'clips_created' && item.thumbnailUrl

  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-bg-hover">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={item.userImage || undefined} alt={item.userName} />
        <AvatarFallback className="bg-bg-subtle text-text-tertiary text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-text-primary text-sm leading-snug">
            <span className="font-medium">{item.userName}</span>{' '}
            <EventDescription type={item.type} metadata={item.metadata} />
          </p>
        </div>

        <p className="text-text-muted mt-1 text-xs">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </p>

        {item.type === 'post_published' && Array.isArray(item.metadata.platforms) && (
          <div className="mt-2 flex gap-1">
            {(item.metadata.platforms as string[]).map((platform) => (
              <PlatformIcon key={platform} platform={platform as SocialPlatform} size="xs" />
            ))}
          </div>
        )}
      </div>

      {hasThumbnail && (
        <img
          src={item.thumbnailUrl!}
          alt=""
          className="h-12 w-20 shrink-0 rounded-lg object-cover"
        />
      )}
    </div>
  )
}

function EventDescription({
  type,
  metadata,
}: {
  type: ActivityEventType
  metadata: Record<string, unknown>
}) {
  const { t } = useTranslation()

  switch (type) {
    case 'post_published': {
      const count = (metadata.platforms as string[] | undefined)?.length ?? 0
      return (
        <span className="text-text-secondary">
          {t('dashboard.overview.feed.postPublished', { count })}
        </span>
      )
    }
    case 'clips_created': {
      const clipCount = (metadata.clipCount as number) ?? 0
      const videoTitle = (metadata.videoTitle as string) ?? ''
      return (
        <span className="text-text-secondary">
          {t('dashboard.overview.feed.clipsCreated', { count: clipCount, title: videoTitle })}
        </span>
      )
    }
    case 'social_connected': {
      const platform = (metadata.platform as string) ?? ''
      return (
        <span className="text-text-secondary">
          {t('dashboard.overview.feed.socialConnected', { platform })}
        </span>
      )
    }
    case 'automation_created':
      return (
        <span className="text-text-secondary">
          {t('dashboard.overview.feed.automationCreated')}
        </span>
      )
    default:
      return null
  }
}
