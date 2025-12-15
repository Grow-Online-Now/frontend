# Claude.md - Project Guidelines

**Grow Online** is a SaaS platform (domain: growonline.now) that helps creators, brands, and companies grow on social media. Features include: unified posting across platforms, analytics, and AI-powered content generation.

## Tech Stack
- **Framework**: Vite + React 18+
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Language**: TypeScript (strict mode)
- **State Management**: React hooks (Context API for global state)
- **i18n**: react-i18next (ALL text must be translated)
- **Authentication**: better-auth with session management
- **Routing**: react-router-dom with language prefix (`/:lang/...`)
- **Media Storage**: AWS S3 with presigned URLs

---

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (button, dialog, etc.)
│   ├── common/                # Shared components (Card, Typography, etc.)
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── layout/            # DashboardLayout, Sidebar, Header, MobileNav
│   │   ├── shared/            # DashboardCard, PageHeader, EmptyState
│   │   ├── accounts/          # Account management (PlatformRow, AccountBadge, FacebookPageSelector)
│   │   ├── posts/             # Post creation (AccountSelector, CaptionInput, PlatformIcon)
│   │   ├── create-post/       # Post composer (MediaUploader, CaptionEditor, PlatformHints)
│   │   └── scheduler/         # Calendar components (SchedulerCalendar, WeekView)
│   ├── icons/                 # Platform icons (PlatformIcons.tsx, platform-icons-map.ts)
│   ├── landing/               # Landing page sections
│   ├── legal/                 # Legal pages (Privacy, Terms, etc.)
│   ├── providers/             # Context providers (ThemeProvider)
│   └── auth/                  # Auth components (ProtectedRoute, PublicOnlyRoute)
├── contexts/                  # React contexts (ThemeContext)
├── hooks/                     # Custom hooks
│   ├── useTheme.ts            # Theme management (light/dark/system) + useThemeContext
│   ├── useConnections.ts      # Social account connections + OAuth flow
│   ├── useCreatePost.ts       # Post creation logic
│   ├── useMediaUpload.ts      # S3 media upload with progress tracking
│   ├── usePosts.ts            # Posts listing with filters & pagination
│   ├── useSchedulerPosts.ts   # Calendar/scheduler post organization
│   ├── useStreak.ts           # Posting streak data
│   ├── useLocalizedHref.ts    # Language-aware path helper
│   └── use-mobile.ts          # Mobile detection
├── services/                  # API service layer
│   ├── connections.service.ts # Social connections API
│   ├── posts.service.ts       # Posts CRUD API
│   ├── media.service.ts       # S3 media upload API
│   └── streak.service.ts      # Streak API
├── pages/
│   ├── dashboard/             # Authenticated pages
│   │   ├── DashboardOverview.tsx
│   │   ├── AccountsPage.tsx
│   │   ├── CreatePostPage.tsx
│   │   ├── PostsPage.tsx
│   │   ├── SchedulerPage.tsx
│   │   └── SettingsPage.tsx
│   ├── OAuthCallback.tsx      # OAuth popup callback handler
│   ├── SignIn.tsx / SignUp.tsx
│   └── Landing.tsx, Blog.tsx, etc.
├── types/                     # TypeScript definitions
│   ├── connections.ts         # SocialPlatform, Connection, FacebookPage
│   ├── posts.ts               # CreatePostRequest, PostResponse, ScheduleType
│   ├── media.ts               # MediaItem, UploadProgress, MediaUploadStatus
│   ├── streak.ts              # StreakResponse
│   └── dashboard.ts           # CalendarView, ScheduledPost
├── locales/                   # Translation files (en, fr, es)
├── lib/                       # Utilities & configs
│   ├── api-client.ts          # Typed fetch wrapper with ApiError
│   ├── date-utils.ts          # Calendar/date formatting utilities
│   ├── utils.ts               # cn() class merging helper
│   └── auth-client.ts         # Auth configuration
└── index.css                  # Global styles & theme variables
```

---

## Type Definitions

### Social Platforms (`src/types/connections.ts`)
```typescript
type SocialPlatform =
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'pinterest'
  | 'instagram'
  | 'youtube'
  | 'facebook'

