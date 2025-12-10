# Implementation Plan: Create Campaign Redesign

## Overview

This plan transforms the current "Create Post" page into a "Create Campaign" experience with a three-panel architecture. The redesign shifts from a platform-centric to a content-centric approach.

**Current State:** Three-column layout (platform selector | composer | preview)
**Target State:** Three-panel architecture (media assets | platform cards grid | shared settings)

---

## Chunk 1: Foundation & Types
**Goal:** Set up the new type system and campaign state management

### 1.1 New Types (`src/types/campaign.ts`)
```typescript
// Core campaign types
interface CampaignState
interface PlatformVariation
interface MediaAsset

// Platform card types
interface PlatformCardProps
interface PlatformCardState
```

### 1.2 New Hook (`src/hooks/useCampaignState.ts`)
- Campaign state management (name, masterCaption, schedule, assets, platformVariations)
- Caption sync/unsync logic
- Platform variation CRUD operations
- Auto-sync master caption to linked platforms

### 1.3 Design Tokens (`src/index.css`)
- Add new CSS variables for the premium dark theme
- Transition timing functions
- Shadow definitions

### Files to Create:
- `src/types/campaign.ts`
- `src/hooks/useCampaignState.ts`

### Files to Modify:
- `src/index.css` (add design tokens)

---

## Chunk 2: Left Panel - Media Assets
**Goal:** Build the centralized media library panel

### 2.1 MediaPanel Component (`src/features/create-campaign/components/MediaPanel/`)
- **MediaPanel.tsx** - Container with fixed 240px width
- **DropZone.tsx** - Large drag-and-drop area with premium styling
- **AssetThumbnail.tsx** - Draggable thumbnail with:
  - Video duration badge
  - Hover brightness effect
  - Selection ring
  - Context menu (right-click)
- **AssetGrid.tsx** - 2-column grid layout

### 2.2 Drag & Drop System
- Integrate `@dnd-kit/core` for drag-and-drop
- Asset becomes semi-transparent on drag
- Visual feedback on valid drop targets

### 2.3 Reuse Existing:
- `useMediaUpload` hook (already handles S3 uploads)
- Upload progress visualization

### Files to Create:
- `src/features/create-campaign/components/MediaPanel/MediaPanel.tsx`
- `src/features/create-campaign/components/MediaPanel/DropZone.tsx`
- `src/features/create-campaign/components/MediaPanel/AssetThumbnail.tsx`
- `src/features/create-campaign/components/MediaPanel/AssetGrid.tsx`
- `src/features/create-campaign/components/MediaPanel/index.ts`

### Dependencies to Add:
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

---

## Chunk 3: Center Panel - Platform Cards Grid
**Goal:** Build the platform cards system with independent variations

### 3.1 Platform Card Component (`src/features/create-campaign/components/PlatformCards/`)
- **PlatformCard.tsx** - Main card component with:
  - Header: platform icon, name, inclusion checkbox
  - Media drop zone (accepts drag from left panel)
  - Caption area with sync indicator (🔗/✎)
  - Inline validation warnings
  - Expandable platform-specific settings
- **MediaSlot.tsx** - Drop target for media within card
- **CaptionEditor.tsx** - Synced/custom caption textarea
- **PlatformSettings.tsx** - Collapsible settings section

### 3.2 Card States
- Default (muted, ready for content)
- Has Content (elevated)
- Synced (read-only caption preview)
- Custom (editable caption)
- Excluded (dimmed, collapsed)
- Error (subtle red border)

### 3.3 PlatformCardsGrid Component
- Responsive grid (2-3 columns)
- CSS Grid for equal height rows
- "+ Add Platform" ghost card
- Drop zone highlighting during drag

### Files to Create:
- `src/features/create-campaign/components/PlatformCards/PlatformCardsGrid.tsx`
- `src/features/create-campaign/components/PlatformCards/PlatformCard.tsx`
- `src/features/create-campaign/components/PlatformCards/MediaSlot.tsx`
- `src/features/create-campaign/components/PlatformCards/CaptionEditor.tsx`
- `src/features/create-campaign/components/PlatformCards/PlatformSettings.tsx`
- `src/features/create-campaign/components/PlatformCards/AddPlatformCard.tsx`
- `src/features/create-campaign/components/PlatformCards/index.ts`

