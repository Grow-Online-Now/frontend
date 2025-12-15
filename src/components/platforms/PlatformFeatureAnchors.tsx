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
      className="border-border bg-background/90 sticky top-0 z-40 border-b backdrop-blur-lg"
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
                  'text-muted-foreground hover:bg-muted hover:text-foreground group flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                )}
              >
                <Icon className={cn('h-4 w-4 transition-colors', `group-hover:${theme.accent}`)} />
                <span className="hidden sm:inline">{t(feature.specificNameKey)}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </motion.div>
  )
}
