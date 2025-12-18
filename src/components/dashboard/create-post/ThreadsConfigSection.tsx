/**
 * ThreadsConfigSection
 * Threads-specific configuration options for post creation
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
import type { ThreadsConfig, ThreadsReplyControl } from '@/types/posts'

interface ThreadsConfigSectionProps {
  config: ThreadsConfig
  onChange: (config: ThreadsConfig) => void
  className?: string
}

const REPLY_CONTROL_OPTIONS: {
  value: ThreadsReplyControl
  labelKey: string
  descriptionKey: string
}[] = [
  {
    value: 'everyone',
    labelKey: 'dashboard.createPost.platformConfig.threads.replyControl.everyone',
    descriptionKey: 'dashboard.createPost.platformConfig.threads.replyControl.everyoneDesc',
  },
  {
    value: 'accounts_you_follow',
    labelKey: 'dashboard.createPost.platformConfig.threads.replyControl.accountsYouFollow',
    descriptionKey:
      'dashboard.createPost.platformConfig.threads.replyControl.accountsYouFollowDesc',
  },
  {
    value: 'mentioned_only',
    labelKey: 'dashboard.createPost.platformConfig.threads.replyControl.mentionedOnly',
    descriptionKey: 'dashboard.createPost.platformConfig.threads.replyControl.mentionedOnlyDesc',
  },
]

export function ThreadsConfigSection({ config, onChange, className }: ThreadsConfigSectionProps) {
  const { t } = useTranslation()

  const currentReplyControl = config.replyControl || 'everyone'
  const currentOption = REPLY_CONTROL_OPTIONS.find((o) => o.value === currentReplyControl)

  const handleReplyControlChange = (replyControl: ThreadsReplyControl) => {
    onChange({ ...config, replyControl })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform="threads" size="xs" />
        <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t('dashboard.createPost.platformConfig.threads.title')}
        </h4>
      </div>

      {/* Reply Control */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.threads.replyControlLabel')}
        </label>
        <Select
          value={currentReplyControl}
          onValueChange={(v) => handleReplyControlChange(v as ThreadsReplyControl)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REPLY_CONTROL_OPTIONS.map((option) => (
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
