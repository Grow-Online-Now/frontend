# Create Post Redesign: Campaign Bundle Workflow

## Context

We're redesigning the "Create Post" page for Grow Online, a cross-platform social media management app. The current UI is cramped, unintuitive, and requires too many clicks. We need to shift from a **platform-centric** approach to a **content-centric** approach.

The core insight: creators think "I have this campaign/message to share across platforms, adapted for each" — not "let me pick platforms first, then figure out content."

---

## Design Philosophy

**This UI must feel premium, fluid, and intentional.** Think Notion, Linear, Vercel, or Apple — not a typical SaaS dashboard.

### Non-Negotiables

- **No janky hover states**: No `scale(1.05)` or `translateY(-2px)` on hover. Interactions should be subtle — opacity shifts, soft glows, gentle border color transitions
- **Smooth transitions**: Use `ease-out` or custom bezier curves. Transitions should feel physical, not mechanical. 200-300ms for micro-interactions, 400-500ms for layout shifts
- **Generous whitespace**: Let elements breathe. Cramped UI is dead
- **Subtle depth**: Use soft shadows, not harsh borders. Layer elements with purpose
- **Consistent motion language**: Everything should animate with the same personality — calm, confident, precise
- **Dark mode native**: Design for dark mode first. Rich blacks (#0a0a0a, #111111), not pure black. Subtle gradients for depth

---

## The New Layout: Three-Panel Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Header: "Create Campaign" + Campaign Name Input + [Publish Actions]        │
├────────────────┬─────────────────────────────────────────┬───────────────────┤
│                │                                         │                   │
│  LEFT PANEL    │           CENTER PANEL                  │   RIGHT PANEL     │
│  Media Assets  │        Platform Cards Grid              │  Shared Settings  │
│                │                                         │                   │
│  ┌──────────┐  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │  Schedule         │
│  │ Drop     │  │  │ TikTok  │ │ Insta   │ │ Pinterest│   │  ──────────────   │
│  │ Media    │  │  │         │ │         │ │         │   │  ○ Post Now       │
│  │ Here     │  │  │ [video] │ │ [video] │ │ [image] │   │  ○ Schedule       │
│  └──────────┘  │  │         │ │         │ │         │   │  ○ Save Draft     │
│                │  │ caption │ │ caption │ │ caption │   │                   │
│  Uploaded:     │  │ [sync]  │ │ [sync]  │ │ [custom]│   │  Master Caption   │
│  ┌────┐ ┌────┐ │  │         │ │         │ │         │   │  ──────────────   │
│  │ 🎬 │ │ 📷 │ │  │ ☑ incl. │ │ ☑ incl. │ │ ☑ incl. │   │  [textarea]       │
│  └────┘ └────┘ │  └─────────┘ └─────────┘ └─────────┘   │                   │
│                │                                         │  AI Assist ✨      │
│  ┌────┐ ┌────┐ │  ┌─────────┐ ┌─────────┐               │                   │
│  │ 📷 │ │ 📷 │ │  │ LinkedIn│ │ + Add   │               │  Best Time: 2PM   │
│  └────┘ └────┘ │  │         │ │ Platform│               │                   │
│                │  │ [none]  │ │         │               │  Preview Mode     │
│                │  │ text    │ │         │               │  [Toggle]         │
│                │  │ only    │ │         │               │                   │
│                │  └─────────┘ └─────────┘               │                   │
│                │                                         │                   │
└────────────────┴─────────────────────────────────────────┴───────────────────┘
```

---

## Panel Specifications

### Left Panel: Media Assets (240px fixed width)

**Purpose**: Central media library for this campaign. Upload once, drag to any platform card.

**Components**:
1. **Drop Zone**
   - Large, inviting drop area with dashed border (subtle, 1px, muted color)
   - On drag-over: border becomes solid, subtle glow effect, background lightens slightly
   - Accepts images and videos
   - Shows upload progress with a thin progress bar, not a spinner

2. **Asset Grid**
   - Uploaded media shown as thumbnails in a 2-column grid
   - Video thumbnails show duration badge (bottom-right, small pill)
   - Hover: slight brightness increase, subtle ring appears
   - Click: opens quick preview modal
   - Drag: asset becomes semi-transparent, shows on cursor

**Interactions**:
- Drag asset → drop on platform card → assigns to that platform
- Right-click asset → context menu (delete, preview, duplicate)
- Assets can be used on multiple platform cards

---

### Center Panel: Platform Cards Grid (fluid width, main content area)

**Purpose**: Each connected platform gets a card. Cards are independent variations of the campaign, each with its own media and caption.

**Card Component Structure**:

```
┌─────────────────────────────────────┐
│  [Platform Icon] Platform Name   ☑  │  ← Header: toggle inclusion
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │  ← Media Drop Zone
│  │     [Drag media here]       │   │     or thumbnail preview
│  │     or click to select      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Caption                    🔗 ✎   │  ← 🔗 = synced to master
│  ┌─────────────────────────────┐   │     ✎ = edit/unlink
│  │ Synced caption preview...   │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚠ Platform-specific warnings      │  ← Inline validation
│  ─────────────────────────────────  │
│  📊 Estimated reach: ~2.4k         │  ← Optional: insights
│                                     │
│  [Platform Settings ▾]             │  ← Expandable: hashtags,
│                                     │     first comment, alt text
└─────────────────────────────────────┘
```

**Card States**:
- **Default**: Muted background, ready to receive content
- **Has Content**: Slightly elevated, content visible
- **Synced**: Shows 🔗 icon on caption, caption is read-only preview
- **Custom**: Shows ✎ icon, caption is editable
- **Excluded**: Dimmed, checkbox unchecked, collapsed
- **Error**: Subtle red border or warning icon, never aggressive

**Card Grid Behavior**:
- Cards flow in a responsive grid (2-3 columns depending on viewport)
- Cards have equal height within rows (CSS Grid)
- "+ Add Platform" card at the end, styled as a ghost/dashed card
- Reorderable via drag (optional, nice-to-have)

**Caption Sync Logic**:
- By default, all captions are synced to the Master Caption (right panel)
- Clicking the 🔗 icon "unlinks" that card — caption becomes editable and independent
- Visual indicator shows "Using master caption" vs "Custom caption"
- Unlinking copies current master text as starting point

**Media Per Card**:
- Each card has its own media slot
- Drag from left panel asset library
- Or click to open media picker
- Cards can have: video, image, carousel (platform permitting), or nothing (text-only)
- Show format requirements subtly: "9:16 recommended" for TikTok, etc.

**Validation (Inline, Non-Blocking)**:
- Character count with visual progress bar (turns amber near limit, red at over)
- Media requirements: "Video required for Reels" shown inside media zone
- Warnings are informational, not blocking — user can still attempt to post

---

### Right Panel: Shared Settings (280px fixed width)

**Purpose**: Campaign-level settings that apply to all or provide master content.

**Sections**:

1. **Schedule**
   - Three options as elegant radio cards (not ugly radio buttons):
     - Post Now — icon: ⚡ or send icon
     - Schedule — icon: 📅, reveals datetime picker on select
     - Save as Draft — icon: 📝
   - Datetime picker: clean, inline calendar + time selector
   - "Best time to post" suggestion shown subtly

2. **Master Caption**
   - Large textarea for the "source" caption
   - Character count (shows most restrictive platform's limit)
   - "This caption syncs to all platforms unless customized"
   - AI Assist button: generates/improves caption

3. **AI Assist Panel** (collapsible)
   - "Generate captions" — creates platform-optimized versions
   - "Suggest hashtags" — per platform
   - "Optimize for engagement"

4. **Preview Toggle**
   - Switch between "Edit Mode" and "Preview Mode"
   - Preview Mode shows each platform card as a device mockup

5. **Campaign Notes** (optional, collapsed by default)
   - Internal notes, not published
   - Useful for teams

---

## Interaction Choreography

### Entering the Page
- Panels fade in with subtle stagger (left → center → right, 50ms apart)
- No jarring pop-in, just a gentle materialization

### Dragging Media
- On drag start: asset lifts slightly, subtle shadow appears
- While dragging: platform cards that can accept the media type glow softly
- On hover over valid target: card border highlights, drop zone pulses gently
- On drop: asset settles into place with a soft bounce (not cartoon bounce — think iOS)

### Caption Sync/Unsync
- Clicking 🔗 to unsync: icon morphs to ✎, caption field transitions from muted to editable (border appears, background lightens)
- Re-syncing: modal confirms "Discard custom caption?", then smooth transition back

### Expanding Platform Settings
- Chevron rotates smoothly
- Content expands with height animation (not display toggle)
- Use `grid-template-rows: 0fr → 1fr` trick for smooth expansion

### Publishing
- Primary action button in header: "Publish to X Platforms"
- On click: button shows inline progress, cards show checkmarks as each succeeds
- Success: subtle confetti or a calm "Published" toast, then redirect to posts view

---

## Component Specifications

### Platform Card

```tsx
interface PlatformCardProps {
  platform: 'tiktok' | 'instagram' | 'pinterest' | 'linkedin' | 'twitter' | 'facebook' | 'youtube';
  included: boolean;
  media: MediaAsset | null;
  caption: string;
  isSyncedToMaster: boolean;
  validationWarnings: string[];
  onToggleInclude: () => void;
  onMediaDrop: (asset: MediaAsset) => void;
  onCaptionChange: (caption: string) => void;
  onToggleSync: () => void;
}
```

### Media Asset

```tsx
interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  duration?: number; // seconds, for video
  dimensions: { width: number; height: number };
  filename: string;
}
```

### Campaign State

```tsx
interface CampaignState {
  name: string;
  masterCaption: string;
  schedule: 'now' | 'scheduled' | 'draft';
  scheduledTime?: Date;
  assets: MediaAsset[];
  platformVariations: PlatformVariation[];
}

