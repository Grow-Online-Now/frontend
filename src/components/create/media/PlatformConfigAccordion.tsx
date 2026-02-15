/**
 * PlatformConfigAccordion Component
 * Collapsible sections for platform-specific settings
 * Only shows sections for platforms that are selected
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings2 } from 'lucide-react'
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
  /** Callback for TikTok config validation state changes */
  onTikTokValidationChange?: (isValid: boolean, errors: string[]) => void
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
  onTikTokValidationChange,
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

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <Settings2 className="text-text-muted h-4 w-4" />
        <span className="text-text-muted text-xs font-medium tracking-wider uppercase">
          {t('dashboard.createPost.platformConfig.sectionTitle')}
        </span>
      </div>

      {/* Platform accordions - all closed by default */}
      <Accordion type="multiple" defaultValue={[]}>
        {instagramAccount && (
          <AccordionItem value="instagram" className="border-border border-t last:border-b-0">
            <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform="instagram" size="xs" />
                  <span className="text-text-primary text-sm font-medium">
                    {t('dashboard.createPost.platformConfig.instagram.title')}
                  </span>
                </div>
                <span className="text-text-muted text-xs">
                  {t('dashboard.createPost.platformConfig.clickToConfigure')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5 pt-1">
              <InstagramConfigSection
                config={platformConfigs.instagram || {}}
                onChange={(newConfig) => onInstagramConfigChange(newConfig)}
                media={mediaFiles}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {tiktokAccount && (
          <AccordionItem value="tiktok" className="border-border border-t last:border-b-0">
            <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform="tiktok" size="xs" />
                  <span className="text-text-primary text-sm font-medium">
                    {t('dashboard.createPost.platformConfig.tiktok.title')}
                  </span>
                </div>
                <span className="text-text-muted text-xs">
                  {t('dashboard.createPost.platformConfig.clickToConfigure')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5 pt-1">
              <TikTokConfigSection
                connectionId={tiktokAccount.id}
                config={platformConfigs.tiktok || {}}
                onChange={(newConfig) => onTikTokConfigChange(newConfig)}
                media={mediaFiles}
                onValidationChange={onTikTokValidationChange}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {youtubeAccount && (
          <AccordionItem value="youtube" className="border-border border-t last:border-b-0">
            <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform="youtube" size="xs" />
                  <span className="text-text-primary text-sm font-medium">
                    {t('dashboard.createPost.platformConfig.youtube.title')}
                  </span>
                </div>
                <span className="text-text-muted text-xs">
                  {t('dashboard.createPost.platformConfig.clickToConfigure')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5 pt-1">
              <YouTubeConfigSection
                config={platformConfigs.youtube || {}}
                onChange={(newConfig) => onYouTubeConfigChange(newConfig)}
                media={mediaFiles}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {pinterestAccount && (
          <AccordionItem value="pinterest" className="border-border border-t last:border-b-0">
            <AccordionTrigger className="hover:bg-bg-hover px-4 py-3 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform="pinterest" size="xs" />
                  <span className="text-text-primary text-sm font-medium">
                    {t('dashboard.createPost.platformConfig.pinterest.title')}
                  </span>
                </div>
                <span className="text-text-muted text-xs">
                  {t('dashboard.createPost.platformConfig.clickToConfigure')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-5 pt-1">
              <PinterestConfigSection
                connectionId={pinterestAccount.id}
                config={platformConfigs.pinterest || {}}
                onChange={(newConfig) => onPinterestConfigChange(newConfig)}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