---

## Chunk 4: Right Panel - Shared Settings
**Goal:** Build the campaign-level settings panel

### 4.1 SettingsPanel Component (`src/features/create-campaign/components/SettingsPanel/`)
- **SettingsPanel.tsx** - Container with fixed 280px width
- **ScheduleSelector.tsx** - Radio cards (Post Now, Schedule, Save Draft)
  - Elegant card-based selection (not radio buttons)
  - Inline datetime picker for scheduled option
  - "Best time to post" suggestion
- **MasterCaption.tsx** - Source caption textarea
  - Large textarea
  - Character count (most restrictive limit)
  - Sync indicator
- **AiAssist.tsx** - Collapsible AI panel
  - Generate captions button
  - Suggest hashtags
  - Optimize for engagement

### 4.2 Reuse/Adapt:
- Existing `ScheduleOptions` logic (refactor styling)
- Existing calendar/time picker components

### Files to Create:
- `src/features/create-campaign/components/SettingsPanel/SettingsPanel.tsx`
- `src/features/create-campaign/components/SettingsPanel/ScheduleSelector.tsx`
- `src/features/create-campaign/components/SettingsPanel/MasterCaption.tsx`
- `src/features/create-campaign/components/SettingsPanel/AiAssist.tsx`
- `src/features/create-campaign/components/SettingsPanel/PreviewToggle.tsx`
- `src/features/create-campaign/components/SettingsPanel/index.ts`

---

## Chunk 5: Main Page Assembly
**Goal:** Wire everything together in the main page component

### 5.1 CreateCampaignPage Component
- **CreateCampaignPage.tsx** - Main orchestrator
  - Header with campaign name input
  - Three-panel layout
  - Publish action buttons
  - DnD context provider

### 5.2 Header Component
- Campaign name input (editable)
- Publish button group
- Platform count indicator

### 5.3 Integration
- Wire up `useCampaignState` hook
- Connect drag-and-drop between panels
- Handle publish flow

### Files to Create:
- `src/features/create-campaign/CreateCampaignPage.tsx`
- `src/features/create-campaign/components/CampaignHeader.tsx`
- `src/features/create-campaign/index.ts`

### Files to Modify:
- `src/pages/dashboard/CreatePostPage.tsx` → Redirect or replace with new page
- Router configuration to add new route

---

## Chunk 6: Animations & Polish
**Goal:** Add premium micro-interactions and transitions

### 6.1 Entry Animations
- Staggered panel fade-in (left → center → right, 50ms apart)
- Smooth materialization effect

### 6.2 Drag Animations
- Asset lift with subtle shadow on drag start
- Valid drop targets glow softly
- Soft bounce settle on drop (iOS-style)

### 6.3 Caption Sync Animations
- Icon morph (🔗 → ✎)
- Field transition (muted → editable)

### 6.4 Expand/Collapse
- Smooth chevron rotation
- Height animation with `grid-template-rows`

### 6.5 Publish Flow
- Button inline progress
- Per-platform checkmarks
- Success toast/confetti

### Dependencies to Add:
- `framer-motion` (for premium animations)

### Files to Modify:
- All component files (add motion variants)
- `src/index.css` (animation keyframes)

---

## Chunk 7: Responsive Design
**Goal:** Handle all breakpoints gracefully

### 7.1 Breakpoint Behavior
- **≥1280px**: Full three-panel layout
- **1024-1279px**: Right panel as bottom sheet/modal
- **768-1023px**: Left panel as top bar with horizontal scroll
- **<768px**: Single-column stack

### 7.2 Components to Update
- MediaPanel (horizontal scroll mode)
- SettingsPanel (bottom sheet mode)
- PlatformCardsGrid (single column)

### Files to Modify:
- `CreateCampaignPage.tsx` (responsive container)
- All panel components (responsive variants)

---

## Chunk 8: Accessibility & Final Polish
**Goal:** Ensure keyboard accessibility and production readiness