interface Connection {
  id: string
  platform: SocialPlatform
  displayName: string | null
  platformUserId: string
  platformUsername: string
  isActive: boolean
  expiresAt: string | null
  isExpired: boolean
  needsRefresh: boolean
  createdAt: string
}

// Facebook-specific (two-step OAuth)
interface FacebookPage {
  id: string
  name: string
  category: string
}

interface FacebookPagesResponse {
  pendingKey: string
  pages: FacebookPage[]
}
```

### Posts (`src/types/posts.ts`)
```typescript
const PLATFORM_CHARACTER_LIMITS: Record<SocialPlatform, number> = {
  twitter: 280,
  pinterest: 500,
  instagram: 2200,
  tiktok: 2200,
  linkedin: 3000,
  youtube: 5000,
  facebook: 63206,
}

type PostStatus = 'pending' | 'processing' | 'completed' | 'failed'
type ScheduleType = 'now' | 'scheduled' | 'draft'

interface CreatePostRequest {
  caption: string
  social_accounts: string[]
  scheduled_at?: string | null
  is_draft?: boolean
  media_urls?: string[]  // S3 URLs from confirmed uploads
  media_ids?: string[]   // Backend media IDs from confirmed uploads
  platform_configurations?: PlatformConfigurations
}

// Platform-specific configurations (per platform)
interface PlatformConfigurations {
  instagram?: InstagramConfig   // contentType, shareToFeed, coverMediaId
  tiktok?: TikTokConfig         // contentType, privacyLevel, disableComment
  youtube?: YouTubeConfig       // privacyStatus, categoryId, tags, thumbnailMediaId
  twitter?: TwitterConfig       // thread, firstComment
  linkedin?: LinkedInConfig     // visibility (PUBLIC/CONNECTIONS)
}

interface PostResponse {
  id: string
  caption: string
  status: PostStatus
  scheduled_at: string | null
  is_draft: boolean
  created_at: string
  updated_at: string
  social_accounts: PostSocialAccount[]
}
```

### Media (`src/types/media.ts`)
```typescript
type MediaType = 'image' | 'video'

type MediaUploadStatus =
  | 'pending'      // File selected, not started
  | 'requesting'   // Getting presigned URL
  | 'uploading'    // Uploading to S3
  | 'confirming'   // Confirming with backend
  | 'ready'        // Upload complete
  | 'error'        // Upload failed

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

interface MediaItem {
  id: string
  fileName: string
  fileSize: number
  contentType: string
  mediaType: MediaType
  status: 'pending' | 'ready' | 'failed'
  url: string | null
  createdAt: string
}

// File size limits
const MEDIA_SIZE_LIMITS = {
  image: 10 * 1024 * 1024,  // 10MB
  video: 100 * 1024 * 1024, // 100MB
}

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
}
```

### Platform Feature Support (Frontend)

| Platform | Text | Media | Config Panel | Special Features |
|----------|------|-------|--------------|------------------|
| Twitter | ✅ 280 chars | ✅ | ✅ | Threads, first comment |
| Instagram | ✅ 2200 chars | ✅ | ✅ | Content type, share to feed |
| TikTok | ✅ 2200 chars | ✅ | ✅ | Privacy level, disable comments |
| YouTube | ✅ 5000 chars | ✅ | ✅ | Privacy, category, tags, thumbnail |
| LinkedIn | ✅ 3000 chars | ✅ | ✅ | Visibility (PUBLIC/CONNECTIONS), media validation |
| Facebook | ✅ 63206 chars | ✅ | ❌ | None |
| Pinterest | ✅ 500 chars | ✅ | ❌ | None |

**LinkedIn media validation** (enforced in frontend):
- Max 5MB per image (stricter than generic 10MB)
- Max 200MB per video
- Cannot mix images and videos in same post
- Only 1 video per post allowed

---

## Custom Hooks

### useConnections - Social Account Management
```typescript
import { useConnections } from '@/hooks/useConnections'

const {
  connections,           // Connection[]
  isLoading,
  error,
  connect,               // (platform: SocialPlatform) => void - Opens OAuth popup
  disconnect,            // (connectionId: string) => Promise<void>
  refetch,
  // Facebook-specific
  facebookPagesData,     // { pendingKey, pages } | null - Shows when page selection needed
  selectFacebookPageAndConnect,  // (pageId: string) => Promise<void>
  clearFacebookPages,    // () => void - Cancel page selection
} = useConnections()
```

### usePosts - Posts Listing with Filters
```typescript
import { usePosts } from '@/hooks/usePosts'

