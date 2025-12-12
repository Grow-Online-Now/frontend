/**
 * TwitterThreadBuilder
 * Main container for building Twitter threads with drag-and-drop reordering
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Plus, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TwitterThreadItem } from './TwitterThreadItem'
import type { TwitterThreadTweet } from '@/types/posts'
import type { UseThreadMediaUploadReturn } from '@/hooks/useThreadMediaUpload'

interface TwitterThreadBuilderProps {
  thread: TwitterThreadTweet[]
  onThreadChange: (thread: TwitterThreadTweet[]) => void
  mediaUpload: UseThreadMediaUploadReturn
  className?: string
}

export function TwitterThreadBuilder({
  thread,
  onThreadChange,
  mediaUpload,
  className,
}: TwitterThreadBuilderProps) {
  const { t } = useTranslation()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = thread.findIndex((t) => t.id === active.id)
        const newIndex = thread.findIndex((t) => t.id === over.id)
        onThreadChange(arrayMove(thread, oldIndex, newIndex))
      }
    },
    [thread, onThreadChange]
  )

  const handleAddTweet = useCallback(() => {
    const newTweet: TwitterThreadTweet = {
      id: crypto.randomUUID(),
      text: '',
      mediaIds: [],
    }
    onThreadChange([...thread, newTweet])
  }, [thread, onThreadChange])

  const handleRemoveTweet = useCallback(
    (tweetId: string) => {
      // Cleanup media uploads for this tweet
      mediaUpload.cleanupContext(tweetId)
      onThreadChange(thread.filter((t) => t.id !== tweetId))
    },
    [thread, onThreadChange, mediaUpload]
  )

  const handleTextChange = useCallback(
    (tweetId: string, text: string) => {
      onThreadChange(thread.map((t) => (t.id === tweetId ? { ...t, text } : t)))
    },
    [thread, onThreadChange]
  )

  const handleAddMedia = useCallback(
    (tweetId: string, files: FileList) => {
      mediaUpload.addFilesToContext(tweetId, files)
    },
    [mediaUpload]
  )

  const handleRemoveMedia = useCallback(
    (tweetId: string, uploadId: string) => {
      mediaUpload.removeFileFromContext(tweetId, uploadId)
    },
    [mediaUpload]
  )

  const handleRetryMedia = useCallback(
    (tweetId: string, uploadId: string) => {
      mediaUpload.retryUpload(tweetId, uploadId)
    },
    [mediaUpload]
  )

  // Empty state - show add button only
  if (thread.length === 0) {
    return (
      <div className={cn('bg-card border-border-subtle rounded-xl border p-4', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">
              {t('dashboard.createPost.twitter.thread.title')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddTweet}
            className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.createPost.twitter.thread.addTweet')}
          </button>
        </div>

        <p className="text-muted-foreground/60 mt-2 text-xs">
          {t('dashboard.createPost.twitter.thread.empty.description')}
        </p>
      </div>
    )
  }

  // Thread with items
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary h-4 w-4" />
          <span className="text-foreground text-sm font-medium">
            {t('dashboard.createPost.twitter.thread.summary', { count: thread.length + 1 })}
          </span>
          <span className="text-muted-foreground text-xs">
            (
            {t('dashboard.createPost.twitter.thread.tweetNumber', {
              current: 1,
              total: thread.length + 1,
            })}{' '}
            = {t('dashboard.createPost.twitter.thread.mainTweet')})
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddTweet}
          className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.createPost.twitter.thread.addTweet')}
        </button>
      </div>

      {/* Thread items with drag-and-drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={thread.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {thread.map((tweet, index) => (
              <TwitterThreadItem
                key={tweet.id}
                tweet={tweet}
                index={index + 1}
                totalTweets={thread.length + 1}
                onTextChange={(text) => handleTextChange(tweet.id, text)}
                onRemove={() => handleRemoveTweet(tweet.id)}
                uploads={mediaUpload.getUploadsArray(tweet.id)}
                onAddMedia={(files) => handleAddMedia(tweet.id, files)}
                onRemoveMedia={(uploadId) => handleRemoveMedia(tweet.id, uploadId)}
                onRetryMedia={(uploadId) => handleRetryMedia(tweet.id, uploadId)}
                canAddMoreMedia={mediaUpload.canAddMore(tweet.id)}
                isOnly={thread.length === 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
