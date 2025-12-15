# Text-First Flow — Detailed Specification

> **Route**: `/create/text`  
> **Purpose**: Compose text content for Twitter, LinkedIn, Threads, and other text-primary platforms.

---

## Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: WRITE                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │           What's on your mind?                        │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Image] [Smile] [Sparkles]              𝕏 0/280  in 0/3k   │
│                                                             │
│                                    [Continue →]             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: CHOOSE PLATFORMS                                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 𝕏 Twitter   │  │ in LinkedIn │  │ @ Threads   │         │
│  │ @handle     │  │ Name        │  │ @handle     │         │
│  │ ✓ 142/280   │  │ ✓ 142/3k    │  │ ✓ 142/500   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ⚠️ Twitter: 32 over limit  [✨ Shorten]                    │
│                                                             │
│                                    [Continue →]             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: WHEN                                               │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ ⚡ Post Now │  │ ✨ Best Time│  │ 📅 Schedule │         │
│  │             │  │ AI optimal  │  │ Pick date   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Publish to 3 platforms                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Page Layout

```tsx
// src/pages/create/text/index.tsx

export default function CreateTextPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { content, setContent, media, addMedia, removeMedia } = usePostContent();
  const { selectedPlatforms, togglePlatform, validations } = usePlatformSelection();
  const { schedule, setSchedule } = useSchedule();
  
  return (
    <div className="min-h-screen bg-bg-base">
      <TopBar
        title="New Post"
        leftAction={<BackButton />}
        rightAction={
          step < 3 ? (
            <Button 
              variant="primary" 
              disabled={!canContinue}
              onClick={() => setStep(s => s + 1)}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : null
        }
      />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Write
              key="write"
              content={content}
              onChange={setContent}
              media={media}
              onMediaAdd={addMedia}
              onMediaRemove={removeMedia}
            />
          )}
          {step === 2 && (
            <Step2Platforms
              key="platforms"
              content={content}
              selected={selectedPlatforms}
              onToggle={togglePlatform}
              validations={validations}
            />
          )}
          {step === 3 && (
            <Step3Schedule
              key="schedule"
              schedule={schedule}
              onChange={setSchedule}
              platformCount={selectedPlatforms.length}
              onPublish={handlePublish}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
```

---

## Step 1: Write

### Component Structure

```tsx
// src/components/create/text/Step1Write.tsx

interface Step1WriteProps {
  content: string;
  onChange: (content: string) => void;
  media: MediaFile[];
  onMediaAdd: (files: File[]) => void;
  onMediaRemove: (id: string) => void;
}

export function Step1Write({ 
  content, 
  onChange, 
  media, 
  onMediaAdd, 
  onMediaRemove 
}: Step1WriteProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Main textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What's on your mind?"
        className="
          w-full min-h-[200px] 
          bg-transparent border-none 
          text-lg text-text-primary 
          placeholder:text-text-muted
          resize-none outline-none
          leading-relaxed
        "
        autoFocus
      />
      
      {/* Media preview grid */}
      {media.length > 0 && (
        <MediaPreviewGrid 
          media={media} 
          onRemove={onMediaRemove}
        />
      )}
      
      {/* Toolbar */}
      <div className="
        flex items-center justify-between 
        pt-4 mt-4 
        border-t border-border-default
      ">
        <div className="flex gap-1">
          <IconButton icon={Image} onClick={handleMediaClick} tooltip="Add image" />
          <IconButton icon={Smile} onClick={handleEmojiClick} tooltip="Add emoji" />
          <IconButton icon={Sparkles} onClick={handleAIEnhance} tooltip="Enhance with AI" />
        </div>
        
        <CharacterCounts 
          content={content} 
          platforms={['twitter', 'linkedin', 'threads']} 
        />
      </div>
    </motion.div>
  );
}
```

### Textarea Styling

