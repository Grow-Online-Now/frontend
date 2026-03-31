import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useConnections } from '@/hooks/useConnections'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/types/connections'

const ease = [0.16, 1, 0.3, 1] as const

export function ConnectedAccountsStrip() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { connections, isLoading } = useConnections()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.34, ease }}
    >
      <p className="text-text-tertiary mb-2 text-xs font-medium uppercase tracking-wider">
        {t('dashboard.overview.accounts.title')}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-subtle h-8 w-8 animate-pulse rounded-lg" />
          ))
        ) : (
          <>
            {connections.map((conn) => (
              <div key={conn.id} className="relative">
                <PlatformIcon
                  platform={conn.platform as SocialPlatform}
                  size="sm"
                  showBackground
                />
                <span
                  className={cn(
                    'absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-base)]',
                    conn.isExpired || conn.needsRefresh ? 'bg-error' : 'bg-success'
                  )}
                />
              </div>
            ))}
            <button
              onClick={() => navigate(`/${lang}/dashboard/accounts`)}
              className="border-border-subtle hover:border-border-emphasis hover:bg-bg-hover flex h-8 w-8 items-center justify-center rounded-lg border border-dashed transition-all duration-150"
            >
              <Plus className="text-text-muted h-4 w-4" />
            </button>
            {connections.length === 0 && (
              <button
                onClick={() => navigate(`/${lang}/dashboard/accounts`)}
                className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-150"
              >
                {t('dashboard.overview.accounts.connectFirst')}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
