/**
 * LinkedInConfigSection
 * LinkedIn-specific configuration options for post creation
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LinkedInConfig, LinkedInVisibility } from '@/types/posts'

interface LinkedInConfigSectionProps {
  config: LinkedInConfig
  onChange: (config: LinkedInConfig) => void
  className?: string
}

const VISIBILITY_OPTIONS: {
  value: LinkedInVisibility
  labelKey: string
  descriptionKey: string
}[] = [
  {
    value: 'PUBLIC',
    labelKey: 'dashboard.createPost.platformConfig.linkedin.visibilityLevels.PUBLIC',
    descriptionKey: 'dashboard.createPost.platformConfig.linkedin.visibilityLevels.PUBLICDesc',
  },
  {
    value: 'CONNECTIONS',
    labelKey: 'dashboard.createPost.platformConfig.linkedin.visibilityLevels.CONNECTIONS',
    descriptionKey: 'dashboard.createPost.platformConfig.linkedin.visibilityLevels.CONNECTIONSDesc',
  },
]

export function LinkedInConfigSection({ config, onChange, className }: LinkedInConfigSectionProps) {
  const { t } = useTranslation()

  const currentVisibility = config.visibility || 'PUBLIC'
  const currentOption = VISIBILITY_OPTIONS.find((o) => o.value === currentVisibility)

  const handleVisibilityChange = (visibility: LinkedInVisibility) => {
    onChange({ ...config, visibility })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform="linkedin" size="xs" />
        <h4 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          {t('dashboard.createPost.platformConfig.linkedin.title')}
        </h4>
      </div>

      {/* Visibility */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.linkedin.visibility')}
        </label>
        <Select
          value={currentVisibility}
          onValueChange={(v) => handleVisibilityChange(v as LinkedInVisibility)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VISIBILITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentOption && (
          <p className="text-muted-foreground text-xs">{t(currentOption.descriptionKey)}</p>
        )}
      </div>
    </div>
  )
}