```css
/* Auto-growing textarea */
.composer-textarea {
  width: 100%;
  min-height: 200px;
  max-height: 60vh;
  
  /* Appearance */
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  
  /* Typography */
  font-family: var(--font-sans);
  font-size: var(--text-lg);  /* 18px */
  line-height: var(--leading-relaxed);  /* 1.65 */
  color: var(--text-primary);
  
  /* Placeholder */
  &::placeholder {
    color: var(--text-muted);
  }
}
```

### Character Counts Component

```tsx
// src/components/create/text/CharacterCounts.tsx

interface CharacterCountsProps {
  content: string;
  platforms: Platform[];
}

export function CharacterCounts({ content, platforms }: CharacterCountsProps) {
  return (
    <div className="flex items-center gap-4">
      {platforms.map((platform) => {
        const config = PLATFORMS[platform];
        const count = content.length;
        const percent = (count / config.maxChars) * 100;
        
        let colorClass = 'text-text-muted';
        if (percent >= 100) colorClass = 'text-error';
        else if (percent >= 90) colorClass = 'text-warning';
        
        return (
          <div 
            key={platform}
            className={`flex items-center gap-2 ${colorClass}`}
          >
            <PlatformIcon platform={platform} size={16} />
            <span className="font-mono text-xs">
              {count}/{config.maxChars}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

---

## Step 2: Choose Platforms

### Component Structure

```tsx
// src/components/create/text/Step2Platforms.tsx

interface Step2PlatformsProps {
  content: string;
  selected: Platform[];
  onToggle: (platform: Platform) => void;
  validations: PlatformValidation[];
  onAIShortenRequest: (platform: Platform) => void;
}

export function Step2Platforms({
  content,
  selected,
  onToggle,
  validations,
  onAIShortenRequest,
}: Step2PlatformsProps) {
  // Get connected accounts (from your accounts state)
  const { accounts } = useConnectedAccounts();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Platform grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts
          .filter(acc => TEXT_FIRST_PLATFORMS.includes(acc.platform))
          .map((account) => {
            const validation = validations.find(v => v.platform === account.platform);
            const isSelected = selected.includes(account.platform);
            
            return (
              <PlatformCard
                key={account.id}
                account={account}
                selected={isSelected}
                validation={validation}
                onClick={() => onToggle(account.platform)}
              />
            );
          })}
      </div>
      
      {/* Validation warnings */}
      {validations.some(v => !v.isValid) && (
        <ValidationWarnings
          validations={validations.filter(v => !v.isValid)}
          onShortenRequest={onAIShortenRequest}
        />
      )}
    </motion.div>
  );
}
```

### Platform Card Component

```tsx
// src/components/create/text/PlatformCard.tsx

interface PlatformCardProps {
  account: ConnectedAccount;
  selected: boolean;
  validation?: PlatformValidation;
  onClick: () => void;
}

export function PlatformCard({ 
  account, 
  selected, 
  validation, 
  onClick 
}: PlatformCardProps) {
  const config = PLATFORMS[account.platform];
  const hasError = validation && !validation.isValid;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        "w-full p-4 rounded-xl text-left",
        "border transition-all duration-150",
        "flex items-start gap-3",
        
        // States
        selected && !hasError && "border-text-primary bg-bg-hover",
        selected && hasError && "border-warning bg-warning-muted",
        !selected && "border-border-default hover:border-border-emphasis hover:bg-bg-hover",
      )}
    >
      {/* Platform icon */}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: config.color }}
      >
        <PlatformIcon platform={account.platform} size={20} color="white" />
      </div>
      
      {/* Account info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-text-primary truncate">
          {account.displayName}
        </div>
        <div className="text-xs text-text-muted truncate">
          @{account.handle}
        </div>
      </div>
      
      {/* Validation status */}
      {selected && validation && (
        <div className={cn(
          "text-xs font-mono",
          validation.isValid ? "text-success" : "text-warning"
        )}>
          {validation.isValid ? (
            <Check className="w-4 h-4" />
          ) : (
            <span>{validation.charCount}/{validation.maxChars}</span>
          )}
        </div>
      )}
    </button>
  );
}
```

### Validation Warnings Component

```tsx
// src/components/create/text/ValidationWarnings.tsx

