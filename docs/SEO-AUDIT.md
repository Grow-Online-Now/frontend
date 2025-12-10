# BRUTAL SEO AUDIT REPORT - Grow Online

**Date:** December 3, 2025
**Domain:** growonline.now
**Overall Score:** 6.5/10 - NOT LAUNCH READY

---

## Executive Summary

Your technical SEO foundation is strong, but there are **CRITICAL blockers** that will hurt you on a `.now` domain. Google will see broken images, missing favicons, and dead links - signals of a "burner site."

---

## PHASE 1: TECHNICAL SEO ✅ (9/10)

### What's Working
- **No noindex tags** - `index.html:12` correctly has `index, follow`
- **Canonical tags** - Properly implemented at `index.html:32`
- **Hreflang** - Language alternates for EN/FR/ES at `index.html:35-38`
- **robots.txt** - Well-configured, AI bots allowed, sitemap referenced

### Issues Found

| Issue | Severity | Location |
|-------|----------|----------|
| Sitemap missing pages | HIGH | `public/sitemap.xml` |
| 3 broken footer links | CRITICAL | `src/components/waitlist/footer/footerLinks.ts:21,24,26` |

**Missing from Sitemap:**
- `/blog` and `/blog/:slug`
- `/free-tools`, `/free-tools/linkedin-post-preview-tool`, `/free-tools/best-time-to-post-calculator`
- `/platforms` and all `/platforms/:platform` routes
- `/cookies`

**Broken Links (will 404):**
- `/features` - referenced line 21
- `/affiliates` - referenced line 24
- `/changelog` - referenced line 26

---

## PHASE 2: ENTITY VALIDATION ✅ (8/10)

### What's Working
- **11 JSON-LD schema types** implemented in `src/lib/seo/StructuredData.tsx`
- **SoftwareApplication schema** with proper category/OS/offers
- **Organization schema** with social links
- **NAP in footer** - Name, Address (France), Email at `src/components/waitlist/footer/FooterCompanyInfo.tsx:17,24`

### Issues Found

| Issue | Severity | Location |
|-------|----------|----------|
| Logo URL doesn't exist | CRITICAL | `index.html:97` references `/logo.png` |
| LocalBusiness schema incomplete | LOW | `StructuredData.tsx:466-475` |
| No phone number in NAP | LOW | Footer |

---

## PHASE 3: ON-PAGE SEO ⚠️ (7/10)

### Title Tag Analysis

| Page | Title | Length | Status |
|------|-------|--------|--------|
| Home | "Grow Online - AI-Powered Social Media Growth \| Join Waitlist" | 62 | ✅ |
| Blog | "Blog - Social Media Growth Tips & Strategies \| Grow Online" | 59 | ✅ |
| Free Tools | "Free Social Media Tools \| Grow Online" | 41 | ✅ |
| LinkedIn Tool | "LinkedIn Post Preview Tool & Hook Analyzer \| Grow Online" | 56 | ✅ |
| Platforms Hub | "Social Media Platforms \| Grow Online - All-In-One Growth Tool" | 62 | ⚠️ Borderline |
| Alternatives | "{{competitor}} Alternative - Grow Online \| AI-Powered..." | ~72 | ❌ TOO LONG |

**Fix:** Shorten alternatives title in `src/locales/en/alternatives.json:4`

### Meta Description Analysis

| Page | Length | Has CTA? | Status |
|------|--------|----------|--------|
| index.html | 211 chars | Yes | ❌ TOO LONG (truncates at 160) |
| Blog | 139 chars | No | ⚠️ Add CTA |
| Tools | 160 chars | No | ⚠️ At limit, add CTA |

### Image Alt Text - POOR

**Files with empty `alt=""`:**
1. `src/components/landing/HeroSection.tsx:84` - Avatar stack
2. `src/components/landing/TestimonialsSection.tsx:211-226` - User avatars, company logos
3. `src/components/alternatives/MigrationCTA.tsx:78-81` - Avatar illustration

---

## PHASE 4: INTERNAL LINKING ✅ (8/10)

