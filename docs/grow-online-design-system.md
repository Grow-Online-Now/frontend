# Grow Online Design System

> **Philosophy:** Linear meets Notion meets Vercel — dark, typographic, confident, quiet.

This document defines the visual and interaction rules for the Grow Online app. All components must follow these specifications.

---

## 1. Color Usage

### Backgrounds
Use backgrounds to create subtle depth, not contrast.

| Token | Use Case |
|-------|----------|
| `--bg-base` | Page background |
| `--bg-subtle` | Sections, cards on page |
| `--bg-elevated` | Cards, modals, dropdowns |
| `--bg-hover` | Hover states |
| `--bg-active` | Pressed/active states |

### Text Hierarchy
Create hierarchy through opacity, not size.

| Token | Use Case |
|-------|----------|
| `--text-primary` | Headings, important content, primary actions |
| `--text-secondary` | Body text, descriptions |
| `--text-tertiary` | Secondary info, metadata |
| `--text-muted` | Placeholders, disabled, hints |

### Borders
Borders should be barely visible. They create separation without demanding attention.

- Default border: `1px solid var(--border-default)`
- Hover: `var(--border-emphasis)`
- Focus: `var(--border-focus)`

### Semantic Colors
Use ONLY for status and feedback, never for decoration.

| Color | Use Case |
|-------|----------|
| `--success` | Completed, published, fits limit |
| `--warning` | Near limit, pending, attention needed |
| `--error` | Failed, over limit, error states |
| `--info` | Informational messages |

### Platform Colors
Platform colors appear ONLY on platform icons/logos. Never use them for buttons, borders, or backgrounds.

```css
/* Correct */
<div style="background: var(--platform-twitter)">TW</div>

/* Wrong */
<button style="background: var(--platform-twitter)">Post to Twitter</button>
```

### Feature Gradient
Use `--gradient-feature` sparingly for the primary CTA only (e.g., "Publish" button). Never use gradients elsewhere.

---

## 2. Typography

### Font Stack
- UI: `var(--font-sans)` — Inter
- Code/counts: `var(--font-mono)` — JetBrains Mono

### Type Scale

| Size | Token | Use Case |
|------|-------|----------|
| 36px | `--text-3xl` | Page titles |
| 28px | `--text-2xl` | Section headings |
| 22px | `--text-xl` | Card headings |
| 18px | `--text-lg` | Subheadings |
| 15px | `--text-md` | Large body |
| 14px | `--text-base` | Body text (default) |
| 13px | `--text-sm` | Secondary text |
| 11px | `--text-xs` | Captions, labels |

### Heading Style
All headings use:
- `font-weight: 600` (semibold)
- `letter-spacing: -0.5px` (tight tracking)
- `color: var(--text-primary)`

### Body Style
- `font-weight: 400`
- `line-height: 1.65`
- `color: var(--text-secondary)`

### Labels/Captions
- `font-size: 11px`
- `font-weight: 500`
- `text-transform: uppercase`
- `letter-spacing: 1px`
- `color: var(--text-muted)`

---

## 3. Spacing

Use the spacing scale consistently. Never use arbitrary values.

| Token | Value | Use Case |
|-------|-------|----------|
| `--space-1` | 4px | Tight gaps (icon + text) |
| `--space-2` | 8px | Related elements |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Default padding |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section padding |
| `--space-8` | 32px | Large gaps |
| `--space-12` | 48px | Section margins |
| `--space-16` | 64px | Page sections |

### Responsive Spacing

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Page padding | 16px | 24px | 48px |
| Card padding | 16px | 20px | 24px |
| Section gap | 32px | 48px | 64px |

---

## 4. Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-sm` | 4px | Small elements, badges |
| `--radius-md` | 6px | Inputs, small buttons |
| `--radius-lg` | 8px | Buttons, cards |
| `--radius-xl` | 12px | Large cards, dropdowns |
| `--radius-2xl` | 16px | Modals, containers |
| `--radius-full` | 9999px | Pills, avatars |