interface ValidationWarningsProps {
  validations: PlatformValidation[];
  onShortenRequest: (platform: Platform) => void;
}

export function ValidationWarnings({ 
  validations, 
  onShortenRequest 
}: ValidationWarningsProps) {
  return (
    <div className="space-y-2">
      {validations.map((validation) => (
        <div
          key={validation.platform}
          className="
            flex items-center justify-between
            px-4 py-3 rounded-lg
            bg-warning-muted
            text-sm
          "
        >
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {PLATFORMS[validation.platform].name}: {validation.errors[0]}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShortenRequest(validation.platform)}
            className="text-warning hover:text-warning"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Shorten
          </Button>
        </div>
      ))}
    </div>
  );
}
```

---

## Step 3: Schedule

### Component Structure

```tsx
// src/components/create/text/Step3Schedule.tsx

type ScheduleOption = 'now' | 'best' | 'custom';

interface Step3ScheduleProps {
  schedule: 'now' | 'best' | Date;
  onChange: (schedule: 'now' | 'best' | Date) => void;
  platformCount: number;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
}

export function Step3Schedule({
  schedule,
  onChange,
  platformCount,
  onPublish,
  isPublishing,
}: Step3ScheduleProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const selectedOption: ScheduleOption = 
    schedule === 'now' ? 'now' :
    schedule === 'best' ? 'best' : 'custom';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Options grid */}
      <div className="grid grid-cols-3 gap-3">
        <ScheduleOptionCard
          icon={Zap}
          title="Post Now"
          description="Publish immediately"
          selected={selectedOption === 'now'}
          onClick={() => onChange('now')}
        />
        <ScheduleOptionCard
          icon={Sparkles}
          title="Best Time"
          description="AI picks optimal"
          selected={selectedOption === 'best'}
          onClick={() => onChange('best')}
        />
        <ScheduleOptionCard
          icon={Calendar}
          title="Schedule"
          description={selectedOption === 'custom' && schedule instanceof Date
            ? format(schedule, 'MMM d, h:mm a')
            : 'Pick date & time'
          }
          selected={selectedOption === 'custom'}
          onClick={() => setShowDatePicker(true)}
        />
      </div>
      
      {/* Date picker modal */}
      {showDatePicker && (
        <DateTimePicker
          value={schedule instanceof Date ? schedule : new Date()}
          onChange={(date) => {
            onChange(date);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
      
      {/* Publish button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onPublish}
        disabled={isPublishing}
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Publishing...
          </>
        ) : (
          <>
            Publish to {platformCount} platform{platformCount !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </motion.div>
  );
}
```

### Schedule Option Card

```tsx
// src/components/create/text/ScheduleOptionCard.tsx

interface ScheduleOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function ScheduleOptionCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}: ScheduleOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base
        "p-4 rounded-xl text-center",
        "border transition-all duration-150",
        "flex flex-col items-center gap-2",
        
        // States
        selected 
          ? "border-text-primary bg-bg-hover" 
          : "border-border-default hover:border-border-emphasis hover:bg-bg-hover"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center",
        selected ? "bg-text-primary text-bg-base" : "bg-bg-elevated"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-text-muted">{description}</div>
      </div>
    </button>
  );
}
```

---

## Top Bar Component

```tsx
// src/components/create/shared/TopBar.tsx

interface TopBarProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, leftAction, rightAction }: TopBarProps) {
  return (
    <header className="
      sticky top-0 z-10
      flex items-center justify-between
      px-4 py-3
      bg-bg-base/80 backdrop-blur-md
      border-b border-border-default
    ">
      <div className="flex items-center gap-3">
        {leftAction}
        <h1 className="text-sm font-medium text-text-secondary">
          {title}
        </h1>
      </div>
      
      {rightAction && (
        <div className="flex items-center gap-2">
          {rightAction}
        </div>
      )}
    </header>
  );
}
```

---

## AI Shorten Feature

```tsx
// src/hooks/create/useAIShorten.ts

interface UseAIShortenOptions {
  content: string;
  targetLength: number;
  platform: Platform;
}

export function useAIShorten() {
  const [isShortening, setIsShortening] = useState(false);
  const [previousContent, setPreviousContent] = useState<string | null>(null);
  
  const shorten = async ({ content, targetLength, platform }: UseAIShortenOptions) => {
    setIsShortening(true);
    setPreviousContent(content);
    
    try {
      const response = await fetch('/api/ai/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetLength, platform }),
      });
      
      const { shortened } = await response.json();
      return shortened;
    } finally {
      setIsShortening(false);
    }
  };
  
  const undo = () => {
    const previous = previousContent;
    setPreviousContent(null);
    return previous;
  };
  
  return { shorten, undo, isShortening, canUndo: !!previousContent };
}
```

---

## Keyboard Shortcuts Hook

```tsx
// src/hooks/useKeyboardShortcuts.ts

export function useKeyboardShortcuts(handlers: {
  onPublish?: () => void;
  onSave?: () => void;
  onBack?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      
      if (isMod && e.key === 'Enter' && handlers.onPublish) {
        e.preventDefault();
        handlers.onPublish();
      }
      
      if (isMod && e.key === 's' && handlers.onSave) {
        e.preventDefault();
        handlers.onSave();
      }
      
      if (e.key === 'Escape' && handlers.onBack) {
        e.preventDefault();
        handlers.onBack();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
```

---

## Mobile Adaptations

### Step Navigation

On mobile, add swipe gesture support:

```tsx
// Using framer-motion drag
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.x > 100 || velocity.x > 500) {
      // Swipe right = go back
      if (step > 1) setStep(step - 1);
    }
  }}
>
  {/* Step content */}
</motion.div>
```

### Bottom Sheet for Date Picker

```tsx
// On mobile, use a bottom sheet instead of modal
<Sheet open={showDatePicker} onOpenChange={setShowDatePicker}>
  <SheetContent side="bottom" className="h-[50vh]">
    <DateTimePicker ... />
  </SheetContent>
</Sheet>
```

---

## Loading States

### Publishing State

```tsx
// Full-screen overlay during publish
{isPublishing && (
  <div className="
    fixed inset-0 z-50
    bg-bg-base/80 backdrop-blur-sm
    flex flex-col items-center justify-center gap-4
  ">
    <Loader2 className="w-8 h-8 animate-spin text-text-primary" />
    <div className="text-sm text-text-secondary">
      Publishing to {platformCount} platforms...
    </div>
  </div>
)}
```

### Skeleton for Platform Cards

```tsx
// While loading connected accounts
<div className="grid grid-cols-3 gap-3">
  {[1, 2, 3].map((i) => (
    <div key={i} className="p-4 rounded-xl border border-border-default">
      <div className="flex items-start gap-3">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## Success State

```tsx
// After successful publish
function PublishSuccess({ platforms, onCreateAnother, onViewPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 space-y-6"
    >
      <div className="
        w-16 h-16 mx-auto 
        bg-success-muted rounded-full
        flex items-center justify-center
      ">
        <Check className="w-8 h-8 text-success" />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Published!</h2>
        <p className="text-text-secondary">
          Your post is now live on {platforms.length} platform{platforms.length !== 1 ? 's' : ''}.
        </p>
      </div>
      
      <div className="flex items-center justify-center gap-3 pt-4">
        {platforms.map(p => (
          <PlatformIcon key={p} platform={p} size={24} colored />
        ))}
      </div>
      
      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onViewPost}>
          View Post
        </Button>
        <Button variant="primary" onClick={onCreateAnother}>
          Create Another
        </Button>
      </div>
    </motion.div>
  );
}
```