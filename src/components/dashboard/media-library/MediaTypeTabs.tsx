/**
 * MediaTypeTabs Component
 * Filter tabs for media type (all, images, videos)
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { MediaTypeTab } from '@/types/media'

interface MediaTypeTabsProps {
  activeTab: MediaTypeTab
  onTabChange: (tab: MediaTypeTab) => void
  className?: string
}

const TABS: { value: MediaTypeTab; labelKey: string }[] = [
  { value: 'all', labelKey: 'dashboard.media.filters.all' },
  { value: 'image', labelKey: 'dashboard.media.filters.images' },
  { value: 'video', labelKey: 'dashboard.media.filters.videos' },
]

export function MediaTypeTabs({ activeTab, onTabChange, className }: MediaTypeTabsProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'bg-muted/50 scrollbar-hide inline-flex gap-1 overflow-x-auto rounded-xl p-1',
        className
      )}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            {t(tab.labelKey)}
          </button>
        )
      })}
    </div>
  )
}
