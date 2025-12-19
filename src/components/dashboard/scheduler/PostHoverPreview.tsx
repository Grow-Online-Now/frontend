/**
 * PostHoverPreview Component
 * Floating preview card shown when hovering over a post badge in the calendar
 * Now uses platform-specific 1:1 previews
 */

import { SchedulerPostPreview } from './SchedulerPostPreview'
import type { PostResponse } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface PostHoverPreviewProps {
  post: PostResponse
  platform?: SocialPlatform
}

export function PostHoverPreview({ post, platform }: PostHoverPreviewProps) {
  return <SchedulerPostPreview post={post} platform={platform} />
}
