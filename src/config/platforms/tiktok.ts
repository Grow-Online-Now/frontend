import {
  Video,
  Zap,
  TrendingUp,
  Music,
  Sparkles,
  Clock,
  Scissors,
  ShoppingCart,
  User,
  Monitor,
  Gamepad2,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { tiktokTheme } from './themes'

// Custom TikTok icon since Lucide doesn't have one
const TikTokIcon = Video // Using Video as placeholder

export const tiktokConfig: PlatformConfig = {
  slug: 'tiktok',
  nameKey: 'platforms.tiktok.name',
  icon: TikTokIcon,

  theme: tiktokTheme,

  hero: {
    titleKey: 'platforms.tiktok.hero.title',
    highlightKey: 'platforms.tiktok.hero.highlight',
    subtitleKey: 'platforms.tiktok.hero.subtitle',
    agitationKey: 'platforms.tiktok.hero.agitation',
  },

  painPoints: [
    {
      id: 'editing-nightmare',
      icon: Scissors,
      titleKey: 'platforms.tiktok.painPoints.editingNightmare.title',
      descriptionKey: 'platforms.tiktok.painPoints.editingNightmare.description',
    },
    {
      id: 'trend-chasing',
      icon: TrendingUp,
      titleKey: 'platforms.tiktok.painPoints.trendChasing.title',
      descriptionKey: 'platforms.tiktok.painPoints.trendChasing.description',
    },
    {
      id: 'sound-hunting',
      icon: Music,
      titleKey: 'platforms.tiktok.painPoints.soundHunting.title',
      descriptionKey: 'platforms.tiktok.painPoints.soundHunting.description',
    },
    {
      id: 'fyp-mystery',
      icon: Zap,
      titleKey: 'platforms.tiktok.painPoints.fypMystery.title',
      descriptionKey: 'platforms.tiktok.painPoints.fypMystery.description',
    },
  ],

  features: [
    {
      id: 'script-engine',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.tiktok.features.scriptEngine.name',
      descriptionKey: 'platforms.tiktok.features.scriptEngine.description',
    },
    {
      id: 'viral-detection',
      icon: TrendingUp,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.tiktok.features.viralDetection.name',
      descriptionKey: 'platforms.tiktok.features.viralDetection.description',
    },
    {
      id: 'trend-finder',
      icon: Music,
      genericNameKey: 'platforms.common.features.trendTool',
      specificNameKey: 'platforms.tiktok.features.trendFinder.name',
      descriptionKey: 'platforms.tiktok.features.trendFinder.description',
    },
    {
      id: 'smart-scheduler',
      icon: Clock,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.tiktok.features.smartScheduler.name',
      descriptionKey: 'platforms.tiktok.features.smartScheduler.description',
    },
  ],

  useCases: [
    {
      id: 'ugc-creators',
      icon: User,
      titleKey: 'platforms.tiktok.useCases.ugcCreators.title',
      descriptionKey: 'platforms.tiktok.useCases.ugcCreators.description',
      keywords: ['UGC creator', 'user generated content', 'tiktok ugc'],
    },
    {
      id: 'dropshippers',
      icon: ShoppingCart,
      titleKey: 'platforms.tiktok.useCases.dropshippers.title',
      descriptionKey: 'platforms.tiktok.useCases.dropshippers.description',
      keywords: ['tiktok dropshipping', 'tiktok shop', 'ecommerce tiktok'],
    },
    {
      id: 'faceless-channels',
      icon: Monitor,
      titleKey: 'platforms.tiktok.useCases.facelessChannels.title',
      descriptionKey: 'platforms.tiktok.useCases.facelessChannels.description',
      keywords: ['faceless tiktok', 'faceless content', 'ai generated content'],
    },
    {
      id: 'gaming',
      icon: Gamepad2,
      titleKey: 'platforms.tiktok.useCases.gaming.title',
      descriptionKey: 'platforms.tiktok.useCases.gaming.description',
      keywords: ['gaming tiktok', 'game clips', 'streamer tiktok'],
    },
  ],

  faqs: [
    {
      id: 'shadowban',
      questionKey: 'platforms.tiktok.faqs.shadowban.question',
      answerKey: 'platforms.tiktok.faqs.shadowban.answer',
    },
    {
      id: 'watermark',
      questionKey: 'platforms.tiktok.faqs.watermark.question',
      answerKey: 'platforms.tiktok.faqs.watermark.answer',
    },
    {
      id: 'best-time',
      questionKey: 'platforms.tiktok.faqs.bestTime.question',
      answerKey: 'platforms.tiktok.faqs.bestTime.answer',
    },
    {
      id: 'duet-stitch',
      questionKey: 'platforms.tiktok.faqs.duetStitch.question',
      answerKey: 'platforms.tiktok.faqs.duetStitch.answer',
    },
    {
      id: 'analytics-delay',
      questionKey: 'platforms.tiktok.faqs.analyticsDelay.question',
      answerKey: 'platforms.tiktok.faqs.analyticsDelay.answer',
    },
  ],

  competitor: {
    name: 'Repurpose.io',
    attackKey: 'platforms.tiktok.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'youtube',
      headlineKey: 'platforms.tiktok.crossLinks.youtube.headline',
      bodyKey: 'platforms.tiktok.crossLinks.youtube.body',
    },
    {
      targetPlatform: 'instagram',
      headlineKey: 'platforms.tiktok.crossLinks.instagram.headline',
      bodyKey: 'platforms.tiktok.crossLinks.instagram.body',
    },
  ],

  seo: {
    titleKey: 'platforms.tiktok.seo.title',
    descriptionKey: 'platforms.tiktok.seo.description',
    keywords: [
      'tiktok growth tool',
      'tiktok scheduler',
      'tiktok analytics',
      'tiktok seo',
      'fyp algorithm',
      'tiktok automation',
      'faceless tiktok',
      'viral tiktok',
    ],
  },
}