const {
  posts,                 // PostResponse[]
  pagination,            // { total, page, limit, totalPages }
  isLoading,
  error,
  filters,
  updateFilters,         // (filters: Partial<PostsQueryParams>) => void
  setPage,               // (page: number) => void
  deletePostById,        // (id: string) => Promise<boolean>
  refetch,
} = usePosts({ limit: 10, sort: 'created_at', order: 'desc' })
```

### useCreatePost - Post Creation
```typescript
import { useCreatePost } from '@/hooks/useCreatePost'

const {
  isLoading,
  error,
  success,
  createdPost,
  submitPost,            // (data: CreatePostRequest) => Promise<PostResponse | null>
  reset,
} = useCreatePost()
```

### useMediaUpload - S3 Media Upload
```typescript
import { useMediaUpload } from '@/hooks/useMediaUpload'

const {
  // State
  uploads,               // Map<string, FileUploadState>
  isUploading,           // boolean - any upload in progress

  // Actions
  addFiles,              // (files: FileList | File[]) => string[] - returns IDs
  removeFile,            // (id: string) => Promise<void> - also deletes from S3
  retryUpload,           // (id: string) => Promise<void>
  cancelUpload,          // (id: string) => void
  cancelAll,             // () => void
  reset,                 // () => void

  // Computed
  uploadsArray,          // FileUploadState[]
  completedUploads,      // FileUploadState[] - status === 'ready'
  failedUploads,         // FileUploadState[] - status === 'error'
  pendingUploads,        // FileUploadState[] - in progress
  totalProgress,         // number (0-100)

  // For form submission
  getMediaIds,           // () => string[] - backend media IDs
  getMediaUrls,          // () => string[] - S3 URLs
  allUploadsComplete,    // boolean
  hasErrors,             // boolean
} = useMediaUpload()

// FileUploadState shape:
interface FileUploadState {
  id: string              // Local UUID
  file: File
  localUrl: string        // Object URL for preview
  type: 'image' | 'video'
  status: MediaUploadStatus
  progress: UploadProgress
  error: string | null
  mediaId: string | null  // Backend ID after request-upload
  mediaItem: MediaItem | null  // Full item after confirmation
}
```

### useSchedulerPosts - Calendar Post Organization
```typescript
import { useSchedulerPosts } from '@/hooks/useSchedulerPosts'

const {
  posts,
  postsByDate,           // Map<string, PostResponse[]> - O(1) lookup by date
  isLoading,
  error,
  refetch,
} = useSchedulerPosts({ start: Date, end: Date })
```

### useTheme - Dark/Light Mode
```typescript
import { useTheme, useThemeContext } from '@/hooks/useTheme'

// Standalone hook (no provider needed)
const { theme, resolvedTheme, setTheme, toggleTheme, isDark, isLight, isSystem } = useTheme()

// Context hook (requires ThemeProvider)
const { theme, resolvedTheme, setTheme, toggleTheme, isDark, isLight, isSystem } = useThemeContext()
```

---

## Services (API Layer)

### Connections Service
```typescript
import {
  getConnections,
  getConnectUrl,
  disconnectConnection,
  refreshConnection,
  selectFacebookPage,
  getPendingFacebookPages,
} from '@/services/connections.service'

// Endpoints
GET  /api/connections
GET  /api/connections/{platform}/connect  // OAuth redirect URL
DELETE /api/connections/{id}
POST /api/connections/{id}/refresh
POST /api/oauth/facebook/select-page      // Facebook page selection
GET  /api/oauth/facebook/pages?pendingKey={key}
```

### Posts Service
```typescript
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
} from '@/services/posts.service'

// Endpoints
POST /api/posts
GET  /api/posts?page=1&limit=10&sort=created_at&order=desc
GET  /api/posts/{id}
DELETE /api/posts/{id}
```

### Media Service
```typescript
import {
  requestUpload,
  uploadToS3,
  confirmUpload,
  deleteMedia,
  getMedia,
} from '@/services/media.service'

