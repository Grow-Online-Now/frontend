/**
 * PlatformConfigAccordion Component
 * Collapsible sections for platform-specific settings
 * Only shows sections for platforms that are selected
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { InstagramConfigSection } from '@/components/dashboard/create-post/InstagramConfigSection'
import { TikTokConfigSection } from '@/components/dashboard/create-post/TikTokConfigSection'
import { YouTubeConfigSection } from '@/components/dashboard/create-post/YouTubeConfigSection'
import { PinterestConfigSection } from '@/components/dashboard/create-post/PinterestConfigSection'
import type { MediaPlatformWithValidation } from '@/types/create'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import type {
  PlatformConfigurations,
  InstagramConfig,
  TikTokConfig,
  YouTubeConfig,
  PinterestConfig,
} from '@/types/posts'

interface MediaFile {
  id: string
  file: File
  url: string
  type: 'image' | 'video'
}

interface PlatformConfigAccordionProps {
  selectedPlatforms: MediaPlatformWithValidation[]
  media: FileUploadState[]
  platformConfigs: PlatformConfigurations
  onInstagramConfigChange: (config: Partial<InstagramConfig>) => void
  onTikTokConfigChange: (config: Partial<TikTokConfig>) => void
  onYouTubeConfigChange: (config: Partial<YouTubeConfig>) => void
  onPinterestConfigChange: (config: Partial<PinterestConfig>) => void
  className?: string
}

export function PlatformConfigAccordion({
  selectedPlatforms,
  media,
  platformConfigs,
  onInstagramConfigChange,
  onTikTokConfigChange,
  onYouTubeConfigChange,
  onPinterestConfigChange,
  className,
}: PlatformConfigAccordionProps) {
  const { t } = useTranslation()

  // Convert FileUploadState to MediaFile format expected by config sections
  const mediaFiles: MediaFile[] = useMemo(
    () =>
      media
        .filter((m) => m.status === 'ready')
        .map((m) => ({
          id: m.id,
          file: m.file,
          url: m.localUrl,
          type: m.type,
        })),
    [media]
  )

  // Find selected platforms by type
  const instagramAccount = selectedPlatforms.find((p) => p.platform === 'instagram')
  const tiktokAccount = selectedPlatforms.find((p) => p.platform === 'tiktok')
  const youtubeAccount = selectedPlatforms.find((p) => p.platform === 'youtube')
  const pinterestAccount = selectedPlatforms.find((p) => p.platform === 'pinterest')

  // If no platforms selected, don't render anything
  if (selectedPlatforms.length === 0) {
    return null
  }

  // Determine default open accordion items
  const defaultOpenItems: string[] = []
  if (instagramAccount) defaultOpenItems.push('instagram')
  if (youtubeAccount) defaultOpenItems.push('youtube')

  return (
    <Accordion type="multiple" defaultValue={defaultOpenItems} className={className}>
      {instagramAccount && (
        <AccordionItem value="instagram" className="border-border border-b">
          <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <PlatformIcon platform="instagram" size="xs" />
              <span className="text-text-primary text-sm font-medium">
                {t('dashboard.createPost.platformConfig.instagram.title')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <InstagramConfigSection
              config={platformConfigs.instagram || {}}
              onChange={(newConfig) => onInstagramConfigChange(newConfig)}
              media={mediaFiles}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {tiktokAccount && (
        <AccordionItem value="tiktok" className="border-border border-b">
          <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <PlatformIcon platform="tiktok" size="xs" />
              <span className="text-text-primary text-sm font-medium">
                {t('dashboard.createPost.platformConfig.tiktok.title')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <TikTokConfigSection
              config={platformConfigs.tiktok || {}}
              onChange={(newConfig) => onTikTokConfigChange(newConfig)}
              media={mediaFiles}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {youtubeAccount && (
        <AccordionItem value="youtube" className="border-border border-b">
          <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <PlatformIcon platform="youtube" size="xs" />
              <span className="text-text-primary text-sm font-medium">
                {t('dashboard.createPost.platformConfig.youtube.title')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <YouTubeConfigSection
              config={platformConfigs.youtube || {}}
              onChange={(newConfig) => onYouTubeConfigChange(newConfig)}
              media={mediaFiles}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {pinterestAccount && (
        <AccordionItem value="pinterest" className="border-border border-b last:border-b-0">
          <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <PlatformIcon platform="pinterest" size="xs" />
              <span className="text-text-primary text-sm font-medium">
                {t('dashboard.createPost.platformConfig.pinterest.title')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <PinterestConfigSection
              connectionId={pinterestAccount.id}
              config={platformConfigs.pinterest || {}}
              onChange={(newConfig) => onPinterestConfigChange(newConfig)}
            />
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}
