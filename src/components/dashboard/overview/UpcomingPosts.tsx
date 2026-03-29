import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { UpcomingPost } from '@/types/activity'
import type { SocialPlatform } from '@/types/connections'

interface UpcomingPostsProps {
  posts: UpcomingPost[]
  isLoading: boolean
}

const ease = [0.16, 1, 0.3, 1]

export function UpcomingPosts({ posts, isLoading }: UpcomingPostsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28, ease }}
    >
      <p className="text-text-tertiary mb-2 text-xs font-medium uppercase tracking-wider">
        {t('dashboard.overview.upcoming.title')}
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2.5">
              <div className="bg-bg-subtle h-5 w-5 animate-pulse rounded" />
              <div className="flex-1 space-y-1.5">
                <div className="bg-bg-subtle h-3.5 w-3/4 animate-pulse rounded" />
                <div className="bg-bg-subtle h-3 w-1/2 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <button
          onClick={() => navigate(`/${lang}/dashboard/scheduler`)}
          className="group flex w-full items-center gap-3 rounded-lg p-2.5 transition-colors duration-150 hover:bg-bg-hover"
        >
          <Calendar className="text-text-muted h-4 w-4 shrink-0" />
          <span className="text-text-secondary text-sm">
            {t('dashboard.overview.upcoming.nothingScheduled')}
          </span>
          <ArrowRight className="text-text-muted ml-auto h-3.5 w-3.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        </button>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 rounded-lg p-2.5 transition-colors duration-150 hover:bg-bg-hover"
            >
              <div className="flex -space-x-1">
                {post.platforms.slice(0, 3).map((platform) => (
                  <PlatformIcon
                    key={platform}
                    platform={platform as SocialPlatform}
                    size="xs"
                  />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text-primary truncate text-sm">{post.caption}</p>
                <p className="text-text-muted text-xs">
                  {formatDistanceToNow(new Date(post.scheduledFor), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