// Endpoints
POST /api/media/request-upload    // Get presigned URL
POST /api/media/confirm-upload    // Confirm upload complete
GET  /api/media                   // List user's media
GET  /api/media/{id}              // Get single media
DELETE /api/media/{id}            // Delete media
```

---

## S3 Media Upload Flow

The upload works in 3 steps with immediate upload on file selection:

```
┌─────────────┐     1. Request URL      ┌─────────────┐     2. PUT file     ┌─────────────┐
│   Frontend  │ ──────────────────────► │   Backend   │                     │     S3      │
│             │ ◄────────────────────── │             │                     │             │
│             │   uploadUrl, mediaId    │             │                     │             │
│             │ ────────────────────────────────────────────────────────►  │             │
│             │                                                             │             │
│             │     3. Confirm upload   │             │                     │             │
│             │ ──────────────────────► │             │ ◄── HeadObject ──── │             │
│             │ ◄────────────────────── │             │                     │             │
│             │   MediaItem (ready)     │             │                     │             │
└─────────────┘                         └─────────────┘                     └─────────────┘
```

### Upload State Machine
```
pending → requesting → uploading → confirming → ready
    ↓         ↓           ↓           ↓
  error     error       error       error
```

### Usage in CreatePostPage
```typescript
// Files upload immediately when added
const { addFiles, removeFile, retryUpload, getMediaUrls, isUploading, hasErrors } = useMediaUpload()

// Handle file selection
const handleMediaUpload = (files: FileList) => {
  addFiles(files)  // Uploads start immediately
}

// On form submit, include media URLs
const handleSubmit = async () => {
  if (isUploading) {
    toast.error(t('dashboard.createPost.media.validation.uploadsInProgress'))
    return
  }

  const request: CreatePostRequest = {
    caption,
    social_accounts: selectedAccountIds,
    media_urls: getMediaUrls(),  // S3 URLs from completed uploads
  }

  await submitPost(request)
}
```

### Filename Sanitization
Filenames are automatically sanitized before upload:
- Accented characters normalized (é → e)
- Spaces replaced with underscores
- Special characters removed
- Example: `Capture d'écran du 2025.png` → `Capture_d_ecran_du_2025.png`

---

## OAuth Flow (Facebook Two-Step)

Facebook requires page selection after OAuth authorization:

```
1. User clicks "Connect" → opens popup to /api/connections/facebook/connect
2. User authorizes on Facebook
3. Backend redirects to /oauth/callback?success=true&platform=facebook&pendingKey=xxx&pages=[...]
4. OAuthCallback page sends postMessage to parent window
5. Parent shows FacebookPageSelector modal
6. User selects page → POST /api/oauth/facebook/select-page
7. Connection created
```

### OAuthCallback Page (`/oauth/callback`)
Handles OAuth redirects in popup window. URL params:
- `success=true/false`
- `platform=facebook|instagram|...`
- `pendingKey=xxx` (Facebook only)
- `pages=JSON_encoded_array` (Facebook only)
- `error=message` (on failure)

---

## Design System

> **Philosophy:** Linear meets Notion meets Vercel — dark, typographic, confident, quiet.

All components MUST follow these specifications. See `docs/grow-online-design-system.md` for the complete reference.

---

### 1. Color Usage

#### CRITICAL: Never Hardcode Colors
```typescript
// ✅ CORRECT: Use CSS variables via Tailwind
className="bg-bg-base text-text-primary"
className="bg-bg-elevated border-border-default"

// ❌ WRONG: Hardcoded values
className="bg-white text-gray-900"
className="bg-[#FCFCFC] text-[#1a1a1a]"
className="border-[#e0e0e0]"
```

#### Background Tokens
Use backgrounds to create subtle depth, not contrast.

| Token | Tailwind Class | Use Case |
|-------|----------------|----------|
| `--bg-base` | `bg-bg-base` | Page background |
| `--bg-subtle` | `bg-bg-subtle` | Sections, cards on page |
| `--bg-elevated` | `bg-bg-elevated` | Cards, modals, dropdowns |
| `--bg-hover` | `bg-bg-hover` | Hover states |
| `--bg-active` | `bg-bg-active` | Pressed/active states |

#### Text Hierarchy
Create hierarchy through opacity, not size.

