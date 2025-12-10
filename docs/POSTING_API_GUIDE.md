# Posting API Integration Guide

This guide explains how to integrate the `POST /api/posts` endpoint in your frontend application.

## Authentication

All requests to this endpoint require authentication. Include the session cookie or authorization header from better-auth.

```typescript
// If using cookies (recommended for web apps)
fetch('/api/posts', {
  method: 'POST',
  credentials: 'include', // Important: sends cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

// If using bearer token
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  },
  body: JSON.stringify(payload)
});
```

## Endpoint Details

**URL:** `POST /api/posts`

**Content-Type:** `application/json`

## Request Schema

```typescript
interface CreatePostRequest {
  // Required: The main caption/text for the post
  caption: string; // max 3000 characters

  // Required: Array of SocialConnection UUIDs to post to
  social_accounts: string[];

  // Optional: ISO 8601 datetime for scheduling
  scheduled_at?: string | null;

  // Optional: Save as draft without processing
  is_draft?: boolean;

  // Optional: Media URLs to attach
  media_urls?: string[];

  // Optional: Platform-specific overrides
  platform_configurations?: {
    linkedin?: { caption?: string; media?: string[] };
    twitter?: { caption?: string; media?: string[] };
    bluesky?: { caption?: string; media?: string[] };
    tiktok?: { caption?: string; media?: string[] };
    pinterest?: { caption?: string; media?: string[] };
    instagram?: { caption?: string; media?: string[] };
  };

  // Optional: Account-specific overrides (highest priority)
  account_configurations?: {
    account_configurations: Array<{
      account_id: string; // SocialConnection UUID
      caption?: string;
      media?: string[];
    }>;
  };
}
```

## Response Schema

```typescript
interface PostResponse {
  id: string;
  caption: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduled_at: string | null;
  is_draft: boolean;
  social_accounts: string[];
  platform_configurations: object | null;
  account_configurations: object | null;
  media: string[] | null;
  created_at: string;
  updated_at: string;
}
```

## Configuration Priority

When determining the final caption/media for each account, the system uses this priority:

1. **Account configuration** (highest) - specific to one account
2. **Platform configuration** - applies to all accounts of that platform
3. **Default** (lowest) - the main `caption` and `media_urls`

## Examples

### Basic Post to Multiple Accounts

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caption: 'Check out our new product launch! 🚀',
    social_accounts: [
      'uuid-linkedin-account',
      'uuid-twitter-account',
      'uuid-instagram-account'
    ]
  })
});

const post = await response.json();
console.log('Post created:', post.id);
```

### Post with Platform-Specific Captions

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caption: 'Check out our new product launch!',
    social_accounts: [
      'uuid-linkedin-account',
      'uuid-twitter-account'
    ],
    platform_configurations: {
      twitter: {
        caption: 'New product drop! 🚀 #launch #newproduct'  // shorter for Twitter
      },
      linkedin: {
        caption: 'Excited to announce our latest innovation. After months of development, we are proud to present our new product that will transform how teams collaborate. Read more in the comments!'
      }
    }
  })
});
```

### Post with Account-Specific Overrides

Use this when you have multiple accounts on the same platform with different audiences:

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caption: 'Default caption for all accounts',
    social_accounts: [
      'uuid-personal-twitter',
      'uuid-business-twitter',
      'uuid-linkedin'
    ],
    platform_configurations: {
      twitter: { caption: 'Default Twitter caption' }
    },
    account_configurations: {
      account_configurations: [
        {
          account_id: 'uuid-business-twitter',
          caption: 'Official announcement: We are launching something big! Stay tuned. #business'
        }
      ]
    }
  })
});
// Result:
// - uuid-personal-twitter gets: "Default Twitter caption" (platform config)
// - uuid-business-twitter gets: "Official announcement..." (account config override)
// - uuid-linkedin gets: "Default caption for all accounts" (base caption)
```

### Scheduled Post

```typescript
const scheduledTime = new Date();
scheduledTime.setHours(scheduledTime.getHours() + 24); // 24 hours from now

const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caption: 'This will be posted tomorrow!',
    social_accounts: ['uuid-account-1', 'uuid-account-2'],
    scheduled_at: scheduledTime.toISOString()
  })
});

const post = await response.json();
console.log('Post scheduled for:', post.scheduled_at);
// status will be 'pending' until scheduled time
```

### Save as Draft

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caption: 'Work in progress post...',
    social_accounts: ['uuid-account-1'],
    is_draft: true
  })
});

const post = await response.json();
console.log('Draft saved:', post.id);
// status will be 'pending', is_draft will be true
```

