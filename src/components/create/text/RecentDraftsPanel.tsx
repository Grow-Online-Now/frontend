/**
 * RecentDraftsPanel Component
 * Shows recent draft posts for quick loading into composer
 */

import { useTranslation } from 'react-i18next'
import { FileText, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { PostResponse } from '@/types/posts'

interface RecentDraftsPanelProps {
  drafts: PostResponse[]
  isLoading?: boolean
  onSelectDraft: (draft: PostResponse) => void
  maxItems?: number
  className?: string
}

interface DraftCardProps {
  draft: PostResponse
  onClick: () => void
}

function DraftCard({ draft, onClick }: DraftCardProps) {
  // Get preview text (first line or truncated)
  const previewText = draft.caption.split('\n')[0].slice(0, 60) || 'Empty draft'
  const isLong = draft.caption.length > 60

  // Format relative time
  const timeAgo = formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true })

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-border bg-surface-subtle w-full rounded-lg border p-3 text-left',
        'hover:border-border-emphasis hover:bg-surface-hover transition-all',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none'
      )}
    >
      <p className="text-foreground line-clamp-2 text-sm">
        {previewText}
        {isLong && '...'}
      </p>
      <div className="text-muted-foreground mt-1.5 flex items-center gap-1 text-xs">
        <Clock className="h-3 w-3" />
        <span>{timeAgo}</span>
      </div>
    </button>
  )
}

function DraftCardSkeleton() {
  return (
    <div className="border-border bg-surface-subtle rounded-lg border p-3">
      <Skeleton className="mb-1.5 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-1.5 h-3 w-20" />
    </div>
  )
}

export function RecentDraftsPanel({
  drafts,
  isLoading = false,
  onSelectDraft,
  maxItems = 3,
  className,
}: RecentDraftsPanelProps) {
  const { t } = useTranslation()

  const visibleDrafts = drafts.slice(0, maxItems)

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium">
          {t('dashboard.create.text.draftsPanel.title')}
        </h3>
      </div>

      {/* Drafts List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <DraftCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleDrafts.length === 0 ? (
        <div className="border-border bg-surface-subtle flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6">
          <FileText className="text-muted-foreground mb-2 h-5 w-5" />
          <p className="text-muted-foreground text-center text-xs">
            {t('dashboard.create.text.draftsPanel.empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleDrafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} onClick={() => onSelectDraft(draft)} />
          ))}
        </div>
      )}
    </div>
  )
}
