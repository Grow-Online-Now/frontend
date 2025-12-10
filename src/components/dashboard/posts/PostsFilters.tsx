/**
 * PostsFilters Component
 * Filter controls for the posts list
 */

import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PostStatus, PostsQueryParams } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface PostsFiltersProps {
  filters: PostsQueryParams
  onFilterChange: (filters: Partial<PostsQueryParams>) => void
  className?: string
}

const STATUS_OPTIONS: (PostStatus | 'all')[] = [
  'all',
  'pending',
  'processing',
  'completed',
  'failed',
]
const PLATFORM_OPTIONS: (SocialPlatform | 'all')[] = [
  'all',
  'youtube',
  'instagram',
  'tiktok',
  'twitter',
  'linkedin',
  'pinterest',
]

export function PostsFilters({ filters, onFilterChange, className }: PostsFiltersProps) {
  const { t } = useTranslation()

  const hasActiveFilters =
    filters.status !== undefined ||
    filters.platform !== undefined ||
    filters.is_draft !== undefined ||
    filters.scheduled !== undefined

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({ status: undefined, is_draft: undefined })
    } else if (value === 'draft') {
      onFilterChange({ status: undefined, is_draft: true })
    } else {
      onFilterChange({ status: value as PostStatus, is_draft: false })
    }
  }

  const handlePlatformChange = (value: string) => {
    onFilterChange({
      platform: value === 'all' ? undefined : (value as SocialPlatform),
    })
  }

  const handleTypeChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({ scheduled: undefined, is_draft: undefined })
    } else if (value === 'scheduled') {
      onFilterChange({ scheduled: true, is_draft: false })
    } else if (value === 'drafts') {
      onFilterChange({ is_draft: true, scheduled: undefined })
    }
  }

  const clearFilters = () => {
    onFilterChange({
      status: undefined,
      platform: undefined,
      is_draft: undefined,
      scheduled: undefined,
    })
  }

  // Determine current filter values for display
  const currentStatus = filters.is_draft ? 'draft' : filters.status || 'all'
  const currentPlatform = filters.platform || 'all'
  const currentType = filters.is_draft ? 'drafts' : filters.scheduled ? 'scheduled' : 'all'

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('dashboard.posts.filters.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('dashboard.posts.filters.all')}</SelectItem>
            {STATUS_OPTIONS.filter((s) => s !== 'all').map((status) => (
              <SelectItem key={status} value={status}>
                {t(`dashboard.posts.status.${status}`)}
              </SelectItem>
            ))}
            <SelectItem value="draft">{t('dashboard.posts.status.draft')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter (Scheduled/Drafts) */}
        <Select value={currentType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('dashboard.posts.filters.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('dashboard.posts.filters.all')}</SelectItem>
            <SelectItem value="scheduled">{t('dashboard.posts.filters.scheduled')}</SelectItem>
            <SelectItem value="drafts">{t('dashboard.posts.filters.drafts')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Platform Filter */}
        <Select value={currentPlatform} onValueChange={handlePlatformChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('dashboard.posts.filters.platform')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('dashboard.posts.filters.all')}</SelectItem>
            {PLATFORM_OPTIONS.filter((p) => p !== 'all').map((platform) => (
              <SelectItem key={platform} value={platform}>
                {t(`dashboard.accounts.platforms.${platform}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1.5 size-4" />
            {t('dashboard.posts.filters.clearFilters')}
          </Button>
        )}
      </div>
    </div>
  )
}