**Rule:** Never exceed 16px radius except for pills and avatars.

---

## 5. Components

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--accent-primary);
  color: var(--bg-base);
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 500;
  border: none;
  transition: opacity var(--duration-fast) var(--ease-out);
}
.btn-primary:hover {
  opacity: 0.9;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  /* same padding, radius, font as primary */
}
.btn-secondary:hover {
  background: var(--bg-active);
  border-color: var(--border-emphasis);
}
```

**Ghost Button**
```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
}
.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

**Feature Button (Primary CTA only)**
```css
.btn-feature {
  background: var(--gradient-feature);
  color: white;
}
```

**Button Sizes**
- Small: `padding: 6px 12px; font-size: 11px;`
- Default: `padding: 10px 20px; font-size: 13px;`
- Large: `padding: 14px 28px; font-size: 15px;`

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: border-color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}
.input:focus {
  outline: none;
  border-color: var(--border-focus);
  background: var(--bg-hover);
}
.input::placeholder {
  color: var(--text-muted);
}
```

### Cards

```css
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.card-interactive:hover {
  border-color: var(--border-emphasis);
  background: var(--bg-hover);
}
.card-selected {
  border-color: var(--accent-primary);
}
```

### Pills (Platform Selection)

```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 14px;
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
.pill:hover {
  border-color: var(--border-emphasis);
  background: var(--bg-hover);
}
.pill-selected {
  border-color: var(--border-focus);
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

### Toggle

```css
.toggle {
  width: 44px;
  height: 24px;
  background: var(--bg-active);
  border-radius: var(--radius-full);
  position: relative;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}
.toggle::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: left var(--duration-fast) var(--ease-out);
}
.toggle-active {
  background: var(--success);
}
.toggle-active::after {
  left: 23px;
}
```

### Badges

```css
.badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 500;
}
.badge-default {
  background: var(--bg-active);
  color: var(--text-secondary);
}
.badge-success {
  background: var(--success-muted);
  color: var(--success);
}
.badge-warning {
  background: var(--warning-muted);
  color: var(--warning);
}
.badge-error {
  background: var(--error-muted);
  color: var(--error);
}
```

### Alerts

```css
.alert {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
}
.alert-success {
  background: var(--success-muted);
  color: var(--success);
}
.alert-warning {
  background: var(--warning-muted);
  color: var(--warning);
}
.alert-error {
  background: var(--error-muted);
  color: var(--error);
}
```

---

## 6. Motion

### Duration

| Token | Value | Use Case |
|-------|-------|----------|
| `--duration-fast` | 150ms | Hovers, toggles, micro-interactions |
| `--duration-medium` | 250ms | Dropdowns, panels, reveals |
| `--duration-slow` | 400ms | Page transitions, modals |

### Easing

| Token | Value | Use Case |
|-------|-------|----------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary — most animations |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetrical transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Subtle bounce (use sparingly) |

### What to Animate
✓ Hover states (opacity, background, transform)
✓ Focus states (border)
✓ Dropdowns and popovers
✓ Page transitions
✓ Skeleton loaders
✓ Toasts appearing/disappearing

### What NOT to Animate
✗ Text color changes
✗ Layout shifts
✗ Data updates in tables
✗ Form validation states
✗ Anything that delays user action

### Standard Transition
```css
transition: all var(--duration-fast) var(--ease-out);
```

---

## 7. Icons

### Source
Use **Lucide** icons exclusively. https://lucide.dev

### Colors
Icons are **monochrome only**.
- Active: `var(--text-primary)`
- Inactive: `var(--text-muted)`
- Hover: transition from muted to primary

**Never use colored icons except for platform logos.**

### Sizes

| Token | Value | Use Case |
|-------|-------|----------|
| `--icon-sm` | 16px | Inline with text, badges |
| `--icon-md` | 20px | Buttons, navigation, toolbars |
| `--icon-lg` | 24px | Standalone, headers, empty states |

### Icon Button Pattern
```css
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  border: none;
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
.icon-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
```

### Common Icons Reference

| Purpose | Icon Name |
|---------|-----------|
| Add image | `image` |
| Add video | `video` |
| Emoji picker | `smile` |
| AI action | `sparkles` |
| Hashtag | `hash` |
| Mention | `at-sign` |
| Upload | `upload` |
| Calendar | `calendar` |
| Time/clock | `clock` |
| Quick action | `zap` |
| Link | `link` |
| Trim/cut | `scissors` |
| Success | `check` |
| Close | `x` |
| Add | `plus` |
| Back | `arrow-left` |
| Forward | `arrow-right` |
| Expand | `chevron-down` |
| More options | `more-horizontal` |
| Settings | `settings` |
| Search | `search` |
| User | `user` |
| Logout | `log-out` |

### NO EMOJIS
Emojis are forbidden in the UI. They look childish, unprofessional, and render inconsistently across platforms. Use Lucide icons for all interface elements.

---

## 8. Loading States

### Skeleton Rules
**MANDATORY:** Skeletons must match the exact layout dimensions of the content they replace. Zero layout shift when content loads.

- If content has a 40px avatar → skeleton has 40px circle
- If text is 14px → skeleton line matches that height
- Skeleton IS the layout, just without content

### Skeleton Styles
```css
.skeleton {
  background: var(--skeleton-base);
  border-radius: var(--radius-md);
  animation: skeleton-pulse 2s var(--ease-in-out) infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Skeleton Elements
- Avatar: circle matching avatar size
- Text line: rectangle, 12-14px height, varying widths (100%, 75%, 50%)
- Media: rectangle matching media container dimensions
- Button: rectangle matching button dimensions

---

## 9. Responsive Design

### Breakpoints

| Name | Min Width | Target |
|------|-----------|--------|
| Mobile | 0px | Phones |
| Tablet | 480px | Large phones, small tablets |
| Desktop | 768px | Tablets, small laptops |
| Wide | 1024px | Laptops, desktops |
| Ultra | 1280px | Large screens |

### Media Queries
```css
@media (min-width: 480px) { /* Tablet+ */ }
@media (min-width: 768px) { /* Desktop+ */ }
@media (min-width: 1024px) { /* Wide+ */ }
@media (min-width: 1280px) { /* Ultra */ }
```

### Touch Targets
Minimum 44x44px touch area on mobile, even if visual element is smaller.

### Layout Patterns

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Composer + Preview | Stacked | Side by side |
| Platform selection | Vertical list | Horizontal pills |
| Media grid | 2 columns | 3-4 columns |
| Navigation | Bottom tabs | Side navigation |
| Modals | Full screen | Centered dialog |

---

## 10. Data Visualization

### Chart Colors
Use monochromatic palette derived from text scale.

| Token | Use Case |
|-------|----------|
| `--chart-1` | Primary data series |
| `--chart-2` | Secondary data |
| `--chart-3` | Tertiary data |
| `--chart-4` | Background/comparison |
| `--chart-accent` | Highlighted data point |

### Chart Rules
✓ Use monochromatic palette for data series
✓ Use accent to highlight key data
✓ Keep grid lines subtle (`--border-subtle`)
✓ Animate on hover, not on load
✓ Use semantic colors for status metrics only

✗ No rainbow colors
✗ No platform colors in charts
✗ No 3D effects or gradients on data
✗ No heavy borders or shadows on bars

---

## 11. Do / Don't Summary

### DO
- Use CSS variables for all colors
- Create hierarchy through text opacity
- Use borders (dark) or shadows (light) for depth
- Keep animations fast and subtle
- Use Lucide icons, monochrome
- Match skeleton to content dimensions
- Respect 44px touch targets on mobile

### DON'T
- Hardcode color values
- Use colored borders or glows
- Use shadows in dark theme
- Use gradients (except feature CTA)
- Use emojis anywhere
- Use border-radius > 16px (except pills)
- Let platform colors bleed into UI
- Create layout shift on load