interface PlatformVariation {
  platform: Platform;
  included: boolean;
  media: MediaAsset | null;
  caption: string;
  isSyncedToMaster: boolean;
  platformSettings: Record<string, any>; // hashtags, first comment, etc.
}
```

---

## Visual Design Tokens

### Colors (Dark Theme)

```css
--bg-base: #0a0a0a;
--bg-subtle: #111111;
--bg-muted: #1a1a1a;
--bg-elevated: #222222;

--border-subtle: #2a2a2a;
--border-muted: #333333;
--border-emphasis: #444444;

--text-primary: #fafafa;
--text-secondary: #a0a0a0;
--text-muted: #666666;

--accent-primary: #3b82f6; /* Blue */
--accent-success: #22c55e;
--accent-warning: #f59e0b;
--accent-error: #ef4444;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
```

### Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */

--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
```

### Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### Transitions

```css
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
--transition-layout: 400ms cubic-bezier(0.16, 1, 0.3, 1);

/* For spring-like animations */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

## Implementation Notes

### Tech Stack Assumptions
- React with TypeScript
- Tailwind CSS for styling (but can be adapted)
- Framer Motion for animations (recommended for the polish level required)
- React DnD or @dnd-kit for drag and drop

### Accessibility
- All interactive elements must be keyboard accessible
- Focus states should be visible but elegant (ring on focus-visible only)
- ARIA labels on icon-only buttons
- Reduced motion: respect `prefers-reduced-motion` — fall back to instant transitions

### Responsive Behavior
- Below 1280px: Right panel collapses to a bottom sheet or modal
- Below 1024px: Left panel becomes a top bar with horizontal scroll
- Below 768px: Full single-column layout, cards stack vertically

---

## File Structure Suggestion

```
src/
  features/
    create-campaign/
      CreateCampaignPage.tsx        # Main page component
      components/
        MediaPanel/
          MediaPanel.tsx
          AssetThumbnail.tsx
          DropZone.tsx
        PlatformCards/
          PlatformCardsGrid.tsx
          PlatformCard.tsx
          CaptionEditor.tsx
          MediaSlot.tsx
          PlatformSettings.tsx
        SettingsPanel/
          SettingsPanel.tsx
          ScheduleSelector.tsx
          MasterCaption.tsx
          AiAssist.tsx
      hooks/
        useCampaignState.ts
        useMediaUpload.ts
        usePlatformSync.ts
      types.ts
      constants.ts
```

---

## Success Criteria

When this redesign is complete, the user should be able to:

1. **Upload media once**, then assign it to specific platforms by dragging
2. **Write one caption** that syncs everywhere, or customize per platform with one click
3. **See all platform variations at a glance** without clicking into tabs
4. **Understand validation issues inline** without modal interruptions
5. **Publish a multi-platform campaign in under 60 seconds** if content is ready
6. **Feel like they're using a premium tool** — every interaction should feel intentional, smooth, and calm

---

## Reference Inspiration

- **Notion**: Calm, spacious, blocks-based thinking
- **Linear**: Keyboard-first, fast, dark mode excellence
- **Vercel Dashboard**: Clean panels, subtle depth
- **Apple Music / Apple TV+**: Smooth transitions, content-forward
- **Framer**: Fluid drag-and-drop, elegant state transitions

---

## Final Note

This is not a reskin — it's a rethink. The goal is to make multi-platform posting feel like one fluid action, not a series of forms. Every pixel should earn its place. When in doubt, remove, don't add.