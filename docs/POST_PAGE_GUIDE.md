# Create Post Page — Implementation Guide

> **For Claude Code**: This document specifies exactly how to build the Create Post feature for Grow Online. Follow each section in order. Reference the design system for tokens and components.

---

## Overview

The Create Post page has **two distinct flows** based on user intent:

1. **Text-First Flow** → For Twitter, LinkedIn, Threads (text is primary, media optional)
2. **Media-First Flow** → For Instagram, TikTok, YouTube Shorts (media is primary, caption secondary)

Users choose their flow from the dashboard via two entry cards. Each flow is optimized for its use case.

---

## File Structure

```
src/
├── pages/
│   └── create/
│       ├── index.tsx              # Entry point with flow selection
│       ├── text/
│       │   └── index.tsx          # Text-first flow page
│       └── media/
│           └── index.tsx          # Media-first flow page
├── components/
│   └── create/
│       ├── FlowSelector.tsx       # Dashboard entry cards
│       ├── text/
│       │   ├── TextComposer.tsx   # Main textarea component
│       │   ├── PlatformSelector.tsx
│       │   ├── CharacterCounts.tsx
│       │   ├── ContentWarnings.tsx
│       │   └── SchedulePicker.tsx
│       ├── media/
│       │   ├── MediaDropZone.tsx
│       │   ├── MediaPreview.tsx
│       │   ├── PhoneFrame.tsx
│       │   ├── AspectRatioSelector.tsx
│       │   ├── CaptionInput.tsx
│       │   ├── PlatformToggles.tsx
│       │   └── MediaOptions.tsx
│       └── shared/
│           ├── TopBar.tsx
│           ├── PublishButton.tsx
│           └── AIShortenButton.tsx
├── hooks/
│   └── create/
│       ├── usePostContent.ts      # Content state management
│       ├── usePlatformValidation.ts
│       ├── useMediaUpload.ts
│       └── usePublish.ts
└── types/
    └── create.ts                  # TypeScript interfaces
```

---

## Types & Interfaces

```typescript
// src/types/create.ts

export type Platform = 
  | 'twitter' 
  | 'linkedin' 
  | 'instagram' 
  | 'tiktok' 
  | 'youtube' 
  | 'facebook' 
  | 'pinterest'
  | 'threads';

export type PostType = 'text' | 'media';

export type AspectRatio = '9:16' | '1:1' | '4:5' | '16:9';

export type MediaType = 'image' | 'video';

export interface MediaFile {
  id: string;
  file: File;
  url: string;           // Object URL for preview
  type: MediaType;
  duration?: number;     // For videos, in seconds
  aspectRatio: AspectRatio;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;          // Lucide icon name
  color: string;         // For platform icon background
  maxChars: number;
  supportsMedia: boolean;
  supportsVideo: boolean;
  maxVideoDuration?: number;  // In seconds
  aspectRatios?: AspectRatio[];
}

export interface PostContent {
  text: string;
  media: MediaFile[];
  selectedPlatforms: Platform[];
  scheduledFor: Date | null;  // null = post now
}

export interface PlatformValidation {
  platform: Platform;
  isValid: boolean;
  charCount: number;
  maxChars: number;
  errors: string[];
  warnings: string[];
}
```

---

## Platform Configuration

```typescript
// src/config/platforms.ts

import { PlatformConfig } from '@/types/create';

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    icon: 'twitter',  // Note: Use custom X icon or text "𝕏"
    color: '#1d9bf0',
    maxChars: 280,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 140,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0a66c2',
    maxChars: 3000,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 600,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: '#e4405f',
    maxChars: 2200,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 90,
    aspectRatios: ['1:1', '4:5', '9:16'],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'music',  // Or custom TikTok icon
    color: '#010101',
    maxChars: 2200,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 180,
    aspectRatios: ['9:16'],
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Shorts',
    icon: 'youtube',
    color: '#ff0000',
    maxChars: 100,  // Title limit
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 60,
    aspectRatios: ['9:16'],
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    icon: 'at-sign',
    color: '#000000',
    maxChars: 500,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 300,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877f2',
    maxChars: 63206,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 240,
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'pin',  // Or custom
    color: '#bd081c',
    maxChars: 500,
    supportsMedia: true,
    supportsVideo: true,
    maxVideoDuration: 60,
    aspectRatios: ['2:3', '1:1'],
  },
};

// Grouped by flow type
export const TEXT_FIRST_PLATFORMS: Platform[] = ['twitter', 'linkedin', 'threads'];
export const MEDIA_FIRST_PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'pinterest'];
```

---

## Component Specifications

### 1. Flow Selector (Dashboard Entry)

**Location**: Dashboard or `/create` index page

**Layout**:
- Two cards side by side (stack on mobile)
- Left: "Share Media" (featured, purple gradient border)
- Right: "Write a Post"

**Behavior**:
- Click navigates to respective flow
- Show connected platform icons on each card