| Token | Tailwind Class | Use Case |
|-------|----------------|----------|
| `--text-primary` | `text-text-primary` | Headings, important content |
| `--text-secondary` | `text-text-secondary` | Body text, descriptions |
| `--text-tertiary` | `text-text-tertiary` | Secondary info, metadata |
| `--text-muted` | `text-text-muted` | Placeholders, disabled, hints |

#### Border Tokens
Borders should be barely visible — create separation without demanding attention.

| Token | Use Case |
|-------|----------|
| `--border-default` | Default borders |
| `--border-emphasis` | Hover state borders |
| `--border-focus` | Focus state borders |

#### Semantic Colors
Use ONLY for status and feedback, never for decoration.

```typescript
// ✅ CORRECT: Status feedback
className="bg-success-muted text-success"    // Completed, published
className="bg-warning-muted text-warning"    // Near limit, pending
className="bg-error-muted text-error"        // Failed, over limit
className="bg-info-muted text-info"          // Informational

// ❌ WRONG: Decorative use
className="bg-success/20"  // Don't use for non-status elements
```

#### Platform Colors
Platform colors appear ONLY on platform icons/logos. Never use them for buttons, borders, or backgrounds.

```typescript
// ✅ CORRECT: Platform icon background
<div className="bg-[var(--platform-twitter)]">
  <TwitterIcon />
</div>

// ❌ WRONG: Platform color on button
<Button className="bg-[var(--platform-twitter)]">Post to Twitter</Button>
```

#### Feature Gradient
Use `--gradient-feature` sparingly for the primary CTA ONLY (e.g., "Publish" button). Never use gradients elsewhere.

```typescript
// ✅ CORRECT: Single primary CTA
<Button className="bg-gradient-feature">Publish</Button>

// ❌ WRONG: Gradients on cards, backgrounds, decorations
<div className="bg-gradient-to-br from-primary/10 to-primary/5">...</div>
```

---

### 2. Typography

#### Font Stack
- UI: `var(--font-sans)` — Inter
- Code/counts: `var(--font-mono)` — JetBrains Mono

#### Type Scale
Use ONLY these sizes. Never use arbitrary values like `text-[34px]`.

| Size | Token | Tailwind | Use Case |
|------|-------|----------|----------|
| 48px | `--text-5xl` | `text-5xl` | Large hero headlines |
| 40px | `--text-4xl` | `text-4xl` | Marketing/hero sections |
| 36px | `--text-3xl` | `text-3xl` | Page titles |
| 28px | `--text-2xl` | `text-2xl` | Section headings |
| 22px | `--text-xl` | `text-xl` | Card headings |
| 18px | `--text-lg` | `text-lg` | Subheadings |
| 15px | `--text-md` | `text-md` | Large body |
| 14px | `--text-base` | `text-base` | Body text (default) |
| 13px | `--text-sm` | `text-sm` | Secondary text |
| 11px | `--text-xs` | `text-xs` | Captions, labels |

#### Heading Style
```typescript
// All headings use:
className="font-semibold tracking-tight text-text-primary"
// font-weight: 600, letter-spacing: -0.5px
```

#### Body Style
```typescript
className="font-normal leading-relaxed text-text-secondary"
// font-weight: 400, line-height: 1.65
```

#### Labels/Captions
```typescript
className="text-xs font-medium uppercase tracking-wider text-text-muted"
// 11px, weight 500, uppercase, letter-spacing: 1px
```

---

### 3. Spacing

Use the spacing scale consistently. NEVER use arbitrary values like `p-[17px]`.

| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| `--space-1` | 4px | `p-1`, `gap-1` | Tight gaps (icon + text) |
| `--space-2` | 8px | `p-2`, `gap-2` | Related elements |
| `--space-3` | 12px | `p-3`, `gap-3` | Component internal padding |
| `--space-4` | 16px | `p-4`, `gap-4` | Default padding |
| `--space-5` | 20px | `p-5`, `gap-5` | Card padding |
| `--space-6` | 24px | `p-6`, `gap-6` | Section padding |
| `--space-8` | 32px | `p-8`, `gap-8` | Large gaps |
| `--space-12` | 48px | `p-12`, `gap-12` | Section margins |
| `--space-16` | 64px | `p-16`, `gap-16` | Page sections |

---

### 4. Border Radius

