import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformFeatureAnchors() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, features } = config

  const handleClick = (id: string) => {
    const element = document.getElementById(`feature-${id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-lg',
        config.slug === 'tiktok' || config.slug === 'x'
          ? 'border-zinc-800 bg-zinc-950/90'
          : 'border-border bg-background/90'
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-center gap-1 overflow-x-auto py-3 sm:gap-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <button
                key={feature.id}
                onClick={() => handleClick(feature.id)}
                className={cn(
                  'group flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  config.slug === 'tiktok' || config.slug === 'x'
                    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  config.slug === 'tiktok'
                    ? 'focus-visible:ring-[#FF0050]'
                    : config.slug === 'x'
                      ? 'focus-visible:ring-white'
                      : 'focus-visible:ring-primary'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    config.slug === 'tiktok'
                      ? 'group-hover:text-[#FF0050]'
                      : config.slug === 'x'
                        ? 'group-hover:text-white'
                        : `group-hover:${theme.accent}`
                  )}
                />
                <span className="hidden sm:inline">{t(feature.specificNameKey)}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </motion.div>
  )
}
