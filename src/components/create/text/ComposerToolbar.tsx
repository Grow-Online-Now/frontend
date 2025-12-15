/**
 * ComposerToolbar Component
 * Toolbar with media upload, emoji, and AI enhance buttons
 * Each button: 36px touch target, 20px icon
 */

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Smile, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ComposerToolbarProps {
  onMediaUpload: (files: FileList) => void
  onEmojiClick?: () => void
  onAIEnhance?: () => void
  className?: string
}

// Shared button styles: 36px touch target, 20px icon
const toolbarButtonClass = cn(
  'flex h-9 w-9 items-center justify-center rounded-lg',
  'text-muted-foreground hover:text-foreground hover:bg-surface-hover',
  'transition-colors duration-150'
)

export function ComposerToolbar({
  onMediaUpload,
  onEmojiClick,
  onAIEnhance,
  className,
}: ComposerToolbarProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMediaClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onMediaUpload(e.target.files)
      // Reset input so same file can be selected again
      e.target.value = ''
    }
  }

  const handleEmojiClick = () => {
    if (onEmojiClick) {
      onEmojiClick()
    } else {
      toast.info(t('dashboard.create.text.toolbar.emojiComingSoon'))
    }
  }

  const handleAIEnhance = () => {
    if (onAIEnhance) {
      onAIEnhance()
    } else {
      toast.info(t('dashboard.create.text.toolbar.aiEnhanceComingSoon'))
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Media button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" onClick={handleMediaClick} className={toolbarButtonClass}>
            <Image className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{t('dashboard.create.text.toolbar.media')}</TooltipContent>
      </Tooltip>

      {/* Emoji button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" onClick={handleEmojiClick} className={toolbarButtonClass}>
            <Smile className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{t('dashboard.create.text.toolbar.emoji')}</TooltipContent>
      </Tooltip>

      {/* AI Enhance button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" onClick={handleAIEnhance} className={toolbarButtonClass}>
            <Sparkles className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{t('dashboard.create.text.toolbar.aiEnhance')}</TooltipContent>
      </Tooltip>
    </div>
  )
}