Use ONLY these values. Never exceed 16px except for pills and avatars.

| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| `--radius-sm` | 4px | `rounded-sm` | Small elements, badges |
| `--radius-md` | 6px | `rounded-md` | Inputs, small buttons |
| `--radius-lg` | 8px | `rounded-lg` | Buttons, cards |
| `--radius-xl` | 12px | `rounded-xl` | Large cards, dropdowns |
| `--radius-2xl` | 16px | `rounded-2xl` | Modals, containers |
| `--radius-full` | 9999px | `rounded-full` | Pills, avatars ONLY |

```typescript
// ✅ CORRECT
className="rounded-lg"    // 8px for buttons
className="rounded-xl"    // 12px for cards
className="rounded-full"  // Pills and avatars only

// ❌ WRONG
className="rounded-[19px]"  // Arbitrary value
className="rounded-[5px]"   // Use rounded-sm (4px) instead
```

---

### 5. Motion & Animation

#### Duration Tokens
| Token | Value | Use Case |
|-------|-------|----------|
| `--duration-fast` | 150ms | Hovers, toggles, micro-interactions |
| `--duration-medium` | 250ms | Dropdowns, panels, reveals |
| `--duration-slow` | 400ms | Page transitions, modals |

#### Easing
| Token | Use Case |
|-------|----------|
| `--ease-out` | Primary — most animations |
| `--ease-in-out` | Symmetrical transitions |
| `--ease-spring` | Subtle bounce (use sparingly) |

#### What to Animate
✓ Hover states (opacity, background, transform)
✓ Focus states (border)
✓ Dropdowns and popovers
✓ Skeleton loaders
✓ Toasts appearing/disappearing

#### What NOT to Animate
✗ Text color changes
✗ Layout shifts
✗ Data updates in tables
✗ Form validation states
✗ Anything that delays user action

---

### 6. Icons

#### Source
Use **Lucide** icons exclusively. https://lucide.dev

#### Icon Colors
Icons are **monochrome only**.
- Active: `text-text-primary`
- Inactive: `text-text-muted`
- Hover: transition from muted to primary

**Never use colored icons except for platform logos.**

#### Icon Sizes
| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| `--icon-sm` | 16px | `h-4 w-4` | Inline with text, badges |
| `--icon-md` | 20px | `h-5 w-5` | Buttons, navigation, toolbars |
| `--icon-lg` | 24px | `h-6 w-6` | Standalone, headers, empty states |

```typescript
// ✅ CORRECT: Standard icon sizes
<Search className="h-5 w-5" />  // 20px for buttons
<User className="h-6 w-6" />    // 24px for headers

// ❌ WRONG: Arbitrary sizes
<Icon className="h-[18px] w-[18px]" />  // Use h-4 w-4 (16px) or h-5 w-5 (20px)
```

#### NO EMOJIS
**Emojis are FORBIDDEN in the UI.** They look unprofessional and render inconsistently. Use Lucide icons for all interface elements.

---

### 7. Loading States (Skeletons)

**MANDATORY:** Skeletons must match the exact layout dimensions of the content they replace. Zero layout shift when content loads.

```typescript
// If content has a 40px avatar → skeleton has 40px circle
// If text is 14px → skeleton line matches that height
// Skeleton IS the layout, just without content
```

---

### 8. Responsive Breakpoints

| Name | Min Width | Target |
|------|-----------|--------|
| Mobile | 0px | Phones |
| Tablet | 480px | Large phones, small tablets |
| Desktop | 768px | Tablets, small laptops |
| Wide | 1024px | Laptops, desktops |
| Ultra | 1280px | Large screens |

#### Touch Targets
Minimum 44x44px touch area on mobile, even if visual element is smaller.

---

### 9. Theme Provider

```typescript
import { ThemeProvider } from '@/components/providers/ThemeProvider'

<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>

// Usage in components
import { useThemeContext } from '@/hooks/useTheme'

function MyComponent() {
  const { theme, setTheme, isDark, toggleTheme } = useThemeContext()
}
```

---

### 10. Design System Do/Don't Summary

