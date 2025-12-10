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

## Theming System

### Dark/Light Mode Support
The app uses CSS custom properties with a `.dark` class-based theme system.

#### Theme Provider
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

### Color Tokens

**CRITICAL: Never use hardcoded colors. Always use semantic tokens.**

```typescript
// ✅ DO: Use semantic color tokens
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"
className="text-muted-foreground"

// ❌ AVOID: Hardcoded colors
className="bg-white text-gray-900"
className="bg-[#FCFCFC] text-[#1a1a1a]"
```

#### Available Color Tokens
| Token | Usage |
|-------|-------|
| `background` | Page backgrounds |
| `foreground` | Primary text |
| `card` | Card backgrounds |
| `primary` | Primary actions, links |
| `secondary` | Secondary elements |
| `muted` | Disabled states |
| `muted-foreground` | Secondary text |
| `accent` | Hover states |
| `destructive` | Errors, delete actions |
| `success` | Success states |
| `warning` | Warnings |
| `info` | Information |
| `border` / `border-subtle` | Borders |
| `surface` / `surface-elevated` | Surface layers |

#### Status Colors Pattern
```typescript
className="bg-success/10 text-success"       // Success
className="bg-destructive/10 text-destructive" // Error
className="bg-warning/10 text-warning"       // Warning
className="bg-info/10 text-info"             // Info
className="bg-muted text-muted-foreground"   // Neutral/draft
```

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
- [ ] Colors use CSS variable tokens, not hardcoded values
- [ ] Dark mode works correctly (test with theme toggle)
- [ ] Mobile-first responsive design implemented
- [ ] Accessibility attributes added (ARIA, semantic HTML)
- [ ] Loading and error states handled
- [ ] No console.logs or debugging code
- [ ] **ALL TEXT USES TRANSLATION KEYS** (zero hardcoded text)
- [ ] Props use `*Key` naming for translation keys

### Component Quality
- [ ] Single responsibility - does one thing well
- [ ] Reusable - not overly coupled to specific use case
- [ ] Theme-aware - works in light and dark mode
- [ ] Accessible - keyboard navigation and screen reader support

---

## Anti-Patterns to Avoid

❌ Hardcoded colors (`bg-white`, `text-gray-500`, `#F7F7F7`)
❌ Hardcoded text anywhere - use translation keys
❌ Props named `label`, `title`, `text` - use `labelKey`, `titleKey`, `textKey`
❌ Prop drilling more than 2 levels - use Context
❌ Massive components - split into smaller pieces
❌ Inline styles - use Tailwind classes
❌ Missing key props in lists
❌ Ignoring TypeScript errors with `@ts-ignore`
❌ Mixing components and non-components in same file (breaks fast refresh)

---

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Vite Guide](https://vitejs.dev/guide)

---

**Remember**: Write code that works beautifully in both light and dark mode, is fully translated, and is easy to maintain!