```tsx
// Component structure
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
  <FlowCard
    type="media"
    title="Share Media"
    description="Post a video or photo"
    icon={<Image />}  // Lucide
    platforms={['instagram', 'tiktok', 'youtube']}
    featured={true}
    href="/create/media"
  />
  <FlowCard
    type="text"
    title="Write a Post"
    description="Text-first content"
    icon={<FileText />}  // Lucide
    platforms={['twitter', 'linkedin', 'threads']}
    href="/create/text"
  />
</div>
```

---

### 2. Text-First Flow

**Route**: `/create/text`

**Three-Step Progressive Flow**:

#### Step 1: Write
- Full-width textarea, centered, max-width 560px
- Placeholder: "What's on your mind?"
- Subtle character counts at bottom showing all platform limits
- Toolbar below: media attachment, emoji (open picker), AI enhance
- "Continue" button in top bar (disabled until content exists)

#### Step 2: Choose Platforms
- Show after clicking "Continue"
- Platform pills/cards in a grid
- Each shows: icon, name, account handle
- Inline validation:
  - Green check if content fits
  - Orange warning with char count if over limit
  - "Shorten with AI" button appears when over limit

#### Step 3: Schedule
- Three options as cards:
  - "Post Now" (with Zap icon)
  - "Best Time" (with Sparkles icon) — AI picks optimal time
  - "Schedule" (with Calendar icon) — opens date/time picker
- Publish button at bottom

**State Management**:
```typescript
interface TextFlowState {
  step: 1 | 2 | 3;
  content: string;
  media: MediaFile[];
  selectedPlatforms: Platform[];
  schedule: 'now' | 'best' | Date;
}
```

---

### 3. Media-First Flow

**Route**: `/create/media`

**Single-Screen Layout** (no steps):

#### Left Panel (60%): Media Preview
- Phone frame mockup showing content as it will appear
- Drop zone when empty: "Drop video or photo" with Upload icon
- When filled: actual media preview with overlay controls
- Below phone: aspect ratio selector (9:16, 1:1, 4:5)

#### Right Panel (40%): Details
- **Platform toggles**: Which platforms to post to
- **Caption input**: Smaller textarea, 100px height
- **Options section**: 
  - Sound selection (for TikTok/Reels)
  - Location
  - Platform-specific toggles (Allow Duets, etc.)
- **Schedule bar**: Tap to change between Now/Best Time/Schedule
- **Publish button**: Full width at bottom

**Mobile Layout**:
- Stack vertically
- Media preview takes top half
- Details in scrollable bottom sheet

---

## Key Components Detail

### TextComposer

```tsx
interface TextComposerProps {
  value: string;
  onChange: (value: string) => void;
  onMediaAdd: (files: File[]) => void;
  media: MediaFile[];
  onMediaRemove: (id: string) => void;
  platforms: Platform[];  // For character count display
  autoFocus?: boolean;
}
```

**Features**:
- Auto-resize textarea (grows with content)
- Drag-and-drop media support
- Paste image support
- Character counts update in real-time
- Subtle, non-intrusive design

**Styling**:
```css
/* Textarea */
background: transparent;
border: none;
font-size: var(--text-lg);  /* 18px for comfortable writing */
line-height: var(--leading-relaxed);
color: var(--text-primary);
resize: none;

/* Placeholder */
color: var(--text-muted);

/* Focus */
outline: none;
```

---

### CharacterCounts

```tsx
interface CharacterCountsProps {
  content: string;
  platforms: Platform[];  // Show counts for these platforms
}
```

**Display**:
- Horizontal row of platform icons with counts
- Format: `[icon] 89/280`
- Colors:
  - Default: `var(--text-muted)`
  - Warning (80%+): `var(--warning)`
  - Error (over limit): `var(--error)`

---

### PlatformSelector

```tsx
interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  contentLength: number;
  availablePlatforms?: Platform[];  // Filter which to show
}
```

**Platform Card States**:
- Default: border-default, icon muted
- Hover: border-emphasis, bg-hover
- Selected: border-primary (white/black), icon primary
- Error: border-error (subtle), show warning message

---

### MediaDropZone

```tsx
interface MediaDropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;  // MIME types
  maxSize?: number; // In bytes
  maxFiles?: number;
}
```

**States**:
- Empty: Show upload icon + text
- Drag over: border-emphasis, bg-hover, scale(1.02)
- Uploading: Show progress
- Error: Show error message

---

### PhoneFrame

```tsx
interface PhoneFrameProps {
  children: React.ReactNode;
  aspectRatio: AspectRatio;
}
```

**Design**:
- Dark rounded rectangle simulating phone
- Notch at top (optional, subtle)
- Content fills the "screen" area
- Realistic but not distracting

---

### AIShortenButton

```tsx
interface AIShortenButtonProps {
  content: string;
  targetLength: number;
  onResult: (shortened: string) => void;
  platform: Platform;
}
```

