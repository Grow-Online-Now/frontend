# Frontend Posting Guide (React + Vite)

This guide explains how to create posts with media to multiple social media platforms using the enhanced posting API. It assumes you've already implemented media uploads using the [Media Upload Guide](./FRONTEND_MEDIA_UPLOAD_GUIDE.md).

## Overview

The posting flow works in these steps:
1. **Upload Media** - Upload files to S3, get `mediaId` for each
2. **Create Post** - Send post with `mediaIds` and platform configurations
3. **Poll Status** - Monitor post status across platforms

```
┌─────────────┐                        ┌─────────────┐
│   Frontend  │  1. Upload media       │   Backend   │
│             │ ──────────────────────►│             │
│             │ ◄──────────────────────│             │
│             │     mediaIds           │             │
│             │                        │             │
│             │  2. Create post        │             │
│             │ ──────────────────────►│             │──► Platform Queues
│             │ ◄──────────────────────│             │
│             │     postId             │             │
│             │                        │             │
│             │  3. Poll status        │             │
│             │ ──────────────────────►│             │
│             │ ◄──────────────────────│             │
│             │     platform statuses  │             │
└─────────────┘                        └─────────────┘
```

## Supported Platforms & Content Types

| Platform   | Image Post | Video Post | Reels | Shorts | Stories | Carousels |
|------------|------------|------------|-------|--------|---------|-----------|
| Instagram  | ✅         | ✅ (as Reel)| ✅    | —      | ✅      | ✅ (10 max) |
| TikTok     | ✅ (carousel)| ✅       | —     | —      | —       | ✅ (35 max) |
| YouTube    | —          | ✅         | —     | ✅     | —       | —         |
| Facebook   | ✅         | ✅         | ✅    | —      | —       | —         |
| LinkedIn   | ✅         | ✅         | —     | —      | —       | —         |
| Twitter    | ✅         | ✅         | —     | —      | —       | —         |
| Pinterest  | ✅         | ✅         | —     | —      | —       | —         |
| Bluesky    | ✅         | —          | —     | —      | —       | —         |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/multi-platform` | Create post to multiple platforms |
| GET | `/api/posts/:id` | Get post status across all platforms |
| GET | `/api/connections` | List connected social accounts |

---

## TypeScript Types

Create `src/types/posting.ts`:

```typescript
// Platform types
export type Platform =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'pinterest'
  | 'bluesky';

// Instagram content types
export type InstagramContentType = 'post' | 'reel' | 'story' | 'carousel';

// TikTok content types
export type TikTokContentType = 'video' | 'photo';

// YouTube content types
export type YouTubeContentType = 'video' | 'short';

// TikTok privacy levels
export type TikTokPrivacyLevel =
  | 'PUBLIC_TO_EVERYONE'
  | 'MUTUAL_FOLLOW_FRIENDS'
  | 'FOLLOWER_OF_CREATOR'
  | 'SELF_ONLY';

// YouTube privacy status
export type YouTubePrivacyStatus = 'public' | 'private' | 'unlisted';

// Platform-specific configurations
export interface InstagramPlatformConfig {
  contentType?: InstagramContentType;  // Auto-detected if not set
  shareToFeed?: boolean;               // For Reels, share to main feed
  coverMediaId?: string;               // Custom cover image for Reels
  thumbOffset?: number;                // Thumbnail offset in ms for Reels
}

export interface TikTokPlatformConfig {
  contentType?: TikTokContentType;     // Auto-detected if not set
  privacyLevel?: TikTokPrivacyLevel;   // Default: PUBLIC_TO_EVERYONE
  disableComment?: boolean;
  autoAddMusic?: boolean;              // For photo carousels
  coverIndex?: number;                 // Which image is cover (0-indexed)
}

