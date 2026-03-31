# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Grow Online** is a SaaS platform (domain: growonline.now) that helps creators, brands, and companies grow on social media. Features include: unified posting across platforms, analytics, AI-powered content generation, and automations.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check + build (tsc -b && vite build)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
npm run type-check   # TypeScript check only (tsc -b --noEmit)
npm run preview      # Preview production build
```

No test framework is configured.

## Tech Stack

- **Vite 7** + **React 19** + **TypeScript 5.9** (strict mode)
- **Tailwind CSS v4** with CSS custom properties for theming
- **shadcn/ui** (Radix primitives) for UI components
- **react-router-dom v7** with language prefix routes (`/:lang/...`)
- **react-i18next** for all user-facing text
- **better-auth** for authentication (cookie-based sessions)
- **Context API** for global state (no Redux/Zustand in use)

## Environment

Copy `.env.example` to `.env`:
- `VITE_API_URL` — Backend API base URL
- `VITE_APP_URL` — Frontend app URL

Path alias: `@/` maps to `./src/`

## Architecture

### Routing (`src/main.tsx`)

All routes are language-prefixed. Root `/` redirects to `/en`.

- **Public-only routes** (redirect to dashboard if authed): Landing, SignUp, SignIn
- **Public routes**: Blog, Platforms, Free tools, Legal pages
- **Protected routes**: Dashboard (requires auth + workspace)

Route guards: `ProtectedRoute` (auth check), `PublicOnlyRoute` (redirect if authed), `WorkspaceGuard` (ensures workspace context). Dashboard pages are lazy-loaded with `React.lazy()`.

### Data Flow Pattern

```
Page → Custom Hook (useCreatePost, usePosts, etc.)
         → Service (posts.service.ts, etc.)
            → API Client (lib/api-client.ts) → Backend
```

- **Services** (`src/services/`): Pure API wrapper functions, no state
- **Hooks** (`src/hooks/`): Combine API calls + local state for features
- **API Client** (`src/lib/api-client.ts`): Typed fetch wrapper with `credentials: 'include'`, auto-injects `X-Workspace-Id` header, custom `ApiError` class

### Global State (Context API)

- `WorkspaceProvider` — manages workspace selection, membership, injected around dashboard routes
- `ThemeProvider` — light/dark/system theme, persisted to localStorage
- `UpgradePromptContext` — subscription upgrade prompts

### Auth (`src/lib/auth-client.ts`)

Uses `better-auth` client. Exports: `signIn`, `signUp`, `signOut`, `useSession`, `getSession`. OAuth popup flow for social connections via `OAuthCallback` page.

### i18n (`src/i18n.ts`)

Locale files in `src/locales/{en,fr,es}/` split by domain: `common.json`, `dashboard.json`, `landing.json`, `auth.json`, `blog.json`, `platforms.json`, `tools.json`, `legal.json`.

`LanguageLayout` component syncs `/:lang` URL param with i18next.

## Critical Rules

### No Hardcoded Text — Ever

Every piece of user-facing text must use translation keys via `useTranslation()`. Component props that accept translatable text use `*Key` suffix (e.g., `titleKey`, `descriptionKey`).

### No Hardcoded Colors

Always use CSS variable tokens via Tailwind classes:

```tsx
// Correct
className="bg-bg-base text-text-primary border-border-default"
className="bg-bg-elevated bg-bg-hover"

// Wrong
className="bg-white text-gray-900 border-[#e0e0e0]"
```

**Background tokens**: `bg-bg-base` (page), `bg-bg-subtle` (sections), `bg-bg-elevated` (cards/modals), `bg-bg-hover`, `bg-bg-active`

**Text tokens**: `text-text-primary` (headings), `text-text-secondary` (body), `text-text-tertiary` (metadata), `text-text-muted` (placeholders)

**Border tokens**: `border-default`, `border-emphasis`, `border-focus`

**Semantic colors**: `success`, `warning`, `error`, `info` — only for status feedback, never decoration

### Spacing and Radius

Use only the standard Tailwind scale. No arbitrary values like `p-[17px]` or `rounded-[19px]`. Max border-radius is 16px (`rounded-2xl`), except `rounded-full` for pills/avatars.

### Icons

Lucide icons only. Monochrome only (except platform logos). Standard sizes: `h-4 w-4` (16px), `h-5 w-5` (20px), `h-6 w-6` (24px). No emojis anywhere in the UI.

### Platform Colors

Platform colors (e.g., `var(--platform-twitter)`) appear ONLY on platform icons/logos. Never use them for buttons, borders, or backgrounds.

### Gradients

`bg-gradient-feature` is reserved for the single primary CTA only. No other gradients.

### Skeletons

Loading skeletons must match the exact layout dimensions of the content they replace. Zero layout shift on load.

## Key Types

Defined in `src/types/`:

- `SocialPlatform`: `'linkedin' | 'twitter' | 'tiktok' | 'pinterest' | 'instagram' | 'youtube' | 'facebook'`
- `PostStatus`: `'pending' | 'processing' | 'completed' | 'failed'`
- `ScheduleType`: `'now' | 'scheduled' | 'draft'`
- `MediaUploadStatus`: `'pending' | 'requesting' | 'uploading' | 'confirming' | 'ready' | 'error'`

Media upload is a 3-step flow: request presigned URL from backend, PUT to S3, confirm upload with backend.

## Shared Dashboard Components

```tsx
import { PageHeader } from '@/components/dashboard/shared/PageHeader'       // titleKey, descriptionKey, actions
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard' // titleKey + children
import { EmptyState } from '@/components/dashboard/shared/EmptyState'       // icon, titleKey, descriptionKey, ctaKey
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'    // platform, size, showBackground
```

## Design Philosophy

"Linear meets Notion meets Vercel — dark, typographic, confident, quiet."

See `docs/grow-online-design-system.md` for the complete design system reference including motion/animation tokens, responsive breakpoints, and component patterns.
