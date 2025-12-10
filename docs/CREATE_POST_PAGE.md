# Create Post Page — Complete Redesign

## Overview

The Create Post page is the core experience of Grow Online. Users will spend 80% of their time here. The current implementation is a basic form that doesn't respect how different platforms work. This redesign creates a fluid, platform-aware composer that adapts to what users are actually trying to create.

**Current problems:**
- Single textarea regardless of platform
- Account selection buried in sidebar
- Must scroll to see scheduling options
- No media upload support
- No preview of how posts will look
- No platform-specific guidance

**Goals:**
- Everything visible without scrolling (on desktop)
- Platform selection drives the entire experience
- Media upload with drag-and-drop
- Live preview showing actual post appearance
- Smart warnings for platform incompatibilities
- Delightful, professional feel

---

## Layout Architecture

### Desktop: Three-Column Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Posts          Create Post                        [Post to 2 ▼]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌────────────────────────────┐    ┌─────────────────┐   │
│  │             │    │                            │    │                 │   │
│  │  PLATFORMS  │    │         COMPOSER           │    │     PREVIEW     │   │
│  │             │    │                            │    │                 │   │
│  │  240px      │    │         flex: 1            │    │     320px       │   │
│  │  fixed      │    │         (fluid)            │    │     fixed       │   │
│  │             │    │                            │    │                 │   │
│  ├─────────────┤    │                            │    │                 │   │
│  │             │    │                            │    │                 │   │
│  │  SCHEDULE   │    │                            │    │                 │   │
│  │             │    │                            │    │                 │   │
│  └─────────────┘    └────────────────────────────┘    └─────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### CSS Grid Structure

```css
.create-post-page {
  display: grid;
  grid-template-columns: 240px 1fr 320px;
  grid-template-rows: auto 1fr;
  gap: 24px;
  height: calc(100vh - 64px); /* Subtract header */
  padding: 24px;
  overflow: hidden; /* No page scroll */
}

.create-post-header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.platforms-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.composer-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.preview-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

/* Responsive: Tablet */
@media (max-width: 1200px) {
  .create-post-page {
    grid-template-columns: 200px 1fr 280px;
    gap: 16px;
    padding: 16px;
  }
}

/* Responsive: Mobile - becomes stacked/stepped */
@media (max-width: 768px) {
  .create-post-page {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
    overflow-y: auto;
  }
  
  .preview-column {
    display: none; /* Show in modal on mobile */
  }
}
```

---

## Component 1: Header

### Structure
```jsx
<header className="create-post-header">
  <div className="header-left">
    <button className="back-btn">
      <ArrowLeft size={18} />
      <span>Posts</span>
    </button>
    <h1 className="page-title">Create Post</h1>
  </div>
  
  <div className="header-right">
    <button className="btn-secondary">
      <Eye size={16} />
      Preview
    </button>
    <PostButton 
      platforms={selectedPlatforms}
      isReady={isPostReady}
      issues={validationIssues}
    />
  </div>
</header>
```

### CSS
```css
.create-post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-btn:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

---

## Component 2: Platform Selector (Left Column)

### Structure
```jsx
<div className="platforms-column">
  <section className="platform-selector">
    <div className="section-header">
      <h2 className="section-title">Platforms</h2>
      <span className="platform-count">{selectedCount} selected</span>
    </div>
    
    <div className="platform-list">
      {platforms.map(platform => (
        <PlatformOption
          key={platform.id}
          platform={platform}
          isSelected={selectedPlatforms.includes(platform.id)}
          isConnected={platform.isConnected}
          needsReconnect={platform.needsReconnect}
          onToggle={() => togglePlatform(platform.id)}
        />
      ))}
    </div>
  </section>
  
  <section className="schedule-section">
    <h2 className="section-title">When to post</h2>
    
    <div className="schedule-options">
      <ScheduleOption
        id="now"
        label="Post now"
        description="Publish immediately"
        isSelected={scheduleType === 'now'}
        onSelect={() => setScheduleType('now')}
      />
      <ScheduleOption
        id="schedule"
        label="Schedule"
        description="Pick a date and time"
        isSelected={scheduleType === 'schedule'}
        onSelect={() => setScheduleType('schedule')}
      >
        {scheduleType === 'schedule' && (
          <DateTimePicker
            value={scheduledTime}
            onChange={setScheduledTime}
          />
        )}
      </ScheduleOption>
      <ScheduleOption
        id="draft"
        label="Save as draft"
        description="Finish later"
        isSelected={scheduleType === 'draft'}
        onSelect={() => setScheduleType('draft')}
      />
    </div>
  </section>
