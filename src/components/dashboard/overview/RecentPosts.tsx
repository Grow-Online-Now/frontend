import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { PostResponse } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface RecentPostsProps {
  posts: PostResponse[]
  isLoading: boolean
}

const ease = [0.16, 1, 0.3, 1] as const

const statusStyles: Record<string, string> = {
  completed: 'text-success',
  pending: 'text-text-tertiary',
  failed: 'text-error',
}

export function RecentPosts({ posts, isLoading }: RecentPostsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.38, ease }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-text-secondary text-sm font-medium">
          {t('dashboard.overview.recentPosts.title')}
        </p>
        <button
          onClick={() => navigate(`/${lang}/dashboard/posts`)}
          className="text-text-tertiary hover:text-text-secondary group flex items-center gap-1 text-xs transition-colors duration-150"
        >
          {t('dashboard.overview.recentPosts.viewAll')}
          <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-border-subtle bg-bg-elevated rounded-xl border p-4">
              <div className="space-y-3">
                <div className="bg-bg-subtle h-4 w-full animate-pulse rounded" />
                <div className="bg-bg-subtle h-4 w-2/3 animate-pulse rounded" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="bg-bg-subtle h-4 w-4 animate-pulse rounded" />
                    <div className="bg-bg-subtle h-4 w-4 animate-pulse rounded" />
                  </div>
                  <div className="bg-bg-subtle h-3 w-16 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <button
          onClick={() => navigate(`/${lang}/dashboard/posts/create`)}
          className="border-border-subtle hover:border-border-emphasis hover:bg-bg-hover flex w-full items-center gap-3 rounded-xl border border-dashed p-6 transition-all duration-150"
        >
          <FileText className="text-text-muted h-5 w-5" />
          <span className="text-text-secondary text-sm">
            {t('dashboard.overview.recentPosts.empty')}
          </span>
        </button>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function PostCard({ post }: { post: PostResponse }) {
  const { t } = useTranslation()
  const statusKey = `dashboard.overview.recentPosts.status.${post.is_draft ? 'draft' : post.status}`

  return (
    <div className="border-border-subtle bg-bg-elevated group rounded-xl border p-4 transition-colors duration-150 hover:border-border-emphasis">
      <p className="text-text-primary mb-3 line-clamp-2 text-sm leading-snug">
        {post.caption || t('dashboard.overview.recentPosts.empty')}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {post.social_accounts.slice(0, 4).map((account) => (
            <PlatformIcon
              key={account.id}
              platform={account.platform as SocialPlatform}
              size="xs"
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-medium', statusStyles[post.status] || 'text-text-muted')}>
            {t(statusKey)}
          </span>
          <span className="text-text-muted text-xs">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  )
}
