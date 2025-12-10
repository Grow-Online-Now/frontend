import {
  Twitter,
  MessageSquare,
  TrendingUp,
  Zap,
  Sparkles,
  BarChart3,
  Clock,
  Newspaper,
  DollarSign,
  Radio,
  Megaphone,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { xTheme } from './themes'

export const xConfig: PlatformConfig = {
  slug: 'x',
  nameKey: 'platforms.x.name',
  icon: Twitter, // Using Twitter icon from Lucide

  theme: xTheme,

  hero: {
    titleKey: 'platforms.x.hero.title',
    highlightKey: 'platforms.x.hero.highlight',
    subtitleKey: 'platforms.x.hero.subtitle',
    agitationKey: 'platforms.x.hero.agitation',
  },

  painPoints: [
    {
      id: 'thread-formatting',
      icon: MessageSquare,
      titleKey: 'platforms.x.painPoints.threadFormatting.title',
      descriptionKey: 'platforms.x.painPoints.threadFormatting.description',
    },
    {
      id: 'timing-game',
      icon: Clock,
      titleKey: 'platforms.x.painPoints.timingGame.title',
      descriptionKey: 'platforms.x.painPoints.timingGame.description',
    },
    {
      id: 'engagement-chaos',
      icon: Zap,
      titleKey: 'platforms.x.painPoints.engagementChaos.title',
      descriptionKey: 'platforms.x.painPoints.engagementChaos.description',
    },
    {
      id: 'algorithm-shifts',
      icon: TrendingUp,
      titleKey: 'platforms.x.painPoints.algorithmShifts.title',
      descriptionKey: 'platforms.x.painPoints.algorithmShifts.description',
    },
  ],

  features: [
    {
      id: 'thread-builder',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.x.features.threadBuilder.name',
      descriptionKey: 'platforms.x.features.threadBuilder.description',
    },
    {
      id: 'engagement-radar',
      icon: BarChart3,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.x.features.engagementRadar.name',
      descriptionKey: 'platforms.x.features.engagementRadar.description',
    },
    {
      id: 'hook-generator',
      icon: Zap,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.x.features.hookGenerator.name',
      descriptionKey: 'platforms.x.features.hookGenerator.description',
    },
    {
      id: 'prime-scheduler',
      icon: Clock,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.x.features.primeScheduler.name',
      descriptionKey: 'platforms.x.features.primeScheduler.description',
    },
  ],

  useCases: [
    {
      id: 'journalists',
      icon: Newspaper,
      titleKey: 'platforms.x.useCases.journalists.title',
      descriptionKey: 'platforms.x.useCases.journalists.description',
      keywords: ['twitter for journalists', 'news twitter', 'media twitter'],
    },
    {
      id: 'creators-monetizing',
      icon: DollarSign,
      titleKey: 'platforms.x.useCases.creatorsMonetizing.title',
      descriptionKey: 'platforms.x.useCases.creatorsMonetizing.description',
      keywords: ['twitter monetization', 'x premium', 'creator economy twitter'],
    },
    {
      id: 'podcasters',
      icon: Radio,
      titleKey: 'platforms.x.useCases.podcasters.title',
      descriptionKey: 'platforms.x.useCases.podcasters.description',
      keywords: ['podcast promotion twitter', 'podcaster twitter', 'audio clips'],
    },
    {
      id: 'brands',
      icon: Megaphone,
      titleKey: 'platforms.x.useCases.brands.title',
      descriptionKey: 'platforms.x.useCases.brands.description',
      keywords: ['brand twitter', 'corporate twitter', 'twitter marketing'],
    },
  ],

  faqs: [
    {
      id: 'thread-auto-publish',
      questionKey: 'platforms.x.faqs.threadAutoPublish.question',
      answerKey: 'platforms.x.faqs.threadAutoPublish.answer',
    },
    {
      id: 'api-limits',
      questionKey: 'platforms.x.faqs.apiLimits.question',
      answerKey: 'platforms.x.faqs.apiLimits.answer',
    },
    {
      id: 'media-support',
      questionKey: 'platforms.x.faqs.mediaSupport.question',
      answerKey: 'platforms.x.faqs.mediaSupport.answer',
    },
    {
      id: 'spaces-integration',
      questionKey: 'platforms.x.faqs.spacesIntegration.question',
      answerKey: 'platforms.x.faqs.spacesIntegration.answer',
    },
    {
      id: 'premium-features',
      questionKey: 'platforms.x.faqs.premiumFeatures.question',
      answerKey: 'platforms.x.faqs.premiumFeatures.answer',
    },
  ],

  competitor: {
    name: 'Typefully & Hypefury',
    attackKey: 'platforms.x.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'linkedin',
      headlineKey: 'platforms.x.crossLinks.linkedin.headline',
      bodyKey: 'platforms.x.crossLinks.linkedin.body',
    },
    {
      targetPlatform: 'bluesky',
      headlineKey: 'platforms.x.crossLinks.bluesky.headline',
      bodyKey: 'platforms.x.crossLinks.bluesky.body',
    },
  ],

  seo: {
    titleKey: 'platforms.x.seo.title',
    descriptionKey: 'platforms.x.seo.description',
    keywords: [
      'twitter growth',
      'x growth tool',
      'twitter scheduler',
      'twitter threads',
      'twitter automation',
      'twitter analytics',
      'x premium',
      'tweet scheduling',
    ],
  },
}