#### DO
- Use CSS variables for all colors (`bg-bg-elevated`, `text-text-primary`)
- Create hierarchy through text opacity, not size
- Use standard spacing scale (4, 8, 12, 16, 20, 24, 32, 48, 64px)
- Use standard border-radius (4, 6, 8, 12, 16px, or full for pills)
- Keep animations fast and subtle (150ms default)
- Use Lucide icons, monochrome only
- Match skeleton to content dimensions exactly

#### DON'T
- Hardcode color values (`#fff`, `rgb()`, `bg-white`, `text-gray-500`)
- Use arbitrary spacing (`p-[17px]`, `gap-[22px]`)
- Use arbitrary border-radius (`rounded-[19px]`, `rounded-[5px]`)
- Use gradients (except single feature CTA)
- Use emojis anywhere
- Use border-radius > 16px (except pills/avatars)
- Let platform colors bleed into UI elements
- Create layout shift on load
- Use shadows in dark theme

---

## Dashboard Components

### Shared Components
```typescript
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'

// PageHeader - consistent page titles
<PageHeader
  titleKey="dashboard.accounts.title"
  descriptionKey="dashboard.accounts.description"
  actions={<Button>Action</Button>}
/>

// DashboardCard - themed card with optional title
<DashboardCard titleKey="dashboard.settings.profile.title">
  {/* content */}
</DashboardCard>

// EmptyState - when no data exists
<EmptyState
  icon={<CalendarDays className="h-6 w-6" />}
  titleKey="dashboard.scheduler.empty.title"
  descriptionKey="dashboard.scheduler.empty.description"
  ctaKey="dashboard.scheduler.empty.cta"
  onCtaClick={handleCreate}
/>
```

### Platform Icon
```typescript
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'

<PlatformIcon
  platform="facebook"       // SocialPlatform
  size="md"                 // 'xs' | 'sm' | 'md' | 'lg'
  showBackground={true}     // Show colored background
/>
```

### Media Uploader
```typescript
import { MediaUploader, type MediaFile } from '@/components/dashboard/create-post'

<MediaUploader
  media={media}                    // MediaFile[]
  onUpload={handleMediaUpload}     // (files: FileList) => void
  onRemove={handleMediaRemove}     // (id: string) => void
  onRetry={handleRetry}            // (id: string) => void
  onCancelUpload={handleCancel}    // (id: string) => void
  isMediaRequired={isMediaRequired}
  maxFiles={10}
/>

// MediaFile includes upload state:
interface MediaFile {
  id: string
  file: File
  url: string                      // Object URL for preview
  type: 'image' | 'video'
  uploadStatus?: MediaUploadStatus
  uploadProgress?: number          // 0-100
  uploadError?: string | null
  mediaId?: string | null          // Backend ID
  remoteUrl?: string | null        // S3 URL
}
```

### Account Components
```typescript
import {
  PlatformRow,
  AccountBadge,
  ConnectPlatformModal,
  FacebookPageSelector,
} from '@/components/dashboard/accounts'
```

---

## Internationalization (i18n) - CRITICAL

### ⚠️ ABSOLUTE RULE: NO HARDCODED TEXT
**Every piece of user-facing text MUST be translated. Zero exceptions.**

### Core Principles
1. **Translation keys, not text** - Components accept `*Key` props, never raw text
2. **Leaf-level translation** - The `useTranslation()` hook is called at the component that renders text
3. **Namespaced keys** - Organize translations by feature/domain

### Component Patterns
```typescript
// ✅ CORRECT: Props use *Key suffix
interface CardProps {
  titleKey?: string;
  descriptionKey?: string;
}

export function Card({ titleKey, descriptionKey }: CardProps) {
  const { t } = useTranslation();
  return (
    <div>
      {titleKey && <h3>{t(titleKey)}</h3>}
      {descriptionKey && <p>{t(descriptionKey)}</p>}
    </div>
  );
}

// ❌ WRONG: Hardcoded text or raw text props
<Button>Save</Button>
<Card title="Settings" />
```

