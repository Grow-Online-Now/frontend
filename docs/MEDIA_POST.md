# Media-First Flow — Detailed Specification

> **Route**: `/create/media`  
> **Purpose**: Share photos and videos to Instagram, TikTok, YouTube Shorts, and other visual platforms.

---

## Flow Overview

Unlike the text-first flow, the media-first flow is a **single screen** with no steps. Everything is visible at once because creators want to see their content as they compose.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [←]  New Post                                    [Save Draft]          │
├────────────────────────────────────────┬────────────────────────────────┤
│                                        │                                │
│         ┌──────────────────┐           │  POST TO                       │
│         │    ┌────────┐    │           │  ┌──────┐ ┌──────┐ ┌──────┐   │
│         │    │ notch  │    │           │  │IG ✓  │ │ TT ✓ │ │ YT   │   │
│         │    └────────┘    │           │  └──────┘ └──────┘ └──────┘   │
│         │                  │           │                                │
│         │                  │           │  CAPTION                       │
│         │    ┌────────┐    │           │  ┌────────────────────────┐   │
│         │    │   ▶    │    │           │  │ Building in public...  │   │
│         │    │  0:45  │    │           │  │                        │   │
│         │    └────────┘    │           │  └────────────────────────┘   │
│         │                  │           │  [😊] [#] [@]      142/2,200   │
│         │  ┌────────────┐  │           │                                │
│         │  │ Replace    │  │           │  OPTIONS                       │
│         │  │ Trim Cover │  │           │  Sound        Original audio › │
│         │  └────────────┘  │           │  Location     Add            › │
│         └──────────────────┘           │  Allow Duets  [====○        ]  │
│                                        │                                │
│         [ 9:16 ] [ 1:1 ] [ 4:5 ]       │  ┌────────────────────────┐   │
│                                        │  │ ⚡ Post Now            › │   │
│                                        │  └────────────────────────┘   │
│                                        │                                │
│                                        │  ┌────────────────────────┐   │
│                                        │  │  Publish to 2 platforms │   │
│                                        │  └────────────────────────┘   │
└────────────────────────────────────────┴────────────────────────────────┘
```

---

## Page Layout

```tsx
// src/pages/create/media/index.tsx

export default function CreateMediaPage() {
  const {
    media,
    addMedia,
    removeMedia,
    aspectRatio,
    setAspectRatio,
  } = useMediaUpload();
  
  const {
    caption,
    setCaption,
    selectedPlatforms,
    togglePlatform,
  } = usePostContent();
  
  const {
    schedule,
    setSchedule,
  } = useSchedule();
  
  const { publish, isPublishing } = usePublish();

  return (
    <div className="min-h-screen bg-bg-base">
      <TopBar
        title="New Post"
        leftAction={<BackButton />}
        rightAction={<Button variant="ghost">Save Draft</Button>}
      />
      
      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
        {/* Left: Media Preview */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-bg-subtle">
          <MediaPreviewSection
            media={media}
            onMediaAdd={addMedia}
            onMediaRemove={removeMedia}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
          />
        </div>
        
        {/* Right: Details Panel */}
        <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-border-default">
          <DetailsPanel
            caption={caption}
            onCaptionChange={setCaption}
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={togglePlatform}
            schedule={schedule}
            onScheduleChange={setSchedule}
            onPublish={publish}
            isPublishing={isPublishing}
            mediaType={media[0]?.type}
          />
        </div>
      </main>
    </div>
  );
}
```

---

## Left Panel: Media Preview Section

### Component Structure

```tsx
// src/components/create/media/MediaPreviewSection.tsx

interface MediaPreviewSectionProps {
  media: MediaFile[];
  onMediaAdd: (files: File[]) => void;
  onMediaRemove: (id: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

export function MediaPreviewSection({
  media,
  onMediaAdd,
  onMediaRemove,
  aspectRatio,
  onAspectRatioChange,
}: MediaPreviewSectionProps) {
  const hasMedia = media.length > 0;
  
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[360px]">
      {/* Phone frame with content */}
      <PhoneFrame aspectRatio={aspectRatio}>
        {hasMedia ? (
          <MediaContent 
            media={media[0]} 
            onRemove={() => onMediaRemove(media[0].id)}
          />
        ) : (
          <MediaDropZone onDrop={onMediaAdd} />
        )}
      </PhoneFrame>
      
      {/* Aspect ratio selector */}
      {hasMedia && (
        <AspectRatioSelector
          value={aspectRatio}
          onChange={onAspectRatioChange}
          mediaType={media[0].type}
        />
      )}
    </div>
  );
}
```

### Phone Frame Component

```tsx
// src/components/create/media/PhoneFrame.tsx

interface PhoneFrameProps {
  children: React.ReactNode;
  aspectRatio: AspectRatio;
}

export function PhoneFrame({ children, aspectRatio }: PhoneFrameProps) {
  // Calculate screen dimensions based on aspect ratio
  const getScreenStyle = () => {
    const baseWidth = 280;
    switch (aspectRatio) {
      case '9:16':
        return { width: baseWidth, height: baseWidth * (16 / 9) };
      case '1:1':
        return { width: baseWidth, height: baseWidth };
      case '4:5':
        return { width: baseWidth, height: baseWidth * (5 / 4) };
      case '16:9':
        return { width: baseWidth, height: baseWidth * (9 / 16) };
      default:
        return { width: baseWidth, height: baseWidth * (16 / 9) };
    }
  };
  
  const screenStyle = getScreenStyle();
  
  return (
    <div 
      className="
        bg-[#1a1a1a] rounded-[40px] p-3
        shadow-2xl shadow-black/50
      "
    >
      {/* Phone screen */}
      <div
        className="relative bg-bg-base rounded-[32px] overflow-hidden"
        style={screenStyle}
      >
        {/* Notch */}
        <div className="
          absolute top-2 left-1/2 -translate-x-1/2 z-10
          w-20 h-6 bg-[#1a1a1a] rounded-full
        " />
        
        {/* Content */}
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Media Drop Zone Component

```tsx
// src/components/create/media/MediaDropZone.tsx

interface MediaDropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;
}

export function MediaDropZone({ onDrop, accept = "image/*,video/*" }: MediaDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onDrop(files);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDrop(files);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "w-full h-full",
        "flex flex-col items-center justify-center gap-4",
        "border-2 border-dashed rounded-[32px]",
        "transition-all duration-150",
        isDragging
          ? "border-border-focus bg-bg-hover scale-[1.02]"
          : "border-border-default hover:border-border-emphasis hover:bg-bg-hover"
      )}
    >
      <div className="
        w-14 h-14 rounded-full bg-bg-elevated
        flex items-center justify-center
      ">
        <Upload className="w-6 h-6 text-text-primary" />
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-text-primary">
          Drop video or photo
        </div>
        <div className="text-xs text-text-muted mt-1">
          or click to browse
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </button>
  );
}
```

### Media Content Component (Filled State)

```tsx
// src/components/create/media/MediaContent.tsx

interface MediaContentProps {
  media: MediaFile;
  onRemove: () => void;
  onReplace?: () => void;
  onTrim?: () => void;
  onSelectCover?: () => void;
}

export function MediaContent({
  media,
  onRemove,
  onReplace,
  onTrim,
  onSelectCover,
}: MediaContentProps) {
  return (
    <div className="relative w-full h-full">
      {/* Media */}
      {media.type === 'video' ? (
        <video
          src={media.url}
          className="w-full h-full object-cover"
          loop
          muted
          autoPlay
          playsInline
        />
      ) : (
        <img
          src={media.url}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Video duration badge */}
      {media.type === 'video' && media.duration && (
        <div className="
          absolute top-12 right-3
          px-2 py-1 rounded
          bg-black/70 text-white
          text-xs font-mono
        ">
          {formatDuration(media.duration)}
        </div>
      )}
      
      {/* Overlay controls */}
      <div className="
        absolute bottom-0 left-0 right-0
        p-4
        bg-gradient-to-t from-black/80 to-transparent
      ">
        <div className="flex gap-2">
          <button
            onClick={onReplace}
            className="
              px-3 py-2 rounded-lg
              bg-white/20 backdrop-blur-md
              text-white text-xs font-medium
              hover:bg-white/30
              transition-colors duration-150
              flex items-center gap-1.5
            "
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Replace
          </button>
          
          {media.type === 'video' && (
            <>
              <button
                onClick={onTrim}
                className="
                  px-3 py-2 rounded-lg
                  bg-white/20 backdrop-blur-md
                  text-white text-xs font-medium
                  hover:bg-white/30
                  transition-colors duration-150
                  flex items-center gap-1.5
                "
              >
                <Scissors className="w-3.5 h-3.5" />
                Trim
              </button>
              
              <button
                onClick={onSelectCover}
                className="
                  px-3 py-2 rounded-lg
                  bg-white/20 backdrop-blur-md
                  text-white text-xs font-medium
                  hover:bg-white/30
                  transition-colors duration-150
                  flex items-center gap-1.5
                "
              >
                <Image className="w-3.5 h-3.5" />
                Cover
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

### Aspect Ratio Selector

```tsx
// src/components/create/media/AspectRatioSelector.tsx

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
  mediaType: MediaType;
}

const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:5', label: '4:5' },
];

export function AspectRatioSelector({
  value,
  onChange,
  mediaType,
}: AspectRatioSelectorProps) {
  return (
    <div className="flex gap-2">
      {ASPECT_RATIOS.map((ratio) => (
        <button
          key={ratio.value}
          onClick={() => onChange(ratio.value)}
          className={cn(
            "px-4 py-2 rounded-lg",
            "text-sm font-medium",
            "transition-all duration-150",
            value === ratio.value
              ? "bg-text-primary text-bg-base"
              : "bg-bg-elevated border border-border-default text-text-secondary hover:border-border-emphasis"
          )}
        >
          {ratio.label}
        </button>
      ))}
    </div>
  );
}
```

---

## Right Panel: Details

### Component Structure

```tsx
// src/components/create/media/DetailsPanel.tsx

interface DetailsPanelProps {
  caption: string;
  onCaptionChange: (caption: string) => void;
  selectedPlatforms: Platform[];
  onTogglePlatform: (platform: Platform) => void;
  schedule: 'now' | 'best' | Date;
  onScheduleChange: (schedule: 'now' | 'best' | Date) => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
  mediaType?: MediaType;
}

export function DetailsPanel({
  caption,
  onCaptionChange,
  selectedPlatforms,
  onTogglePlatform,
  schedule,
  onScheduleChange,
  onPublish,
  isPublishing,
  mediaType,
}: DetailsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Platform toggles */}
        <PanelSection title="Post to">
          <PlatformToggles
            selected={selectedPlatforms}
            onToggle={onTogglePlatform}
            mediaType={mediaType}
          />
        </PanelSection>
        
        {/* Caption */}
        <PanelSection title="Caption">
          <CaptionInput
            value={caption}
            onChange={onCaptionChange}
            maxLength={2200}
          />
        </PanelSection>
        
        {/* Platform-specific options */}
        {mediaType === 'video' && (
          <PanelSection title="Options">
            <MediaOptions
              platforms={selectedPlatforms}
            />
          </PanelSection>
        )}
        
        {/* Schedule */}
        <PanelSection>
          <ScheduleBar
            value={schedule}
            onChange={onScheduleChange}
          />
        </PanelSection>
      </div>
      
      {/* Sticky publish button */}
      <div className="p-5 border-t border-border-default">
        <Button
          onClick={onPublish}
          disabled={isPublishing || selectedPlatforms.length === 0}
          className="
            w-full py-4
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:from-purple-600 hover:to-pink-600
            text-white font-semibold
            rounded-xl
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Publishing...
            </>
          ) : (
            `Publish to ${selectedPlatforms.length} Platform${selectedPlatforms.length !== 1 ? 's' : ''}`
          )}
        </Button>
      </div>
    </div>
  );
}
```

### Panel Section Component

```tsx
// src/components/create/media/PanelSection.tsx

interface PanelSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <div className="px-5 py-4 border-b border-border-default">
      {title && (
        <div className="
          text-xs font-medium text-text-muted
          uppercase tracking-wider
          mb-3
        ">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
```

### Platform Toggles Component

```tsx
// src/components/create/media/PlatformToggles.tsx

interface PlatformTogglesProps {
  selected: Platform[];
  onToggle: (platform: Platform) => void;
  mediaType?: MediaType;
}

export function PlatformToggles({
  selected,
  onToggle,
  mediaType,
}: PlatformTogglesProps) {
  const { accounts } = useConnectedAccounts();
  
  // Filter to media-first platforms
  const mediaAccounts = accounts.filter(acc => 
    MEDIA_FIRST_PLATFORMS.includes(acc.platform)
  );
  
  return (
    <div className="flex flex-wrap gap-2">
      {mediaAccounts.map((account) => {
        const config = PLATFORMS[account.platform];
        const isSelected = selected.includes(account.platform);
        
        // Check if platform supports this media type
        const isSupported = mediaType === 'video' 
          ? config.supportsVideo 
          : config.supportsMedia;
        
        return (
          <button
            key={account.id}
            onClick={() => onToggle(account.platform)}
            disabled={!isSupported}
            className={cn(
              "flex items-center gap-2",
              "px-3 py-2 rounded-xl",
              "transition-all duration-150",
              isSelected
                ? "bg-bg-hover border border-text-primary"
                : "bg-bg-elevated border border-border-default hover:border-border-emphasis",
              !isSupported && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: config.color }}
            >
              <PlatformIcon platform={account.platform} size={14} color="white" />
            </div>
            <span className="text-sm font-medium">
              {getPlatformShortName(account.platform)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function getPlatformShortName(platform: Platform): string {
  const names: Record<Platform, string> = {
    instagram: 'Reels',
    tiktok: 'TikTok',
    youtube: 'Shorts',
    pinterest: 'Pin',
    facebook: 'Reels',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    threads: 'Threads',
  };
  return names[platform];
}
```

### Caption Input Component

```tsx
// src/components/create/media/CaptionInput.tsx

interface CaptionInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function CaptionInput({
  value,
  onChange,
  maxLength = 2200,
}: CaptionInputProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a caption..."
        maxLength={maxLength}
        className="
          w-full min-h-[100px]
          p-3 rounded-xl
          bg-bg-elevated border border-border-default
          text-sm text-text-primary
          placeholder:text-text-muted
          resize-none
          focus:outline-none focus:border-border-focus
          transition-colors duration-150
        "
      />
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {/* Quick actions */}
        <div className="flex gap-1">
          <IconButton icon={Smile} size="sm" tooltip="Add emoji" />
          <IconButton icon={Hash} size="sm" tooltip="Add hashtag" />
          <IconButton icon={AtSign} size="sm" tooltip="Mention" />
        </div>
        
        {/* Character count */}
        <span className={cn(
          "text-xs font-mono",
          value.length > maxLength * 0.9 ? "text-warning" : "text-text-muted"
        )}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
```

### Media Options Component

```tsx
// src/components/create/media/MediaOptions.tsx

interface MediaOptionsProps {
  platforms: Platform[];
}

export function MediaOptions({ platforms }: MediaOptionsProps) {
  const [sound, setSound] = useState('original');
  const [location, setLocation] = useState('');
  const [allowDuets, setAllowDuets] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  
  const hasTikTok = platforms.includes('tiktok');
  const hasInstagram = platforms.includes('instagram');
  
  return (
    <div className="space-y-3">
      {/* Sound selection */}
      <OptionRow
        icon={Music}
        label="Sound"
        value={sound === 'original' ? 'Original audio' : sound}
        onClick={() => {/* Open sound picker */}}
      />
      
      {/* Location */}
      <OptionRow
        icon={MapPin}
        label="Location"
        value={location || 'Add'}
        onClick={() => {/* Open location picker */}}
      />
      
      {/* TikTok-specific options */}
      {hasTikTok && (
        <>
          <OptionToggle
            icon={Users}
            label="Allow Duets"
            checked={allowDuets}
            onChange={setAllowDuets}
          />
          <OptionToggle
            icon={Scissors}
            label="Allow Stitch"
            checked={allowStitch}
            onChange={setAllowStitch}
          />
        </>
      )}
    </div>
  );
}

interface OptionRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}

function OptionRow({ icon: Icon, label, value, onClick }: OptionRowProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center justify-between
        p-3 rounded-xl
        bg-bg-elevated
        hover:bg-bg-hover
        transition-colors duration-150
      "
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-text-muted" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-text-secondary">
        <span className="text-sm">{value}</span>
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </div>
    </button>
  );
}

interface OptionToggleProps {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function OptionToggle({ icon: Icon, label, checked, onChange }: OptionToggleProps) {
  return (
    <div className="
      flex items-center justify-between
      p-3 rounded-xl
      bg-bg-elevated
    ">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-text-muted" />
        <span className="text-sm">{label}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
```

### Schedule Bar Component

```tsx
// src/components/create/media/ScheduleBar.tsx

interface ScheduleBarProps {
  value: 'now' | 'best' | Date;
  onChange: (value: 'now' | 'best' | Date) => void;
}

export function ScheduleBar({ value, onChange }: ScheduleBarProps) {
  const [showPicker, setShowPicker] = useState(false);
  
  const getDisplayText = () => {
    if (value === 'now') return 'Post Now';
    if (value === 'best') return 'Best Time (AI)';
    return format(value, 'MMM d, h:mm a');
  };
  
  return (
    <>
      <button
        onClick={() => setShowPicker(true)}
        className="
          w-full flex items-center gap-3
          p-4 rounded-xl
          bg-bg-elevated
          hover:bg-bg-hover
          transition-colors duration-150
        "
      >
        <Zap className="w-5 h-5 text-text-primary" />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium">{getDisplayText()}</div>
          <div className="text-xs text-text-muted">
            Tap to {value === 'now' ? 'schedule instead' : 'change'}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </button>
      
      {/* Schedule picker modal/sheet */}
      {showPicker && (
        <SchedulePicker
          value={value}
          onChange={(v) => {
            onChange(v);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
```

---

## Mobile Layout

On mobile, the layout stacks vertically with the details panel in a scrollable bottom section.

```tsx
// Responsive layout in the main page component

<main className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
  {/* Media Preview - Full width on mobile, 60% on desktop */}
  <div className="
    flex-shrink-0
    h-[50vh] lg:h-auto lg:flex-1
    flex items-center justify-center
    p-4 lg:p-12
    bg-bg-subtle
  ">
    <MediaPreviewSection ... />
  </div>
  
  {/* Details - Full width on mobile, fixed width on desktop */}
  <div className="
    flex-1 lg:flex-none
    w-full lg:w-[400px]
    border-t lg:border-t-0 lg:border-l
    border-border-default
    overflow-y-auto
  ">
    <DetailsPanel ... />
  </div>
</main>
```

### Mobile Bottom Sheet for Pickers

```tsx
// Use a bottom sheet pattern on mobile for pickers

function SchedulePicker({ value, onChange, onClose }) {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  
  if (isMobile) {
    return (
      <Sheet open onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-auto max-h-[70vh]">
          <SheetHeader>
            <SheetTitle>Schedule Post</SheetTitle>
          </SheetHeader>
          <SchedulePickerContent value={value} onChange={onChange} />
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <SchedulePickerContent value={value} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
}
```

---

## Recent Media Quick Select

Add a "Recent Media" section in the drop zone state for quick access:

```tsx
// In MediaDropZone, show recent uploads when empty

export function MediaDropZone({ onDrop }: MediaDropZoneProps) {
  const { recentMedia } = useRecentMedia();
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Main drop zone */}
      <div className="flex-1 flex items-center justify-center ...">
        {/* Drop zone content */}
      </div>
      
      {/* Recent media thumbnails */}
      {recentMedia.length > 0 && (
        <div className="p-4 border-t border-border-default">
          <div className="text-xs text-text-muted mb-2">Recent</div>
          <div className="grid grid-cols-4 gap-2">
            {recentMedia.slice(0, 8).map((item) => (
              <button
                key={item.id}
                onClick={() => onDrop([item.file])}
                className="
                  aspect-square rounded-lg overflow-hidden
                  hover:ring-2 hover:ring-text-primary
                  transition-all duration-150
                "
              >
                <img 
                  src={item.thumbnail} 
                  alt=""
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <span className="
                    absolute bottom-1 right-1
                    text-[10px] bg-black/70 px-1 rounded
                  ">
                    {formatDuration(item.duration)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Media Upload Hook

```tsx
// src/hooks/create/useMediaUpload.ts

interface UseMediaUploadReturn {
  media: MediaFile[];
  addMedia: (files: File[]) => Promise<void>;
  removeMedia: (id: string) => void;
  replaceMedia: (id: string, file: File) => Promise<void>;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export function useMediaUpload(): UseMediaUploadReturn {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const addMedia = async (files: File[]) => {
    setIsUploading(true);
    setError(null);
    
    try {
      for (const file of files) {
        // Validate file
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          throw new Error('Invalid file type');
        }
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Get video duration if applicable
        let duration: number | undefined;
        if (file.type.startsWith('video/')) {
          duration = await getVideoDuration(file);
        }
        
        // Detect aspect ratio
        const detectedRatio = await detectAspectRatio(file);
        
        const mediaFile: MediaFile = {
          id: crypto.randomUUID(),
          file,
          url,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          duration,
          aspectRatio: detectedRatio,
        };
        
        setMedia((prev) => [...prev, mediaFile]);
        setAspectRatio(detectedRatio);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeMedia = (id: string) => {
    setMedia((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((m) => m.id !== id);
    });
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.url));
    };
  }, []);
  
  return {
    media,
    addMedia,
    removeMedia,
    replaceMedia,
    aspectRatio,
    setAspectRatio,
    isUploading,
    uploadProgress,
    error,
  };
}

// Helper functions
async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
}

async function detectAspectRatio(file: File): Promise<AspectRatio> {
  return new Promise((resolve) => {
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth / video.videoHeight;
        URL.revokeObjectURL(video.src);
        resolve(ratioToAspect(ratio));
      };
      video.src = URL.createObjectURL(file);
    } else {
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        URL.revokeObjectURL(img.src);
        resolve(ratioToAspect(ratio));
      };
      img.src = URL.createObjectURL(file);
    }
  });
}

function ratioToAspect(ratio: number): AspectRatio {
  if (ratio > 1.2) return '16:9';
  if (ratio > 0.9) return '1:1';
  if (ratio > 0.7) return '4:5';
  return '9:16';
}
```

---

## Testing Checklist

- [ ] Can drag and drop media into drop zone
- [ ] Can click to browse and select files
- [ ] Video duration displays correctly
- [ ] Aspect ratio selector changes preview
- [ ] Phone frame adapts to aspect ratio
- [ ] Platform toggles work correctly
- [ ] Caption character count is accurate
- [ ] Media options show for video content
- [ ] Schedule bar opens picker
- [ ] Publish button shows correct platform count
- [ ] Publish button disabled when no platforms selected
- [ ] Loading state during publish
- [ ] Error handling for failed uploads
- [ ] Mobile layout stacks correctly
- [ ] Bottom sheets work on mobile
- [ ] Recent media quick select works
- [ ] Replace/Trim/Cover buttons functional
- [ ] Dark/light theme compatible