export interface YouTubePlatformConfig {
  contentType?: YouTubeContentType;    // Auto-detected if not set
  privacyStatus?: YouTubePrivacyStatus;// Default: public
  categoryId?: string;                 // YouTube category (default: 22 = People & Blogs)
  tags?: string[];                     // Video tags
  thumbnailMediaId?: string;           // Custom thumbnail image
  notifySubscribers?: boolean;         // Notify subscribers (default: true)
  madeForKids?: boolean;               // COPPA compliance (default: false)
  embeddable?: boolean;                // Allow embedding (default: true)
  publishAt?: string;                  // ISO date for scheduled publish
}

export interface PlatformSpecificConfig {
  instagram?: InstagramPlatformConfig;
  tiktok?: TikTokPlatformConfig;
  youtube?: YouTubePlatformConfig;
}

// Create post request
export interface CreatePostRequest {
  caption: string;
  social_accounts: string[];           // Array of connection IDs
  media_ids?: string[];                // Array of media IDs from upload
  media_urls?: string[];               // Legacy: direct URLs (deprecated)
  scheduled_for?: string;              // ISO date for scheduling
  platform_configurations?: PlatformSpecificConfig;
}

// Post status response
export interface PlatformPostStatus {
  id: string;
  platform: Platform;
  status: 'queued' | 'posted' | 'failed';
  platformPostId?: string;
  url?: string;
  errorMessage?: string;
  postedAt?: string;
}

export interface PostStatusResponse {
  id: string;
  caption: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledFor?: string;
  createdAt: string;
  platformPosts: PlatformPostStatus[];
}

