import { useTranslation } from 'react-i18next'
import { Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FeedEventItem } from './FeedEventItem'
import type { ActivityFeedItem } from '@/types/activity'

interface ActivityFeedProps {
  items: ActivityFeedItem[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

const ease = [0.16, 1, 0.3, 1]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease },
  },
}

export function ActivityFeed({ items, isLoading, hasMore, onLoadMore }: ActivityFeedProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease }}
      className="flex flex-col"
    >
      {/* Header with live indicator */}
      <div className="mb-2 flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span className="bg-success relative inline-flex h-2 w-2 rounded-full" />
        </div>
        <p className="text-text-secondary text-sm font-medium">
          {t('dashboard.overview.feed.title')}
        </p>
      </div>

      <div className="border-border-subtle bg-bg-elevated flex min-h-[480px] flex-col rounded-xl border">
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <FeedSkeleton />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16">
              <Activity className="text-text-muted mb-3 h-6 w-6" />
              <p className="text-text-secondary text-sm">
                {t('dashboard.overview.feed.empty')}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="p-2"
            >
              {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <FeedEventItem item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {hasMore && items.length > 0 && (
          <div className="border-border-subtle border-t px-4 py-3">
            <Button variant="ghost" size="sm" className="w-full" onClick={onLoadMore}>
              {t('dashboard.overview.feed.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function FeedSkeleton() {
  return (
    <div className="p-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-start gap-3 px-3 py-3">
          <div className="bg-bg-subtle h-8 w-8 animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="bg-bg-subtle h-3.5 w-3/4 animate-pulse rounded" />
            <div className="bg-bg-subtle h-3 w-1/3 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
