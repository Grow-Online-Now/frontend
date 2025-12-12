/**
 * TwitterFirstComment
 * Toggle + input for auto-reply first comment on Twitter posts
 */

import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { TwitterCharacterCounter } from './TwitterCharacterCounter'
import { TwitterThreadMediaUploader } from './TwitterThreadMediaUploader'
import type { TwitterFirstComment as TwitterFirstCommentType } from '@/types/posts'
import type { FileUploadState } from '@/hooks/useThreadMediaUpload'

interface TwitterFirstCommentProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  comment: TwitterFirstCommentType | null
  onCommentChange: (comment: TwitterFirstCommentType | null) => void
  uploads: FileUploadState[]
  onAddMedia: (files: FileList) => void
  onRemoveMedia: (uploadId: string) => void
  onRetryMedia: (uploadId: string) => void
  canAddMoreMedia: boolean
  className?: string
}

export function TwitterFirstComment({
  enabled,
  onEnabledChange,
  comment,
  onCommentChange,
  uploads,
  onAddMedia,
  onRemoveMedia,
  onRetryMedia,
  canAddMoreMedia,
  className,
}: TwitterFirstCommentProps) {
  const { t } = useTranslation()

  const handleToggle = (checked: boolean) => {
    onEnabledChange(checked)
    if (checked && !comment) {
      onCommentChange({ text: '', mediaIds: [] })
    } else if (!checked) {
      onCommentChange(null)
    }
  }

  const handleTextChange = (text: string) => {
    onCommentChange({ ...comment, text, mediaIds: comment?.mediaIds || [] })
  }

  const characterCount = comment?.text.length || 0
  const isOverLimit = characterCount > 280

  return (
    <div className={cn('bg-card border-border-subtle rounded-xl border', className)}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <MessageCircle
            className={cn('h-4 w-4', enabled ? 'text-primary' : 'text-muted-foreground')}
          />
          <div>
            <label
              htmlFor="first-comment-toggle"
              className="text-foreground cursor-pointer text-sm font-medium"
            >
              {t('dashboard.createPost.twitter.firstComment.enable')}
            </label>
            <p className="text-muted-foreground text-xs">
              {t('dashboard.createPost.twitter.firstComment.description')}
            </p>
          </div>
        </div>
        <Switch id="first-comment-toggle" checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {/* Content when enabled */}
      {enabled && (
        <div className="border-border-subtle border-t">
          {/* Textarea header with character count */}
          <div className="border-border-subtle flex items-center justify-between border-b px-4 py-2">
            <span className="text-muted-foreground text-xs">
              {t('dashboard.createPost.twitter.firstComment.title')}
            </span>
            <TwitterCharacterCounter current={characterCount} />
          </div>

          {/* Textarea */}
          <div className="p-4">
            <textarea
              value={comment?.text || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={t('dashboard.createPost.twitter.firstComment.placeholder')}
              rows={3}
              className={cn(
                'w-full resize-none bg-transparent text-sm leading-relaxed outline-none',
                'placeholder:text-muted-foreground/40',
                isOverLimit && 'text-destructive'
              )}
            />
          </div>

          {/* Media uploader */}
          <div className="border-border-subtle border-t px-4 py-3">
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
            <div className="bg-destructive/5 border-border-subtle border-t px-4 py-2">
              <p className="text-destructive text-xs">
                {t('dashboard.createPost.twitter.firstComment.validation.tooLong')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