// Social connection
export interface SocialConnection {
  id: string;
  platform: Platform;
  displayName: string;
  platformUsername?: string;
  isActive: boolean;
  createdAt: string;
}
```

---

## Posting Service

Create `src/services/postingService.ts`:

```typescript
import type {
  CreatePostRequest,
  PostStatusResponse,
  SocialConnection,
  PlatformSpecificConfig,
} from '../types/posting';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class PostingService {
  /**
   * Create a multi-platform post
   */
  async createPost(request: CreatePostRequest): Promise<PostStatusResponse> {
    const response = await fetch(`${API_BASE}/api/posts/multi-platform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Post creation failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get post status across all platforms
   */
  async getPostStatus(postId: string): Promise<PostStatusResponse> {
    const response = await fetch(`${API_BASE}/api/posts/${postId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get post status');
    }

    return response.json();
  }

  /**
   * Poll post status until completion or timeout
   */
  async pollPostStatus(
    postId: string,
    options?: {
      interval?: number;      // ms between polls, default 2000
      timeout?: number;       // max wait time in ms, default 120000
      onUpdate?: (status: PostStatusResponse) => void;
    }
  ): Promise<PostStatusResponse> {
    const interval = options?.interval ?? 2000;
    const timeout = options?.timeout ?? 120000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getPostStatus(postId);
      options?.onUpdate?.(status);

      // Check if all platform posts are complete
      const allComplete = status.platformPosts.every(
        (p) => p.status === 'posted' || p.status === 'failed'
      );

      if (allComplete || status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error('Polling timed out');
  }

  /**
   * Get all connected social accounts
   */
  async getConnections(): Promise<SocialConnection[]> {
    const response = await fetch(`${API_BASE}/api/connections`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get connections');
    }

    return response.json();
  }
}

export const postingService = new PostingService();
```

---

## React Hook for Posting

Create `src/hooks/useCreatePost.ts`:

```typescript
import { useState, useCallback } from 'react';
import { postingService } from '../services/postingService';
import type {
  CreatePostRequest,
  PostStatusResponse,
  PlatformPostStatus,
} from '../types/posting';

interface CreatePostState {
  isCreating: boolean;
  isPolling: boolean;
  error: string | null;
  post: PostStatusResponse | null;
  platformStatuses: Map<string, PlatformPostStatus>;
}

export function useCreatePost() {
  const [state, setState] = useState<CreatePostState>({
    isCreating: false,
    isPolling: false,
    error: null,
    post: null,
    platformStatuses: new Map(),
  });

  const createPost = useCallback(async (
    request: CreatePostRequest,
    options?: { poll?: boolean }
  ): Promise<PostStatusResponse | null> => {
    setState((prev) => ({
      ...prev,
      isCreating: true,
      error: null,
      post: null,
      platformStatuses: new Map(),
    }));

    try {
      // Create the post
      const post = await postingService.createPost(request);

      setState((prev) => ({
        ...prev,
        isCreating: false,
        post,
        platformStatuses: new Map(
          post.platformPosts.map((p) => [p.platform, p])
        ),
      }));

      // Optionally poll for status updates
      if (options?.poll !== false) {
        setState((prev) => ({ ...prev, isPolling: true }));

        const finalStatus = await postingService.pollPostStatus(post.id, {
          onUpdate: (status) => {
            setState((prev) => ({
              ...prev,
              post: status,
              platformStatuses: new Map(
                status.platformPosts.map((p) => [p.platform, p])
              ),
            }));
          },
        });

        setState((prev) => ({
          ...prev,
          isPolling: false,
          post: finalStatus,
          platformStatuses: new Map(
            finalStatus.platformPosts.map((p) => [p.platform, p])
          ),
        }));

        return finalStatus;
      }

      return post;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Post creation failed';
      setState((prev) => ({
        ...prev,
        isCreating: false,
        isPolling: false,
        error: message,
      }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isCreating: false,
      isPolling: false,
      error: null,
      post: null,
      platformStatuses: new Map(),
    });
  }, []);

  return {
    ...state,
    isLoading: state.isCreating || state.isPolling,
    createPost,
    reset,
  };
}
```

---

## Usage Examples

### Basic Post with Media IDs

```typescript
import { postingService } from './services/postingService';

// After uploading media files, use their IDs
const mediaIds = ['media-uuid-1', 'media-uuid-2'];

const post = await postingService.createPost({
  caption: 'Check out my new post! #SocialMedia',
  social_accounts: ['connection-uuid-instagram', 'connection-uuid-linkedin'],
  media_ids: mediaIds,
});

console.log('Post created:', post.id);
```

### Instagram Reel with Custom Cover

```typescript
const post = await postingService.createPost({
  caption: 'My awesome Reel! 🎬 #Reels #Viral',
  social_accounts: ['instagram-connection-id'],
  media_ids: ['video-media-id'],
  platform_configurations: {
    instagram: {
      contentType: 'reel',           // Force Reel (auto-detected for <90s vertical videos)
      shareToFeed: true,             // Also show on main feed
      coverMediaId: 'cover-image-id', // Custom cover image
      // Or use thumbOffset for auto-generated thumbnail:
      // thumbOffset: 5000,          // Use frame at 5 seconds
    },
  },
});
```

### Instagram Story

```typescript
const post = await postingService.createPost({
  caption: '',  // Stories don't support captions via API
  social_accounts: ['instagram-connection-id'],
  media_ids: ['story-media-id'],  // Image or video
  platform_configurations: {
    instagram: {
      contentType: 'story',
    },
  },
});
```

### Instagram Carousel (Multiple Images/Videos)

```typescript
const post = await postingService.createPost({
  caption: 'Swipe through my carousel! ➡️',
  social_accounts: ['instagram-connection-id'],
  media_ids: [
    'image-1-id',
    'image-2-id',
    'video-1-id',
    'image-3-id',
  ],  // 2-10 items, mixed images and videos allowed
  platform_configurations: {
    instagram: {
      contentType: 'carousel',  // Auto-detected when multiple media items
    },
  },
});
```

### TikTok Photo Carousel

```typescript
const post = await postingService.createPost({
  caption: 'Photo carousel on TikTok! 📸',
  social_accounts: ['tiktok-connection-id'],
  media_ids: [
    'photo-1-id',
    'photo-2-id',
    'photo-3-id',
    // ... up to 35 images
  ],
  platform_configurations: {
    tiktok: {
      contentType: 'photo',           // Force photo carousel
      privacyLevel: 'PUBLIC_TO_EVERYONE',
      autoAddMusic: true,             // TikTok adds background music
      coverIndex: 0,                  // First image as cover
      disableComment: false,
    },
  },
});
```

### TikTok Video

```typescript
const post = await postingService.createPost({
  caption: 'My TikTok video! 🎵',
  social_accounts: ['tiktok-connection-id'],
  media_ids: ['video-media-id'],
  platform_configurations: {
    tiktok: {
      contentType: 'video',
      privacyLevel: 'PUBLIC_TO_EVERYONE',
      disableComment: false,
    },
  },
});
```

### YouTube Video

```typescript
const post = await postingService.createPost({
  caption: 'Full video tutorial on my channel!',  // Used as title + description
  social_accounts: ['youtube-connection-id'],
  media_ids: ['video-media-id'],
  platform_configurations: {
    youtube: {
      contentType: 'video',           // Auto-detected based on duration/aspect
      privacyStatus: 'public',
      categoryId: '22',               // People & Blogs
      tags: ['tutorial', 'howto', 'educational'],
      thumbnailMediaId: 'thumbnail-image-id',  // Custom thumbnail
      notifySubscribers: true,
      madeForKids: false,
      embeddable: true,
    },
  },
});
```

### YouTube Shorts

```typescript
const post = await postingService.createPost({
  caption: 'Quick tip! #Shorts',  // #Shorts tag helps algorithm
  social_accounts: ['youtube-connection-id'],
  media_ids: ['short-video-id'],  // <60s, vertical video
  platform_configurations: {
    youtube: {
      contentType: 'short',           // Force Short (auto-detected for <60s vertical)
      privacyStatus: 'public',
      notifySubscribers: true,
    },
  },
});
```

### Multi-Platform Post with Different Configs

```typescript
const post = await postingService.createPost({
  caption: 'Cross-platform content! 🚀',
  social_accounts: [
    'instagram-connection-id',
    'tiktok-connection-id',
    'youtube-connection-id',
    'linkedin-connection-id',
    'twitter-connection-id',
  ],
  media_ids: ['video-media-id'],
  platform_configurations: {
    instagram: {
      contentType: 'reel',
      shareToFeed: true,
    },
    tiktok: {
      privacyLevel: 'PUBLIC_TO_EVERYONE',
    },
    youtube: {
      contentType: 'short',
      tags: ['shorts', 'viral'],
    },
    // LinkedIn and Twitter use defaults (no special config needed)
  },
});
```

### Scheduled Post

```typescript
const scheduledDate = new Date();
scheduledDate.setHours(scheduledDate.getHours() + 24);  // 24 hours from now

const post = await postingService.createPost({
  caption: 'This will post tomorrow!',
  social_accounts: ['instagram-connection-id', 'twitter-connection-id'],
  media_ids: ['image-media-id'],
  scheduled_for: scheduledDate.toISOString(),
});
```

---

## Complete Form Component

Here's a full example of a post creation form:

```tsx
import React, { useState, useEffect } from 'react';
import { MediaUploader } from './MediaUploader';
import { useCreatePost } from '../hooks/useCreatePost';
import { postingService } from '../services/postingService';
import type {
  MediaItem,
  SocialConnection,
  InstagramContentType,
  TikTokPrivacyLevel,
  YouTubePrivacyStatus,
  PlatformSpecificConfig,
} from '../types';

export function CreatePostForm() {
  // Form state
  const [caption, setCaption] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [scheduledFor, setScheduledFor] = useState<string>('');

  // Platform-specific configs
  const [instagramConfig, setInstagramConfig] = useState<{
    contentType?: InstagramContentType;
    shareToFeed?: boolean;
  }>({});
  const [tiktokConfig, setTiktokConfig] = useState<{
    privacyLevel?: TikTokPrivacyLevel;
  }>({ privacyLevel: 'PUBLIC_TO_EVERYONE' });
  const [youtubeConfig, setYoutubeConfig] = useState<{
    privacyStatus?: YouTubePrivacyStatus;
    tags?: string[];
  }>({ privacyStatus: 'public' });

  // Post creation hook
  const {
    isLoading,
    error,
    post,
    platformStatuses,
    createPost,
    reset
  } = useCreatePost();

  // Load connections on mount
  useEffect(() => {
    postingService.getConnections().then(setConnections);
  }, []);

  // Handle media upload complete
  const handleMediaUpload = (media: MediaItem) => {
    setUploadedMedia((prev) => [...prev, media]);
  };

  // Remove uploaded media
  const removeMedia = (mediaId: string) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  // Toggle account selection
  const toggleAccount = (connectionId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(connectionId)
        ? prev.filter((id) => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  // Check which platforms are selected
  const hasInstagram = connections
    .filter((c) => selectedAccounts.includes(c.id))
    .some((c) => c.platform === 'instagram');
  const hasTikTok = connections
    .filter((c) => selectedAccounts.includes(c.id))
    .some((c) => c.platform === 'tiktok');
  const hasYouTube = connections
    .filter((c) => selectedAccounts.includes(c.id))
    .some((c) => c.platform === 'youtube');

  // Determine if we should show video-specific options
  const hasVideo = uploadedMedia.some((m) => m.mediaType === 'video');
  const hasMultipleMedia = uploadedMedia.length > 1;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build platform configurations
    const platformConfigurations: PlatformSpecificConfig = {};

    if (hasInstagram) {
      platformConfigurations.instagram = {
        ...instagramConfig,
        // Auto-detect carousel if multiple media
        contentType: hasMultipleMedia ? 'carousel' : instagramConfig.contentType,
      };
    }

    if (hasTikTok) {
      platformConfigurations.tiktok = {
        ...tiktokConfig,
        // Auto-detect photo carousel if multiple images, no video
        contentType: hasMultipleMedia && !hasVideo ? 'photo' : 'video',
      };
    }

    if (hasYouTube) {
      platformConfigurations.youtube = {
        ...youtubeConfig,
        tags: youtubeConfig.tags || [],
      };
    }

    const result = await createPost({
      caption,
      social_accounts: selectedAccounts,
      media_ids: uploadedMedia.map((m) => m.id),
      scheduled_for: scheduledFor || undefined,
      platform_configurations: platformConfigurations,
    });

    if (result) {
      // Success - could reset form or show success message
      console.log('Post created successfully:', result);
    }
  };

  return (
    <div className="create-post-form">
      <form onSubmit={handleSubmit}>
        {/* Caption */}
        <div className="form-group">
          <label htmlFor="caption">Caption</label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {/* Media Upload */}
        <div className="form-group">
          <label>Media</label>

          {uploadedMedia.length > 0 && (
            <div className="media-preview-grid">
              {uploadedMedia.map((media, index) => (
                <div key={media.id} className="media-preview-item">
                  {media.mediaType === 'image' ? (
                    <img src={media.url!} alt={media.fileName} />
                  ) : (
                    <video src={media.url!} controls />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(media.id)}
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                  <span className="order-badge">{index + 1}</span>
                </div>
              ))}
            </div>
          )}

          <MediaUploader
            onUploadComplete={handleMediaUpload}
            onError={(err) => console.error(err)}
            disabled={isLoading}
          />

          {uploadedMedia.length > 0 && (
            <p className="media-count">
              {uploadedMedia.length} file(s) uploaded
              {hasMultipleMedia && ' - Will create carousel on supported platforms'}
            </p>
          )}
        </div>

        {/* Account Selection */}
        <div className="form-group">
          <label>Post to</label>
          <div className="account-grid">
            {connections.map((connection) => (
              <label
                key={connection.id}
                className={`account-option ${
                  selectedAccounts.includes(connection.id) ? 'selected' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(connection.id)}
                  onChange={() => toggleAccount(connection.id)}
                  disabled={isLoading}
                />
                <span className="platform-icon">{connection.platform}</span>
                <span className="account-name">{connection.displayName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Instagram Options */}
        {hasInstagram && hasVideo && !hasMultipleMedia && (
          <div className="form-group platform-options">
            <label>Instagram Options</label>
            <div className="options-row">
              <label>
                <input
                  type="radio"
                  name="instagram-type"
                  checked={instagramConfig.contentType !== 'story'}
                  onChange={() => setInstagramConfig((prev) => ({
                    ...prev,
                    contentType: 'reel'
                  }))}
                />
                Post as Reel
              </label>
              <label>
                <input
                  type="radio"
                  name="instagram-type"
                  checked={instagramConfig.contentType === 'story'}
                  onChange={() => setInstagramConfig((prev) => ({
                    ...prev,
                    contentType: 'story'
                  }))}
                />
                Post as Story
              </label>
            </div>
            {instagramConfig.contentType === 'reel' && (
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={instagramConfig.shareToFeed ?? true}
                  onChange={(e) => setInstagramConfig((prev) => ({
                    ...prev,
                    shareToFeed: e.target.checked,
                  }))}
                />
                Share Reel to Feed
              </label>
            )}
          </div>
        )}

        {/* TikTok Options */}
        {hasTikTok && (
          <div className="form-group platform-options">
            <label>TikTok Options</label>
            <select
              value={tiktokConfig.privacyLevel}
              onChange={(e) => setTiktokConfig((prev) => ({
                ...prev,
                privacyLevel: e.target.value as TikTokPrivacyLevel,
              }))}
            >
              <option value="PUBLIC_TO_EVERYONE">Public</option>
              <option value="FOLLOWER_OF_CREATOR">Followers Only</option>
              <option value="MUTUAL_FOLLOW_FRIENDS">Friends Only</option>
              <option value="SELF_ONLY">Private</option>
            </select>
          </div>
        )}

        {/* YouTube Options */}
        {hasYouTube && hasVideo && (
          <div className="form-group platform-options">
            <label>YouTube Options</label>
            <select
              value={youtubeConfig.privacyStatus}
              onChange={(e) => setYoutubeConfig((prev) => ({
                ...prev,
                privacyStatus: e.target.value as YouTubePrivacyStatus,
              }))}
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              onChange={(e) => setYoutubeConfig((prev) => ({
                ...prev,
                tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
              }))}
            />
          </div>
        )}

        {/* Schedule */}
        <div className="form-group">
          <label htmlFor="schedule">Schedule (optional)</label>
          <input
            type="datetime-local"
            id="schedule"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            disabled={isLoading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
            <button type="button" onClick={reset}>Dismiss</button>
          </div>
        )}

        {/* Platform Status */}
        {post && platformStatuses.size > 0 && (
          <div className="platform-status">
            <h4>Post Status</h4>
            {Array.from(platformStatuses.values()).map((status) => (
              <div key={status.id} className={`status-item ${status.status}`}>
                <span className="platform">{status.platform}</span>
                <span className="status">{status.status}</span>
                {status.url && (
                  <a href={status.url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                )}
                {status.errorMessage && (
                  <span className="error">{status.errorMessage}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            !caption ||
            selectedAccounts.length === 0 ||
            isLoading
          }
          className="submit-btn"
        >
          {isLoading ? 'Posting...' : scheduledFor ? 'Schedule Post' : 'Post Now'}
        </button>
      </form>
    </div>
  );
}
```

---

## Content Type Auto-Detection

The backend automatically detects the appropriate content type based on media characteristics:

### Instagram
| Media | Detected Type |
|-------|---------------|
| 1 image | `post` |
| 1 video, <90s, 9:16 aspect | `reel` |
| 1 video, other | `reel` (Instagram posts all videos as Reels) |
| 2-10 mixed media | `carousel` |
| Explicit `story` config | `story` |

### TikTok
| Media | Detected Type |
|-------|---------------|
| 1+ images only | `photo` (carousel) |
| 1 video | `video` |

### YouTube
| Media | Detected Type |
|-------|---------------|
| Video, <60s, 9:16 aspect | `short` |
| Video, other | `video` |

---

## Testing Checklist

Use this checklist to test all posting scenarios:

### Prerequisites
- [ ] Backend running (`pnpm run start:dev`)
- [ ] Redis running (`docker-compose up -d redis`)
- [ ] PostgreSQL running (`docker-compose up -d postgres`)
- [ ] At least one connected social account per platform

### Basic Posts
- [ ] Single image post to Instagram
- [ ] Single image post to multiple platforms
- [ ] Text-only post to Facebook/LinkedIn/Twitter
- [ ] Video post to LinkedIn/Twitter

### Instagram-Specific
- [ ] Reel (vertical video <90s)
- [ ] Reel with custom cover image
- [ ] Story (image)
- [ ] Story (video)
- [ ] Carousel (2-10 images)
- [ ] Carousel with mixed images and videos

### TikTok-Specific
- [ ] Video post
- [ ] Photo carousel (2-35 images)
- [ ] Photo carousel with custom cover index
- [ ] Different privacy levels

### YouTube-Specific
- [ ] Regular video upload
- [ ] YouTube Short (vertical <60s)
- [ ] Video with custom thumbnail
- [ ] Video with tags
- [ ] Different privacy statuses

### Multi-Platform
- [ ] Same content to Instagram, TikTok, YouTube
- [ ] Different configs per platform
- [ ] Verify content type auto-detection

### Scheduling
- [ ] Schedule post for future time
- [ ] Verify post appears at scheduled time

### Error Handling
- [ ] Invalid media type for platform
- [ ] Expired/invalid connection
- [ ] Network error during posting
- [ ] Rate limit handling

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Media not found" | Invalid or expired mediaId | Re-upload the media |
| "Connection not found" | Invalid connectionId | Re-fetch connections list |
| "Access denied" | Token expired | User needs to reconnect account |
| Post stuck in "queued" | Queue worker not running | Check Redis connection |
| Instagram "Media type not supported" | Wrong aspect ratio | Use 1:1, 4:5, or 9:16 |
| YouTube "Video too short" | <1 second video | Minimum 1 second |
| TikTok "Domain not verified" | S3 bucket domain issue | Contact backend team |

### Debugging Tips

1. **Check post status polling**: Use browser dev tools to monitor `/api/posts/:id` requests
2. **View queue status**: GET `/api/queues/status` shows all platform queues
3. **Check server logs**: Look for platform-specific error messages
4. **Verify media status**: Ensure all mediaIds have `status: 'ready'` before posting

---

## API Reference

### POST /api/posts/multi-platform

**Request Body:**
```json
{
  "caption": "string",
  "social_accounts": ["uuid-1", "uuid-2"],
  "media_ids": ["media-uuid-1"],
  "media_urls": ["https://..."],
  "scheduled_for": "2024-01-15T10:00:00Z",
  "platform_configurations": {
    "instagram": {
      "contentType": "reel",
      "shareToFeed": true,
      "coverMediaId": "uuid",
      "thumbOffset": 5000
    },
    "tiktok": {
      "contentType": "video",
      "privacyLevel": "PUBLIC_TO_EVERYONE",
      "disableComment": false,
      "autoAddMusic": true,
      "coverIndex": 0
    },
    "youtube": {
      "contentType": "video",
      "privacyStatus": "public",
      "categoryId": "22",
      "tags": ["tag1", "tag2"],
      "thumbnailMediaId": "uuid",
      "notifySubscribers": true,
      "madeForKids": false,
      "embeddable": true,
      "publishAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

**Response:**
```json
{
  "id": "post-uuid",
  "caption": "string",
  "status": "pending",
  "scheduledFor": null,
  "createdAt": "2024-01-15T08:00:00Z",
  "platformPosts": [
    {
      "id": "platform-post-uuid",
      "platform": "instagram",
      "status": "queued",
      "platformPostId": null,
      "url": null,
      "errorMessage": null,
      "postedAt": null
    }
  ]
}
```

### GET /api/posts/:id

**Response:** Same as create response, with updated statuses.

### GET /api/connections

**Response:**
```json
[
  {
    "id": "uuid",
    "platform": "instagram",
    "displayName": "@myaccount",
    "platformUsername": "myaccount",
    "isActive": true,
    "createdAt": "2024-01-10T00:00:00Z"
  }
]
```