**Behavior**:
- Only appears when content exceeds platform limit
- Shows sparkles icon + "Shorten"
- Loading state while AI processes
- Replaces content on success
- Option to undo (keep previous in state)

---

## State Management Hook

```typescript
// src/hooks/create/usePostContent.ts

interface UsePostContentReturn {
  // Content
  content: string;
  setContent: (content: string) => void;
  
  // Media
  media: MediaFile[];
  addMedia: (files: File[]) => Promise<void>;
  removeMedia: (id: string) => void;
  
  // Platforms
  selectedPlatforms: Platform[];
  togglePlatform: (platform: Platform) => void;
  
  // Validation
  validations: PlatformValidation[];
  isValid: boolean;
  
  // Schedule
  schedule: 'now' | 'best' | Date;
  setSchedule: (schedule: 'now' | 'best' | Date) => void;
  
  // Actions
  publish: () => Promise<void>;
  saveDraft: () => Promise<void>;
  reset: () => void;
  
  // Status
  isPublishing: boolean;
  error: string | null;
}
```

---

## Validation Logic

```typescript
// src/hooks/create/usePlatformValidation.ts

function validateForPlatform(
  content: string, 
  media: MediaFile[], 
  platform: Platform
): PlatformValidation {
  const config = PLATFORMS[platform];
  const charCount = content.length;
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Character limit
  if (charCount > config.maxChars) {
    errors.push(`${charCount - config.maxChars} characters over limit`);
  } else if (charCount > config.maxChars * 0.9) {
    warnings.push(`${config.maxChars - charCount} characters remaining`);
  }
  
  // Media validation
  if (media.length > 0) {
    const video = media.find(m => m.type === 'video');
    if (video && config.maxVideoDuration && video.duration) {
      if (video.duration > config.maxVideoDuration) {
        errors.push(`Video exceeds ${config.maxVideoDuration}s limit`);
      }
    }
    
    // Aspect ratio check
    if (config.aspectRatios && media[0]) {
      if (!config.aspectRatios.includes(media[0].aspectRatio)) {
        warnings.push(`Recommended: ${config.aspectRatios.join(' or ')}`);
      }
    }
  }
  
  return {
    platform,
    isValid: errors.length === 0,
    charCount,
    maxChars: config.maxChars,
    errors,
    warnings,
  };
}
```

---

## Animation Specifications

Use design system motion tokens:

```typescript
// Transitions
const transitions = {
  // Step changes in text flow
  stepChange: 'all var(--duration-medium) var(--ease-out)',
  
  // Platform selection
  platformToggle: 'all var(--duration-fast) var(--ease-out)',
  
  // Dropdown/panels
  panelReveal: 'all var(--duration-medium) var(--ease-out)',
  
  // Button hover
  buttonHover: 'all var(--duration-fast) var(--ease-out)',
  
  // Media preview
  mediaLoad: 'opacity var(--duration-medium) var(--ease-out)',
};

// Step transition animation
const stepVariants = {
  enter: { opacity: 0, y: 8 },
  active: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Enter` | Publish (when valid) |
| `Cmd/Ctrl + K` | Quick actions menu |
| `Cmd/Ctrl + S` | Save draft |
| `Escape` | Go back / Close modal |
| `Tab` | Navigate between sections |

---

## Error Handling

**Scenarios**:
1. **Network error during publish**: Show toast, keep content, offer retry
2. **Platform auth expired**: Show inline message, link to reconnect
3. **Media upload failed**: Show error on specific media, allow retry/remove
4. **Validation errors**: Inline on platform cards, block publish

**Error Toast Pattern**:
```tsx
<Toast variant="error">
  <AlertCircle className="w-4 h-4" />
  <span>Failed to publish to Twitter. <button>Retry</button></span>
</Toast>
```

---

## Success Flow

After successful publish:
1. Show success toast with platform icons
2. Offer actions: "View Post" | "Create Another"
3. Clear form or redirect to dashboard

---

## Mobile Considerations

- Bottom sheet for schedule picker
- Full-screen media preview
- Sticky publish button at bottom
- Swipe gestures for step navigation (text flow)
- 44px minimum touch targets throughout

---

## Testing Checklist

- [ ] Text flow: Can write and publish text-only post
- [ ] Text flow: Character counts update correctly
- [ ] Text flow: Platform validation shows errors/warnings
- [ ] Text flow: AI shorten works and can undo
- [ ] Media flow: Can drag and drop media
- [ ] Media flow: Aspect ratio changes preview
- [ ] Media flow: Caption is optional
- [ ] Both: Can schedule for later
- [ ] Both: Can save as draft
- [ ] Both: Keyboard shortcuts work
- [ ] Both: Mobile responsive
- [ ] Both: Loading states display correctly
- [ ] Both: Error handling works
- [ ] Both: Dark/light theme compatible