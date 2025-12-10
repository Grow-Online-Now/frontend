import {
  Youtube,
  Video,
  TrendingUp,
  Image,
  Sparkles,
  BarChart3,
  Scissors,
  Tv,
  Gamepad2,
  GraduationCap,
  Music,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { youtubeTheme } from './themes'

export const youtubeConfig: PlatformConfig = {
  slug: 'youtube',
  nameKey: 'platforms.youtube.name',
  icon: Youtube,

  theme: youtubeTheme,

  hero: {
    titleKey: 'platforms.youtube.hero.title',
    highlightKey: 'platforms.youtube.hero.highlight',
    subtitleKey: 'platforms.youtube.hero.subtitle',
    agitationKey: 'platforms.youtube.hero.agitation',
  },

  painPoints: [
    {
      id: 'thumbnail-burnout',
      icon: Image,
      titleKey: 'platforms.youtube.painPoints.thumbnailBurnout.title',
      descriptionKey: 'platforms.youtube.painPoints.thumbnailBurnout.description',
    },
    {
      id: 'seo-mystery',
      icon: TrendingUp,
      titleKey: 'platforms.youtube.painPoints.seoMystery.title',
      descriptionKey: 'platforms.youtube.painPoints.seoMystery.description',
    },
    {
      id: 'shorts-chaos',
      icon: Video,
      titleKey: 'platforms.youtube.painPoints.shortsChaos.title',
      descriptionKey: 'platforms.youtube.painPoints.shortsChaos.description',
    },
    {
      id: 'editing-time',
      icon: Scissors,
      titleKey: 'platforms.youtube.painPoints.editingTime.title',
      descriptionKey: 'platforms.youtube.painPoints.editingTime.description',
    },
  ],

  features: [
    {
      id: 'title-hook',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.youtube.features.titleHook.name',
      descriptionKey: 'platforms.youtube.features.titleHook.description',
    },
    {
      id: 'shorts-repurposer',
      icon: Video,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.youtube.features.shortsRepurposer.name',
      descriptionKey: 'platforms.youtube.features.shortsRepurposer.description',
    },
    {
      id: 'seo-optimizer',
      icon: TrendingUp,
      genericNameKey: 'platforms.common.features.seoTool',
      specificNameKey: 'platforms.youtube.features.seoOptimizer.name',
      descriptionKey: 'platforms.youtube.features.seoOptimizer.description',
    },
    {
      id: 'performance-tracker',
      icon: BarChart3,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.youtube.features.performanceTracker.name',
      descriptionKey: 'platforms.youtube.features.performanceTracker.description',
    },
  ],

  useCases: [
    {
      id: 'vloggers',
      icon: Tv,
      titleKey: 'platforms.youtube.useCases.vloggers.title',
      descriptionKey: 'platforms.youtube.useCases.vloggers.description',
      keywords: ['youtube vlogger', 'daily vlog', 'lifestyle youtube'],
    },
    {
      id: 'gamers',
      icon: Gamepad2,
      titleKey: 'platforms.youtube.useCases.gamers.title',
      descriptionKey: 'platforms.youtube.useCases.gamers.description',
      keywords: ['gaming youtube', 'game streaming', 'lets play'],
    },
    {
      id: 'educators',
      icon: GraduationCap,
      titleKey: 'platforms.youtube.useCases.educators.title',
      descriptionKey: 'platforms.youtube.useCases.educators.description',
      keywords: ['educational youtube', 'tutorial channel', 'online courses'],
    },
    {
      id: 'musicians',
      icon: Music,
      titleKey: 'platforms.youtube.useCases.musicians.title',
      descriptionKey: 'platforms.youtube.useCases.musicians.description',
      keywords: ['music youtube', 'music promotion', 'artist channel'],
    },
  ],

  faqs: [
    {
      id: 'shorts-scheduling',
      questionKey: 'platforms.youtube.faqs.shortsScheduling.question',
      answerKey: 'platforms.youtube.faqs.shortsScheduling.answer',
    },
    {
      id: 'thumbnail-generation',
      questionKey: 'platforms.youtube.faqs.thumbnailGeneration.question',
      answerKey: 'platforms.youtube.faqs.thumbnailGeneration.answer',
    },
    {
      id: 'monetization-impact',
      questionKey: 'platforms.youtube.faqs.monetizationImpact.question',
      answerKey: 'platforms.youtube.faqs.monetizationImpact.answer',
    },
    {
      id: 'description-seo',
      questionKey: 'platforms.youtube.faqs.descriptionSeo.question',
      answerKey: 'platforms.youtube.faqs.descriptionSeo.answer',
    },
    {
      id: 'premiere-support',
      questionKey: 'platforms.youtube.faqs.premiereSupport.question',
      answerKey: 'platforms.youtube.faqs.premiereSupport.answer',
    },
  ],

  competitor: {
    name: 'VidIQ & TubeBuddy',
    attackKey: 'platforms.youtube.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'tiktok',
      headlineKey: 'platforms.youtube.crossLinks.tiktok.headline',
      bodyKey: 'platforms.youtube.crossLinks.tiktok.body',
    },
    {
      targetPlatform: 'instagram',
      headlineKey: 'platforms.youtube.crossLinks.instagram.headline',
      bodyKey: 'platforms.youtube.crossLinks.instagram.body',
    },
  ],

  seo: {
    titleKey: 'platforms.youtube.seo.title',
    descriptionKey: 'platforms.youtube.seo.description',
    keywords: [
      'youtube shorts scheduler',
      'youtube growth tool',
      'youtube seo',
      'youtube analytics',
      'youtube automation',
      'youtube thumbnail',
      'shorts repurposing',
      'youtube marketing',
    ],
  },
}