### Translation Key Structure
```json
{
  "dashboard": {
    "accounts": {
      "title": "Accounts",
      "platforms": {
        "youtube": "YouTube",
        "facebook": "Facebook"
      }
    },
    "createPost": {
      "media": {
        "upload": {
          "uploading": "Uploading...",
          "failed": "Upload failed",
          "retry": "Retry",
          "cancel": "Cancel",
          "progress": "{{percentage}}%"
        },
        "errors": {
          "invalidType": "Only image and video files are allowed",
          "imageTooLarge": "Image exceeds {{maxSize}}MB limit",
          "videoTooLarge": "Video exceeds {{maxSize}}MB limit"
        },
        "validation": {
          "uploadsInProgress": "Please wait for uploads to complete",
          "uploadsFailed": "Some uploads failed. Please retry or remove them."
        }
      }
    }
  },
  "common": {
    "actions": { "save": "Save", "cancel": "Cancel" },
    "errors": { "connectionFailed": "Connection failed" }
  }
}
```

---

## Routing Structure

```
/ → Redirect to /en
/:lang/ → LanguageLayout
  ├── / → Landing (public)
  ├── /signup, /login → Auth (public-only)
  ├── /blog, /blog/:slug → Blog (public)
  ├── /terms, /privacy, /cookies → Legal (public)
  ├── /platforms, /free-tools → Marketing (public)
  │
  └── /dashboard → Protected (requires auth)
      ├── / → DashboardOverview
      ├── /posts → PostsPage
      ├── /posts/create → CreatePostPage
      ├── /scheduler → SchedulerPage
      ├── /accounts → AccountsPage
      └── /settings → SettingsPage

/oauth/callback → OAuthCallback (no language prefix)
```

---

## Code Organization Checklist

### Before Committing
- [ ] Components are under 100 lines
- [ ] All props have TypeScript interfaces
- [ ] **ALL TEXT USES TRANSLATION KEYS** (zero hardcoded text)
- [ ] Props use `*Key` naming for translation keys

### Design System Compliance
- [ ] Colors use CSS variable tokens (`bg-bg-elevated`, `text-text-primary`)
- [ ] No hardcoded colors (`#fff`, `rgb()`, `bg-white`, `text-gray-500`)
- [ ] Spacing uses standard scale (no `p-[17px]` or `gap-[22px]`)
- [ ] Border-radius uses standard tokens (no `rounded-[19px]`)
- [ ] Icon sizes use standard tokens (`h-4 w-4`, `h-5 w-5`, `h-6 w-6`)
- [ ] No emojis in UI
- [ ] No gradients except single feature CTA
- [ ] Platform colors only on platform icons
- [ ] Dark mode works correctly (test with theme toggle)

### Component Quality
- [ ] Single responsibility - does one thing well
- [ ] Reusable - not overly coupled to specific use case
- [ ] Theme-aware - works in light and dark mode
- [ ] Accessible - keyboard navigation and screen reader support
- [ ] Mobile-first responsive design implemented
- [ ] 44px minimum touch targets on mobile
- [ ] Loading and error states handled
- [ ] Skeletons match content dimensions exactly
- [ ] No console.logs or debugging code

---

## Anti-Patterns to Avoid

### Colors & Styling
❌ Hardcoded colors (`bg-white`, `text-gray-500`, `#F7F7F7`, `rgb()`, `hsl()`)
❌ Arbitrary spacing (`p-[17px]`, `m-[22px]`, `gap-[13px]`)
❌ Arbitrary border-radius (`rounded-[19px]`, `rounded-[5px]`)
❌ Arbitrary icon sizes (`h-[18px] w-[18px]`)
❌ Gradients for decoration (only allowed on single feature CTA)
❌ Platform colors on buttons, borders, or backgrounds
❌ Shadows in dark theme
❌ Emojis anywhere in the UI

### Code Quality
❌ Hardcoded text anywhere - use translation keys
❌ Props named `label`, `title`, `text` - use `labelKey`, `titleKey`, `textKey`
❌ Prop drilling more than 2 levels - use Context
❌ Massive components - split into smaller pieces
❌ Inline styles - use Tailwind classes
❌ Missing key props in lists
❌ Ignoring TypeScript errors with `@ts-ignore`
❌ Mixing components and non-components in same file (breaks fast refresh)
❌ Layout shift on content load (skeletons must match dimensions)

---

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Vite Guide](https://vitejs.dev/guide)

---

**Remember**:
- Follow the design system strictly — no hardcoded colors, spacing, or border-radius
- Use CSS variable tokens for all visual properties
- No emojis, no gradients (except feature CTA), no shadows in dark mode
- All text must use translation keys
- Write code that works beautifully in both light and dark mode!
