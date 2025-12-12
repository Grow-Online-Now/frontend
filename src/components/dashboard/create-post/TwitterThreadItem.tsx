/**
 * TwitterThreadItem
 * Individual thread tweet with text input, media upload, drag handle, and remove button
 */

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import { GripVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TwitterCharacterCounter } from './TwitterCharacterCounter'
import { TwitterThreadMediaUploader } from './TwitterThreadMediaUploader'
import type { TwitterThreadTweet } from '@/types/posts'
import type { FileUploadState } from '@/hooks/useThreadMediaUpload'

interface TwitterThreadItemProps {
  tweet: TwitterThreadTweet
  index: number
  totalTweets: number
  onTextChange: (text: string) => void
  onRemove: () => void
  uploads: FileUploadState[]
  onAddMedia: (files: FileList) => void
  onRemoveMedia: (uploadId: string) => void
  onRetryMedia: (uploadId: string) => void
  canAddMoreMedia: boolean
  isOnly?: boolean
}

export function TwitterThreadItem({
  tweet,
  index,
  totalTweets,
  onTextChange,
  onRemove,
  uploads,
  onAddMedia,
  onRemoveMedia,
  onRetryMedia,
  canAddMoreMedia,
  isOnly = false,
}: TwitterThreadItemProps) {
  const { t } = useTranslation()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tweet.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const characterCount = tweet.text.length
  const isOverLimit = characterCount > 280

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-border-subtle bg-card group relative rounded-xl border transition-all',
        isDragging && 'ring-primary/20 z-50 shadow-lg ring-2',
        isOverLimit && 'border-destructive/40'
      )}
    >
      {/* Header with drag handle and tweet number */}
      <div className="border-border-subtle flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            type="button"
            className={cn(
              'text-muted-foreground/50 hover:text-muted-foreground cursor-grab touch-none transition-colors',
              isDragging && 'cursor-grabbing'
            )}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Tweet number */}
          <span className="text-muted-foreground text-xs font-medium">
            {t('dashboard.createPost.twitter.thread.tweetNumber', {
              current: index + 1,
              total: totalTweets,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Character counter */}
          <TwitterCharacterCounter current={characterCount} />

          {/* Remove button */}
          {!isOnly && (
            <button
              type="button"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title={t('dashboard.createPost.twitter.thread.removeTweet')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="p-3">
        <textarea
          value={tweet.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={t('dashboard.createPost.twitter.thread.placeholder')}
          rows={3}
          className={cn(
            'w-full resize-none bg-transparent text-sm leading-relaxed outline-none',
            'placeholder:text-muted-foreground/40',
            isOverLimit && 'text-destructive'
          )}
        />
      </div>

      {/* Media uploader */}
      <div className="border-border-subtle border-t px-3 py-2">
        <TwitterThreadMediaUploader
          uploads={uploads}
          onAddFiles={onAddMedia}
          onRemove={onRemoveMedia}
          onRetry={onRetryMedia}
          canAddMore={canAddMoreMedia}
        />
      </div>

      {/* Validation error */}
      {isOverLimit && (
        <div className="bg-destructive/5 border-border-subtle border-t px-3 py-2">
          <p className="text-destructive text-xs">
            {t('dashboard.createPost.twitter.thread.validation.tooLong')}
          </p>
        </div>
      )}
    </div>
  )
}