</div>
```

### Platform Option Component
```jsx
<div 
  className={cn(
    "platform-option",
    isSelected && "selected",
    !isConnected && "disabled",
    needsReconnect && "needs-reconnect"
  )}
  onClick={() => isConnected && !needsReconnect && onToggle()}
>
  <div className="platform-checkbox">
    {isSelected && <Check size={14} />}
  </div>
  
  <div className={`platform-icon ${platform.id}`}>
    <PlatformIcon platform={platform.id} size={20} />
  </div>
  
  <div className="platform-info">
    <span className="platform-name">{platform.name}</span>
    <span className="platform-account">@{platform.handle}</span>
  </div>
  
  {needsReconnect && (
    <button className="reconnect-btn" onClick={handleReconnect}>
      Reconnect
    </button>
  )}
</div>
```

### CSS
```css
.platform-selector,
.schedule-section {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.platform-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

.platform-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.platform-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin: 0 -12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.platform-option:hover {
  background: var(--bg-surface);
}

.platform-option.selected {
  background: rgba(59, 130, 246, 0.1);
}

.platform-option.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.platform-option.needs-reconnect {
  opacity: 0.7;
}

.platform-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.platform-option.selected .platform-checkbox {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.platform-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.platform-icon.instagram { background: rgba(225, 48, 108, 0.1); color: #e4405f; }
.platform-icon.tiktok { background: rgba(255, 255, 255, 0.05); color: #ffffff; }
.platform-icon.youtube { background: rgba(255, 0, 0, 0.1); color: #ff0000; }
.platform-icon.linkedin { background: rgba(0, 119, 181, 0.1); color: #0077b5; }
.platform-icon.twitter { background: rgba(255, 255, 255, 0.05); color: #ffffff; }
.platform-icon.facebook { background: rgba(24, 119, 242, 0.1); color: #1877f2; }
.platform-icon.pinterest { background: rgba(230, 0, 35, 0.1); color: #e60023; }

.platform-info {
  flex: 1;
  min-width: 0;
}

.platform-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.platform-account {
  display: block;
  font-size: 12px;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reconnect-btn {
  padding: 6px 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #fca5a5;
  cursor: pointer;
  transition: all 0.15s ease;
}

.reconnect-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Schedule Options */
.schedule-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-option {
  padding: 12px;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.schedule-option:hover {
  border-color: var(--border-default);
}

.schedule-option.selected {
  border-color: var(--accent);
  background: rgba(59, 130, 246, 0.05);
}

.schedule-option-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.schedule-radio {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-default);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.schedule-option.selected .schedule-radio {
  border-color: var(--accent);
}

.schedule-option.selected .schedule-radio::after {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
}

.schedule-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.schedule-description {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-left: 28px;
  margin-top: 2px;
}

/* Date time picker (when schedule is selected) */
.datetime-picker {
  margin-top: 12px;
  margin-left: 28px;
  display: flex;
  gap: 8px;
}

.datetime-input {
  padding: 8px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
}

.datetime-input:hover {
  border-color: var(--border-default);
}
```

---

## Component 3: Composer (Center Column)

This is the heart of the experience. It adapts based on selected platforms.

### Structure
```jsx
<div className="composer-column">
  {/* Media Section - Prominence changes based on platforms */}
  <MediaUploader
    media={uploadedMedia}
    onUpload={handleMediaUpload}
    onRemove={handleMediaRemove}
    platforms={selectedPlatforms}
    required={isMediaRequired}
    acceptedTypes={getAcceptedMediaTypes()}
    aspectRatioHint={getAspectRatioHint()}
  />
  
  {/* Caption/Text Section */}
  <CaptionEditor
    value={caption}
    onChange={setCaption}
    platforms={selectedPlatforms}
    characterLimit={getCharacterLimit()}
    placeholder={getPlaceholder()}
  />
  
  {/* Platform-specific hints */}
  <PlatformHints
    platforms={selectedPlatforms}
    media={uploadedMedia}
    caption={caption}
  />
</div>
```

### Media Uploader Component

**Empty State:**
```jsx
<div className="media-uploader">
  <div 
    className={cn(
      "upload-dropzone",
      isDragging && "dragging",
      isMediaRequired && "required"
    )}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    onClick={() => fileInputRef.current?.click()}
  >
    <input
      ref={fileInputRef}
      type="file"
      accept={acceptedTypes}
      multiple
      hidden
      onChange={handleFileSelect}
    />
    
    <div className="dropzone-icon">
      <Upload size={24} />
    </div>
    
    <div className="dropzone-text">
      <span className="dropzone-title">
        {isMediaRequired ? 'Add media to continue' : 'Add photos or videos'}
      </span>
      <span className="dropzone-hint">
        Drag and drop or click to browse
      </span>
    </div>
    
    <div className="media-type-buttons">
      <button className="media-type-btn" onClick={() => selectMediaType('photo')}>
        <Image size={16} />
        Photo
      </button>
      <button className="media-type-btn" onClick={() => selectMediaType('video')}>
        <Video size={16} />
        Video
      </button>
      {supportsCarousel && (
        <button className="media-type-btn" onClick={() => selectMediaType('carousel')}>
          <Images size={16} />
          Carousel
        </button>
      )}
    </div>
  </div>
  
  {aspectRatioHint && (
    <div className="aspect-ratio-hint">
      <Info size={14} />
      <span>{aspectRatioHint}</span>
    </div>
  )}
</div>
```

**With Media:**
```jsx
<div className="media-uploader has-media">
  <div className="media-preview-container">
    {uploadedMedia.map((media, index) => (
      <div key={media.id} className="media-preview-item">
        {media.type === 'video' ? (
          <video src={media.url} className="media-preview" />
        ) : (
          <img src={media.url} alt="" className="media-preview" />
        )}
        
        <div className="media-overlay">
          {media.type === 'video' && (
            <span className="media-duration">
              <Play size={12} />
              {formatDuration(media.duration)}
            </span>
          )}
          <button 
            className="media-remove-btn"
            onClick={() => onRemove(media.id)}
          >
            <X size={16} />
          </button>
        </div>
        
        {media.warnings?.length > 0 && (
          <div className="media-warnings">
            {media.warnings.map((warning, i) => (
              <span key={i} className="media-warning">
                <AlertTriangle size={12} />
                {warning}
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
    
    {canAddMore && (
      <button className="add-more-media" onClick={triggerUpload}>
        <Plus size={20} />
        <span>Add more</span>
      </button>
    )}
  </div>
  
  {aspectRatioIssue && (
    <div className="aspect-ratio-warning">
      <AlertTriangle size={14} />
      <span>{aspectRatioIssue.message}</span>
      <button className="fix-btn" onClick={aspectRatioIssue.fix}>
        {aspectRatioIssue.fixLabel}
      </button>
    </div>
  )}
</div>
```

### CSS for Media Uploader
```css
.media-uploader {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  overflow: hidden;
}

.upload-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px dashed transparent;
  margin: 12px;
  border-radius: 10px;
}

.upload-dropzone:hover {
  background: var(--bg-surface);
}

.upload-dropzone.dragging {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent);
}

.upload-dropzone.required {
  background: rgba(234, 179, 8, 0.05);
  border-color: rgba(234, 179, 8, 0.3);
}

.dropzone-icon {
  width: 56px;
  height: 56px;
  background: var(--bg-surface);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.upload-dropzone.dragging .dropzone-icon {
  background: rgba(59, 130, 246, 0.2);
  color: var(--accent);
}

.dropzone-text {
  text-align: center;
  margin-bottom: 20px;
}

.dropzone-title {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.dropzone-hint {
  display: block;
  font-size: 13px;
  color: var(--text-tertiary);
}

.media-type-buttons {
  display: flex;
  gap: 8px;
}

.media-type-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.media-type-btn:hover {
  background: var(--bg-overlay);
  border-color: var(--border-default);
  color: var(--text-primary);
}

.aspect-ratio-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  font-size: 12px;
  color: var(--text-tertiary);
}

/* Media Preview Grid */
.media-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 16px;
}

.media-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-base);
}

.media-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.media-preview-item:hover .media-overlay {
  opacity: 1;
}

.media-duration {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.media-remove-btn {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.media-remove-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

.media-warnings {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.media-warning {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(234, 179, 8, 0.9);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #1a1a1a;
}

.add-more-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  aspect-ratio: 1;
  background: var(--bg-surface);
  border: 2px dashed var(--border-default);
  border-radius: 10px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.add-more-media:hover {
  background: var(--bg-overlay);
  border-color: var(--border-emphasis);
  color: var(--text-secondary);
}

.add-more-media span {
  font-size: 12px;
  font-weight: 500;
}

.aspect-ratio-warning {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(234, 179, 8, 0.1);
  border-top: 1px solid rgba(234, 179, 8, 0.2);
  font-size: 13px;
  color: #eab308;
}

.aspect-ratio-warning .fix-btn {
  margin-left: auto;
  padding: 6px 12px;
  background: rgba(234, 179, 8, 0.2);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #eab308;
  cursor: pointer;
}

.aspect-ratio-warning .fix-btn:hover {
  background: rgba(234, 179, 8, 0.3);
}
```

### Caption Editor Component

```jsx
<div className="caption-editor">
  <div className="caption-header">
    <label className="caption-label">Caption</label>
    <span className={cn(
      "char-count",
      isNearLimit && "warning",
      isOverLimit && "error"
    )}>
      {caption.length.toLocaleString()}/{characterLimit.toLocaleString()}
    </span>
  </div>
  
  <div className="caption-input-wrapper">
    <textarea
      className="caption-textarea"
      value={caption}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={6}
    />
    
    <div className="caption-toolbar">
      <button className="toolbar-btn" title="Add emoji">
        <Smile size={18} />
      </button>
      <button className="toolbar-btn" title="Add hashtag">
        <Hash size={18} />
      </button>
      <button className="toolbar-btn" title="Add mention">
        <AtSign size={18} />
      </button>
      
      <div className="toolbar-divider" />
      
      <button className="toolbar-btn" title="AI assist">
        <Sparkles size={18} />
        <span>AI assist</span>
      </button>
    </div>
  </div>
</div>
```

### CSS for Caption Editor
```css
.caption-editor {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  overflow: hidden;
}

.caption-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.caption-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.char-count {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--text-tertiary);
}

.char-count.warning {
  color: #eab308;
}

.char-count.error {
  color: #ef4444;
}

.caption-input-wrapper {
  display: flex;
  flex-direction: column;
}

.caption-textarea {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary);
  resize: none;
  min-height: 160px;
}

.caption-textarea::placeholder {
  color: var(--text-quaternary);
}

.caption-textarea:focus {
  outline: none;
}

.caption-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.toolbar-btn:hover {
  background: var(--bg-overlay);
  color: var(--text-secondary);
}

.toolbar-btn span {
  font-size: 13px;
  font-weight: 500;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--border-subtle);
  margin: 0 8px;
}
```

### Platform Hints Component
```jsx
<div className="platform-hints">
  {hints.map((hint, index) => (
    <div key={index} className={`hint hint-${hint.type}`}>
      {hint.type === 'info' && <Info size={14} />}
      {hint.type === 'warning' && <AlertTriangle size={14} />}
      {hint.type === 'error' && <XCircle size={14} />}
      {hint.type === 'tip' && <Lightbulb size={14} />}
      <span>{hint.message}</span>
    </div>
  ))}
</div>
```

### CSS for Platform Hints
```css
.platform-hints {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hint {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
}

.hint svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.hint-info {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.hint-warning {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.hint-error {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.hint-tip {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
}
```

---

## Component 4: Preview (Right Column)

### Structure
```jsx
<div className="preview-column">
  <div className="preview-header">
    <h2 className="section-title">Preview</h2>
    <select 
      className="preview-platform-select"
      value={previewPlatform}
      onChange={(e) => setPreviewPlatform(e.target.value)}
    >
      {selectedPlatforms.map(platform => (
        <option key={platform} value={platform}>
          {platformNames[platform]}
        </option>
      ))}
    </select>
  </div>
  
  <div className="preview-device">
    <div className="device-frame">
      <PlatformPreview
        platform={previewPlatform}
        media={uploadedMedia}
        caption={caption}
        account={getAccount(previewPlatform)}
      />
    </div>
  </div>
  
  <div className="preview-info">
    <div className="preview-stat">
      <span className="stat-label">Best time to post</span>
      <span className="stat-value">Today, 2:00 PM</span>
    </div>
    <div className="preview-stat">
      <span className="stat-label">Estimated reach</span>
      <span className="stat-value">~2.4k</span>
    </div>
  </div>
</div>
```

### Platform-Specific Preview Components

```jsx
// LinkedIn Preview
<div className="linkedin-preview">
  <div className="linkedin-header">
    <img src={account.avatar} className="linkedin-avatar" />
    <div className="linkedin-meta">
      <span className="linkedin-name">{account.name}</span>
      <span className="linkedin-handle">@{account.handle} • Just now</span>
    </div>
  </div>
  
  {media && (
    <div className="linkedin-media">
      {media.type === 'video' ? (
        <video src={media.url} />
      ) : (
        <img src={media.url} />
      )}
    </div>
  )}
  
  <div className="linkedin-caption">
    {formatCaption(caption, 'linkedin')}
  </div>
  
  <div className="linkedin-engagement">
    <span>👍 Like</span>
    <span>💬 Comment</span>
    <span>🔄 Repost</span>
    <span>📤 Send</span>
  </div>
</div>

// Instagram Preview
<div className="instagram-preview">
  <div className="instagram-header">
    <img src={account.avatar} className="instagram-avatar" />
    <span className="instagram-handle">{account.handle}</span>
    <MoreHorizontal size={16} className="instagram-more" />
  </div>
  
  <div className="instagram-media">
    {media?.type === 'video' ? (
      <video src={media.url} />
    ) : (
      <img src={media.url} />
    )}
  </div>
  
  <div className="instagram-actions">
    <Heart size={24} />
    <MessageCircle size={24} />
    <Send size={24} />
    <Bookmark size={24} className="instagram-save" />
  </div>
  
  <div className="instagram-caption">
    <strong>{account.handle}</strong> {formatCaption(caption, 'instagram')}
  </div>
</div>
```

### CSS for Preview
```css
.preview-column {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-platform-select {
  padding: 6px 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
}

.preview-device {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.device-frame {
  width: 100%;
  max-width: 280px;
  background: var(--bg-base);
  border-radius: 24px;
  padding: 12px;
  box-shadow: 
    0 0 0 1px var(--border-subtle),
    0 4px 20px rgba(0, 0, 0, 0.3);
}

/* LinkedIn Preview Styles */
.linkedin-preview {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.linkedin-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
}

.linkedin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.linkedin-meta {
  display: flex;
  flex-direction: column;
}

.linkedin-name {
  font-size: 13px;
  font-weight: 600;
  color: #000;
}

.linkedin-handle {
  font-size: 11px;
  color: #666;
}

.linkedin-media img,
.linkedin-media video {
  width: 100%;
  display: block;
}

.linkedin-caption {
  padding: 12px;
  font-size: 13px;
  line-height: 1.4;
  color: #000;
}

.linkedin-engagement {
  display: flex;
  justify-content: space-around;
  padding: 8px 12px;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}

/* Instagram Preview Styles */
.instagram-preview {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.instagram-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}

.instagram-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.instagram-handle {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #000;
}

.instagram-more {
  color: #000;
}

.instagram-media {
  aspect-ratio: 1;
  background: #f0f0f0;
}

.instagram-media img,
.instagram-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.instagram-actions {
  display: flex;
  gap: 16px;
  padding: 12px;
  color: #000;
}

.instagram-save {
  margin-left: auto;
}

.instagram-caption {
  padding: 0 12px 12px;
  font-size: 13px;
  line-height: 1.4;
  color: #000;
}

.instagram-caption strong {
  font-weight: 600;
  margin-right: 4px;
}

/* Preview Stats */
.preview-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
}

.preview-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.stat-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
```

---

## Component 5: Post Button (Smart CTA)

### Structure
```jsx
<div className="post-button-container">
  <button 
    className={cn(
      "post-button",
      !isReady && "disabled",
      hasIssues && "has-issues"
    )}
    onClick={handlePost}
    disabled={!isReady}
  >
    <span className="post-button-label">
      {scheduleType === 'now' && `Post to ${selectedPlatforms.length}`}
      {scheduleType === 'schedule' && `Schedule for ${selectedPlatforms.length}`}
      {scheduleType === 'draft' && 'Save draft'}
    </span>
    <ChevronDown size={16} />
  </button>
  
  {isExpanded && (
    <div className="post-button-dropdown">
      <div className="dropdown-header">Ready to post</div>
      
      {selectedPlatforms.map(platform => (
        <div key={platform} className="platform-status">
          <div className={`platform-icon ${platform}`}>
            <PlatformIcon platform={platform} size={16} />
          </div>
          <span className="platform-name">{platformNames[platform]}</span>
          {getStatus(platform) === 'ready' && (
            <span className="status ready">
              <Check size={14} />
              Ready
            </span>
          )}
          {getStatus(platform) === 'warning' && (
            <span className="status warning">
              <AlertTriangle size={14} />
              {getWarning(platform)}
            </span>
          )}
          {getStatus(platform) === 'error' && (
            <span className="status error">
              <X size={14} />
              {getError(platform)}
            </span>
          )}
        </div>
      ))}
      
      <div className="dropdown-actions">
        <button className="post-ready-btn" disabled={readyCount === 0}>
          Post {readyCount} ready
        </button>
        {hasIssues && (
          <button className="fix-issues-btn">
            Fix {issueCount} issues
          </button>
        )}
      </div>
    </div>
  )}
</div>
```

### CSS for Post Button
```css
.post-button-container {
  position: relative;
}

.post-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(59, 130, 246, 0.3);
}

.post-button:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    0 8px 20px rgba(59, 130, 246, 0.4);
}

.post-button.disabled {
  background: var(--bg-surface);
  color: var(--text-quaternary);
  box-shadow: none;
  cursor: not-allowed;
}

.post-button.has-issues {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(234, 179, 8, 0.3);
}

.post-button-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.dropdown-header {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 12px;
}

.platform-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.platform-status:not(:last-child) {
  border-bottom: 1px solid var(--border-subtle);
}

.platform-status .platform-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-status .platform-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.platform-status .status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.platform-status .status.ready {
  color: #22c55e;
}

.platform-status .status.warning {
  color: #eab308;
}

.platform-status .status.error {
  color: #ef4444;
}

.dropdown-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
}

.post-ready-btn {
  flex: 1;
  padding: 10px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
}

.post-ready-btn:disabled {
  background: var(--bg-surface);
  color: var(--text-quaternary);
}

.fix-issues-btn {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
}
```

---

## Platform-Specific Logic

### Media Requirements
```typescript
const platformRequirements = {
  instagram: {
    mediaRequired: true,
    acceptedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxImages: 10,
    maxVideoDuration: 60, // seconds for feed, 90 for reels
    aspectRatios: ['1:1', '4:5', '9:16'],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    captionLimit: 2200,
  },
  tiktok: {
    mediaRequired: true,
    acceptedTypes: ['video/mp4', 'video/webm'],
    maxVideoDuration: 180,
    aspectRatios: ['9:16'],
    maxFileSize: 500 * 1024 * 1024,
    captionLimit: 2200,
  },
  youtube: {
    mediaRequired: true,
    acceptedTypes: ['video/mp4', 'video/webm', 'video/mov'],
    maxVideoDuration: null, // No limit for most accounts
    aspectRatios: ['16:9', '9:16'], // Shorts vs regular
    maxFileSize: 256 * 1024 * 1024 * 1024, // 256GB
    captionLimit: 5000,
  },
  linkedin: {
    mediaRequired: false,
    acceptedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxImages: 9,
    maxVideoDuration: 600, // 10 minutes
    aspectRatios: ['1:1', '16:9', '4:5'],
    maxFileSize: 200 * 1024 * 1024,
    captionLimit: 3000,
  },
  twitter: {
    mediaRequired: false,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    maxImages: 4,
    maxVideoDuration: 140,
    aspectRatios: ['16:9', '1:1'],
    maxFileSize: 512 * 1024 * 1024,
    captionLimit: 280,
  },
  facebook: {
    mediaRequired: false,
    acceptedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxImages: 10,
    maxVideoDuration: 240 * 60, // 4 hours
    aspectRatios: ['16:9', '1:1', '9:16'],
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
    captionLimit: 63206,
  },
  pinterest: {
    mediaRequired: true,
    acceptedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxVideoDuration: 60,
    aspectRatios: ['2:3', '1:1'],
    maxFileSize: 200 * 1024 * 1024,
    captionLimit: 500,
  },
};
```

### Dynamic Hints
```typescript
function getHints(platforms: string[], media: Media | null, caption: string) {
  const hints: Hint[] = [];
  
  // Check media requirements
  const mediaRequired = platforms.some(p => platformRequirements[p].mediaRequired);
  if (mediaRequired && !media) {
    hints.push({
      type: 'error',
      message: `${getMediaRequiredPlatforms(platforms).join(', ')} require media`,
    });
  }
  
  // Check aspect ratios
  if (media) {
    const incompatiblePlatforms = platforms.filter(p => {
      const allowed = platformRequirements[p].aspectRatios;
      return !allowed.includes(media.aspectRatio);
    });
    
    if (incompatiblePlatforms.length > 0) {
      hints.push({
        type: 'warning',
        message: `Media will be cropped for ${incompatiblePlatforms.join(', ')}`,
      });
    }
  }
  
  // Check caption length
  platforms.forEach(p => {
    const limit = platformRequirements[p].captionLimit;
    if (caption.length > limit) {
      hints.push({
        type: 'error',
        message: `Caption exceeds ${p} limit by ${caption.length - limit} characters`,
      });
    } else if (caption.length > limit * 0.9) {
      hints.push({
        type: 'warning',
        message: `Caption is ${Math.round((caption.length / limit) * 100)}% of ${p} limit`,
      });
    }
  });
  
  // Platform-specific tips
  if (platforms.includes('linkedin') && !media) {
    hints.push({
      type: 'tip',
      message: 'Posts with images get 2x more engagement on LinkedIn',
    });
  }
  
  if (platforms.includes('twitter') && caption.length < 100) {
    hints.push({
      type: 'tip',
      message: 'Tweets between 100-280 characters get the most engagement',
    });
  }
  
  return hints;
}
```

---

## Interaction Specifications

### Platform Selection
1. User clicks platform → toggles selection
2. If platform needs reconnect → show reconnect button, prevent selection
3. When platforms change → update composer requirements, hints, and preview
4. At least one platform must be selected to enable posting

### Media Upload
1. User can drag & drop or click to browse
2. Show upload progress with percentage
3. After upload, validate against selected platforms
4. Show warnings for aspect ratio mismatches
5. Offer auto-crop option for incompatible media
6. Support reordering for carousels (drag handles)

### Caption Editing
1. Real-time character count updates
2. Color changes as approaching limit (yellow >80%, red >100%)
3. Show different limits when multiple platforms selected (lowest wins)
4. Emoji picker inserts at cursor position
5. Hashtag button shows trending tags (optional)
6. AI assist opens modal for caption generation

### Preview
1. Updates in real-time as user types
2. Platform selector shows only selected platforms
3. Device frame matches platform (iPhone for Instagram, browser for LinkedIn)
4. Shows "no media" placeholder when media required but not added
5. Truncates long captions with "...more" like actual platforms

### Posting
1. Post button shows platform count
2. Dropdown shows per-platform status
3. Can post to "ready" platforms even if some have issues
4. Shows confirmation modal before posting
5. Progress indicator during upload/post
6. Success state with links to view posts

---

## State Management

```typescript
interface CreatePostState {
  // Platform selection
  selectedPlatforms: string[];
  
  // Media
  uploadedMedia: Media[];
  isUploading: boolean;
  uploadProgress: number;
  
  // Caption
  caption: string;
  
  // Schedule
  scheduleType: 'now' | 'schedule' | 'draft';
  scheduledTime: Date | null;
  
  // Preview
  previewPlatform: string;
  
  // Validation
  validationIssues: ValidationIssue[];
  isPostReady: boolean;
  
  // UI
  isPosting: boolean;
  postResult: PostResult | null;
}

interface Media {
  id: string;
  type: 'image' | 'video';
  url: string;
  file: File;
  width: number;
  height: number;
  aspectRatio: string;
  duration?: number;
  thumbnail?: string;
  warnings: string[];
}

interface ValidationIssue {
  platform: string;
  type: 'error' | 'warning';
  field: 'media' | 'caption' | 'account';
  message: string;
}
```

---

## Implementation Priority

1. **Phase 1: Layout** — Implement three-column grid, make it responsive
2. **Phase 2: Platform Selector** — Move to left column, add scheduling below
3. **Phase 3: Basic Composer** — Caption with character limits, platform hints
4. **Phase 4: Media Upload** — Drag & drop, preview, basic validation
5. **Phase 5: Preview Panel** — Platform-specific preview components
6. **Phase 6: Smart Post Button** — Status dropdown, per-platform validation
7. **Phase 7: Polish** — Animations, loading states, error handling

---

## File Structure

```
src/
  pages/
    CreatePost/
      CreatePost.tsx           # Main page component
      CreatePost.module.css    # Page styles
      
  components/
    CreatePost/
      PlatformSelector/
        PlatformSelector.tsx
        PlatformOption.tsx
        PlatformSelector.module.css
        
      ScheduleSelector/
        ScheduleSelector.tsx
        DateTimePicker.tsx
        ScheduleSelector.module.css
        
      MediaUploader/
        MediaUploader.tsx
        MediaPreview.tsx
        MediaUploader.module.css
        
      CaptionEditor/
        CaptionEditor.tsx
        CaptionToolbar.tsx
        EmojiPicker.tsx
        CaptionEditor.module.css
        
      PlatformHints/
        PlatformHints.tsx
        PlatformHints.module.css
        
      PostPreview/
        PostPreview.tsx
        LinkedInPreview.tsx
        InstagramPreview.tsx
        TwitterPreview.tsx
        TikTokPreview.tsx
        YouTubePreview.tsx
        FacebookPreview.tsx
        PinterestPreview.tsx
        PostPreview.module.css
        
      PostButton/
        PostButton.tsx
        PostStatusDropdown.tsx
        PostButton.module.css
        
  hooks/
    useMediaUpload.ts
    useMediaValidation.ts
    usePlatformRequirements.ts
    usePostValidation.ts
    
  utils/
    platformRequirements.ts
    mediaValidation.ts
    captionHelpers.ts
```

This is the complete specification. Implement phase by phase, testing each component before moving to the next.