### Post with Media

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    caption: 'Check out these photos from our event!',
    social_accounts: ['uuid-instagram', 'uuid-linkedin'],
    media_urls: [
      'https://your-cdn.com/image1.jpg',
      'https://your-cdn.com/image2.jpg'
    ],
    platform_configurations: {
      instagram: {
        // Instagram gets different media
        media: ['https://your-cdn.com/instagram-optimized.jpg']
      }
    }
  })
});
```

## Getting Post Status

After creating a post, you can check its status:

```typescript
const response = await fetch(`/api/posts/${postId}`, {
  method: 'GET',
  credentials: 'include'
});

const status = await response.json();
```

**Response:**

```typescript
interface PostStatusResponse {
  id: string;
  caption: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduled_at: string | null;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  social_accounts: Array<{
    id: string;
    platform: string;
    display_name: string;
    username: string;
  }>;
  platform_results: Array<{
    platform: string;
    status: 'queued' | 'posted' | 'failed';
    posted_at: string | null;
    url: string | null;
    error: string | null;
  }>;
}
```

## Getting User's Connected Accounts

Before creating a post, fetch the user's connected social accounts:

```typescript
const response = await fetch('/api/connections', {
  method: 'GET',
  credentials: 'include'
});

const connections = await response.json();
// Returns array of SocialConnection objects with id, platform, displayName, etc.
```

## Error Handling

```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  const error = await response.json();

  switch (response.status) {
    case 400:
      // Validation error or invalid social accounts
      console.error('Bad request:', error.message);
      break;
    case 401:
      // Not authenticated - redirect to login
      window.location.href = '/login';
      break;
    case 404:
      // Social account not found
      console.error('Account not found:', error.message);
      break;
    default:
      console.error('Error creating post:', error.message);
  }
  return;
}

const post = await response.json();
```

## TypeScript Types

```typescript
// types/posts.ts

export type Platform =
  | 'linkedin'
  | 'twitter'
  | 'bluesky'
  | 'tiktok'
  | 'pinterest'
  | 'instagram';

export type PostStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PlatformPostStatus = 'queued' | 'posted' | 'failed';

export interface PlatformConfig {
  caption?: string;
  media?: string[];
}

export interface AccountConfig {
  account_id: string;
  caption?: string;
  media?: string[];
}

export interface CreatePostRequest {
  caption: string;
  social_accounts: string[];
  scheduled_at?: string | null;
  is_draft?: boolean;
  media_urls?: string[];
  platform_configurations?: Partial<Record<Platform, PlatformConfig>>;
  account_configurations?: {
    account_configurations: AccountConfig[];
  };
}

export interface PostResponse {
  id: string;
  caption: string;
  status: PostStatus;
  scheduled_at: string | null;
  is_draft: boolean;
  social_accounts: string[];
  platform_configurations: Partial<Record<Platform, PlatformConfig>> | null;
  account_configurations: { account_configurations: AccountConfig[] } | null;
  media: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  display_name: string;
  username: string;
}

export interface PlatformResult {
  platform: Platform;
  status: PlatformPostStatus;
  posted_at: string | null;
  url: string | null;
  error: string | null;
}

export interface PostStatusResponse {
  id: string;
  caption: string;
  status: PostStatus;
  scheduled_at: string | null;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  social_accounts: SocialAccount[];
  platform_results: PlatformResult[];
}
```

## React Hook Example

```typescript
// hooks/usePosts.ts
import { useState } from 'react';
import type { CreatePostRequest, PostResponse } from '../types/posts';

export function useCreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: CreatePostRequest): Promise<PostResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading, error };
}
```

## Platform Character Limits

When building your UI, enforce these character limits:

| Platform   | Max Characters |
|------------|----------------|
| LinkedIn   | 3000           |
| Twitter    | 280            |
| Bluesky    | 300            |
| Instagram  | 2200           |
| TikTok     | 2200           |
| Pinterest  | 500            |

## Platform Media Requirements

| Platform   | Media Type | Max Count | Notes |
|------------|------------|-----------|-------|
| LinkedIn   | Images     | 20        | Max 5MB per image |
| Twitter    | Images     | 4         | JPG, PNG, GIF, WEBP |
| Bluesky    | Images     | 4         | Max 1MB per image |
| Instagram  | Images     | 10        | Square/portrait/landscape |
| TikTok     | Video      | 1         | Required for posts |
| Pinterest  | Images     | 1         | Required for pins |