### 8.1 Accessibility
- Keyboard navigation for all interactive elements
- Focus-visible states (elegant rings)
- ARIA labels on icon buttons
- `prefers-reduced-motion` support

### 8.2 Final Polish
- Edge case handling
- Error states refinement
- Loading states
- Empty states

### 8.3 Testing
- Cross-browser testing
- Mobile device testing
- Accessibility audit

### Files to Modify:
- All components (a11y attributes)
- `src/index.css` (reduced motion media query)

---

## Chunk 9: Migration & Cleanup
**Goal:** Replace old implementation and clean up

### 9.1 Route Update
- Update router to use new `CreateCampaignPage`
- Add redirect from old `/posts/create` if needed

### 9.2 Translation Keys
- Add all new i18n keys for campaign UI
- Update existing keys as needed

### 9.3 Cleanup
- Remove deprecated components (if not shared)
- Update imports across codebase
- Remove unused code

### Files to Modify:
- `src/locales/en/translation.json`
- `src/locales/fr/translation.json`
- `src/locales/es/translation.json`
- Router configuration
- Navigation components (update link text)

---

## Implementation Order

```
Chunk 1 (Foundation)
    ↓
Chunk 2 (Media Panel) ←→ Chunk 4 (Settings Panel)
    ↓                         ↓
         Chunk 3 (Platform Cards)
              ↓
         Chunk 5 (Assembly)
              ↓
         Chunk 6 (Animations)
              ↓
         Chunk 7 (Responsive)
              ↓
         Chunk 8 (A11y & Polish)
              ↓
         Chunk 9 (Migration)
```

Chunks 2 and 4 can be developed in parallel.

---

## File Structure Summary

```
src/
├── features/
│   └── create-campaign/
│       ├── CreateCampaignPage.tsx
│       ├── index.ts
│       ├── components/
│       │   ├── CampaignHeader.tsx
│       │   ├── MediaPanel/
│       │   │   ├── MediaPanel.tsx
│       │   │   ├── DropZone.tsx
│       │   │   ├── AssetThumbnail.tsx
│       │   │   ├── AssetGrid.tsx
│       │   │   └── index.ts
│       │   ├── PlatformCards/
│       │   │   ├── PlatformCardsGrid.tsx
│       │   │   ├── PlatformCard.tsx
│       │   │   ├── MediaSlot.tsx
│       │   │   ├── CaptionEditor.tsx
│       │   │   ├── PlatformSettings.tsx
│       │   │   ├── AddPlatformCard.tsx
│       │   │   └── index.ts
│       │   └── SettingsPanel/
│       │       ├── SettingsPanel.tsx
│       │       ├── ScheduleSelector.tsx
│       │       ├── MasterCaption.tsx
│       │       ├── AiAssist.tsx
│       │       ├── PreviewToggle.tsx
│       │       └── index.ts
│       ├── hooks/
│       │   ├── useCampaignState.ts
│       │   └── usePlatformSync.ts
│       ├── types.ts
│       └── constants.ts
├── types/
│   └── campaign.ts
└── index.css (updated with design tokens)
```

---

## Dependencies to Install

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities framer-motion
```

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| DnD complexity | Use @dnd-kit with proven patterns |
| Animation performance | Use framer-motion with GPU-accelerated transforms |
| State sync complexity | Centralized campaign state with clear sync rules |
| Breaking existing flow | Keep old page until new is stable, then swap |
| Mobile experience | Design mobile-first for complex interactions |

---

## Success Metrics

After implementation, users should be able to:
1. ✅ Upload media once, drag to specific platforms
2. ✅ Write one caption that syncs, or customize per platform
3. ✅ See all platform variations at a glance
4. ✅ Understand validation issues inline
5. ✅ Publish multi-platform campaign in under 60 seconds
6. ✅ Experience premium, intentional, smooth UI

---

## Notes

- **Reuse existing hooks:** `useMediaUpload`, `useConnections`, `useCreatePost` are solid and should be reused
- **Preserve backend compatibility:** No backend changes needed; same API contracts
- **Incremental deployment:** Can be feature-flagged if needed
- **Dark mode first:** All styling designed for dark theme, light mode derived