### What's Working
- Platform cross-linking in `PlatformCrossLink.tsx`
- Footer links to all platforms and alternatives
- Free tools hub links to both tool pages

### Issues
- **Orphan pages**: `/features`, `/affiliates`, `/changelog` linked but don't exist
- No glossary/content interlinking within blog articles

---

## PHASE 5: PERFORMANCE 🚨 (4/10) - CRITICAL

### MISSING FAVICON FILES

**index.html references files that DON'T EXIST:**

| File | Line | Status |
|------|------|--------|
| `/favicon-32x32.png` | 25 | ❌ MISSING |
| `/favicon-16x16.png` | 26 | ❌ MISSING |
| `/apple-touch-icon.png` | 27 | ❌ MISSING |
| `/safari-pinned-tab.svg` | 29 | ❌ MISSING |
| `/browserconfig.xml` | 21 | ❌ MISSING |
| `/og-image.png` | 45, 61 | ❌ MISSING |
| `/logo.png` | 97 | ❌ MISSING |

**Only exists:** `vite.svg` (generic Vite logo)

This is **CRITICAL** - Google displays favicons in mobile search results. Missing favicon = suspicious site.

### Other Performance Issues

| Issue | Location | Impact |
|-------|----------|--------|
| Large PNG background | `public/images/landing/dots.png` (84KB) | Convert to WebP |
| No lazy loading on routes | `src/main.tsx` | Add React.lazy() |
| Avatar CLS risk | TestimonialsSection - no explicit width/height | Add dimensions |

---

## PHASE 6: COPY REALITY CHECK ⚠️ (7/10)

### No Major Issues
- No "Lorem Ipsum"
- No "TODO" or "FIXME" in user-facing code
- No "example.com" or "test@" emails
- No platform name mismatches (LinkedIn on TikTok pages)

### Concerns

| Issue | Location |
|-------|----------|
| Fake testimonials with fabricated names/metrics | `TestimonialsSection.tsx:17-116` |
| Dicebear placeholder avatars (19 instances) | HeroSection, TestimonialsSection, MigrationCTA |
| Pinterest icon placeholder | `src/config/platforms/pinterest.ts:16` |

---

## PHASE 7: DAY 0 LAUNCH ACTIONS

### Pre-Launch Checklist

- [ ] Create and add all missing favicon files
- [ ] Create og-image.png (1200x630px)
- [ ] Create logo.png for schema
- [ ] Fix/remove broken footer links (/features, /affiliates, /changelog)
- [ ] Update sitemap.xml with all pages
- [ ] Shorten meta description in index.html (under 160 chars)
- [ ] Shorten alternatives page title template
- [ ] Add alt text to all images
- [ ] Convert dots.png to WebP
- [ ] Replace/label fake testimonials

### Google Search Console Actions

1. Verify domain via DNS TXT record
2. Submit sitemap.xml immediately after deploy
3. Request indexing for:
   - Homepage
   - `/alternatives/buffer`
   - `/free-tools/linkedin-post-preview-tool`
   - `/platforms/instagram`

---

## PRIORITY FIX LIST

### 🔴 CRITICAL (Fix Before Launch)

1. **Create all missing favicon/image files**
   - favicon-32x32.png
   - favicon-16x16.png
   - apple-touch-icon.png
   - og-image.png
   - logo.png

2. **Fix broken footer links** - Either create pages or remove links:
   - `src/components/waitlist/footer/footerLinks.ts:21,24,26`

3. **Update sitemap.xml** - Add all missing routes

### 🟡 HIGH (Fix Within Week 1)

4. **Shorten meta description** - `index.html:9` (211→160 chars)
5. **Add image alt text** - 4+ components need fixing
6. **Fix alternatives title length** - `alternatives.json:4`

### 🟢 MEDIUM (Fix Within Month 1)

7. Convert dots.png to WebP
8. Implement route lazy loading
9. Replace fake testimonials or add disclaimer
10. Complete LocalBusiness schema

---

## FINAL SCORE BY PHASE

| Phase | Score | Status |
|-------|-------|--------|
| 1. Technical | 9/10 | ✅ Strong |
| 2. Entity | 8/10 | ✅ Good |
| 3. On-Page | 7/10 | ⚠️ Needs work |
| 4. Internal Links | 8/10 | ✅ Good |
| 5. Performance | 4/10 | 🚨 CRITICAL |
| 6. Copy Check | 7/10 | ⚠️ Concerns |

**Overall: 6.5/10 - NOT READY FOR LAUNCH**

---

## Files to Create

### Required Favicon Files

```
public/
├── favicon-32x32.png      (32x32px)         ❌ MISSING - Generate from SVG
├── favicon-16x16.png      (16x16px)         ❌ MISSING - Generate from SVG
├── apple-touch-icon.png   (180x180px)       ❌ MISSING - Generate from SVG
├── safari-pinned-tab.svg  (SVG, single color) ✅ CREATED
├── browserconfig.xml      (MS tile config)    ✅ CREATED
├── og-image.png           (1200x630px)      ❌ MISSING - Create social preview image
└── logo.png               (Square, 512x512px) - Optional, using SVG instead
```

### How to Generate Missing PNG Favicons

Use https://realfavicongenerator.net or run locally with ImageMagick:

```bash
# Install ImageMagick if needed
sudo apt install imagemagick

# Generate favicons from SVG
convert -background none public/svg/logo-black.svg -resize 32x32 public/favicon-32x32.png
convert -background none public/svg/logo-black.svg -resize 16x16 public/favicon-16x16.png
convert -background none public/svg/logo-black.svg -resize 180x180 public/apple-touch-icon.png
```

### browserconfig.xml (Already Created)

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/svg/logo-black.svg"/>
      <TileColor>#a78bfa</TileColor>
    </tile>
  </msapplication>
</browserconfig>
```

---

## Files to Modify

### 1. `src/components/waitlist/footer/footerLinks.ts`

Remove or fix lines 21, 24, 26:
```typescript
// REMOVE these until pages exist:
// { labelKey: 'footer.product.features', href: '/#features' },
// { labelKey: 'footer.company.affiliates', href: '/affiliates' },
// { labelKey: 'footer.company.changelog', href: '/changelog' },
```

### 2. `index.html` (line 9)

Shorten meta description from 211 to under 160 characters:
```html
<meta name="description" content="AI-powered social media scheduling and analytics for creators. Join the waitlist for 3 months free at launch." />
```

### 3. `src/locales/en/alternatives.json` (line 4)

Shorten title template:
```json
"title": "{{competitor}} Alternative | Grow Online"
```

### 4. `public/sitemap.xml`

Add missing URLs:
```xml
<url>
  <loc>https://growonline.now/blog</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://growonline.now/free-tools</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://growonline.now/free-tools/linkedin-post-preview-tool</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://growonline.now/free-tools/best-time-to-post-calculator</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://growonline.now/platforms</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://growonline.now/cookies</loc>
  <changefreq>yearly</changefreq>
  <priority>0.3</priority>
</url>
<!-- Add all /platforms/:platform URLs -->
```

### 5. Image Alt Text Fixes

**HeroSection.tsx:84**
```tsx
<img src={avatar} alt="Grow Online user" className="h-full w-full object-cover" />
```

**TestimonialsSection.tsx:211-226**
```tsx
<img
  className="size-14 rounded-full..."
  src={testimonial.author.imageUrl}
  alt={`${testimonial.author.name}, ${testimonial.author.role}`}
/>
```

**MigrationCTA.tsx:78-81**
```tsx
<img
  src={`https://api.dicebear.com/...`}
  alt="Grow Online community member"
  className="h-8 w-8 rounded-full..."
/>
```

---

## Conclusion

Fix the **critical items** (missing images, broken links, sitemap) and you'll jump from 6.5/10 to 8.5/10 immediately. The technical foundation is solid - you just need to close the gaps before Google sees them.

On a `.now` domain, you have zero margin for error. Make it flawless.
