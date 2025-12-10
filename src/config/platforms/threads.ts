import {
  AtSign,
  MessageSquare,
  TrendingUp,
  Sparkles,
  BarChart3,
  Clock,
  Users,
  Rocket,
  Building2,
  Lightbulb,
  Globe,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { threadsTheme } from './themes'

export const threadsConfig: PlatformConfig = {
  slug: 'threads',
  nameKey: 'platforms.threads.name',
  icon: AtSign, // Using AtSign as Threads icon placeholder

  theme: threadsTheme,

  hero: {
    titleKey: 'platforms.threads.hero.title',
    highlightKey: 'platforms.threads.hero.highlight',
    subtitleKey: 'platforms.threads.hero.subtitle',
    agitationKey: 'platforms.threads.hero.agitation',
  },

  painPoints: [
    {
      id: 'new-platform',
      icon: Rocket,
      titleKey: 'platforms.threads.painPoints.newPlatform.title',
      descriptionKey: 'platforms.threads.painPoints.newPlatform.description',
    },
    {
      id: 'algorithm-unknown',
      icon: TrendingUp,
      titleKey: 'platforms.threads.painPoints.algorithmUnknown.title',
      descriptionKey: 'platforms.threads.painPoints.algorithmUnknown.description',
    },
    {
      id: 'cross-platform',
      icon: Globe,
      titleKey: 'platforms.threads.painPoints.crossPlatform.title',
      descriptionKey: 'platforms.threads.painPoints.crossPlatform.description',
    },
    {
      id: 'content-strategy',
      icon: Lightbulb,
      titleKey: 'platforms.threads.painPoints.contentStrategy.title',
      descriptionKey: 'platforms.threads.painPoints.contentStrategy.description',
    },
  ],

  features: [
    {
      id: 'cross-post-ai',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.threads.features.crossPostAi.name',
      descriptionKey: 'platforms.threads.features.crossPostAi.description',
    },
    {
      id: 'thread-formatter',
      icon: MessageSquare,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.threads.features.threadFormatter.name',
      descriptionKey: 'platforms.threads.features.threadFormatter.description',
    },
    {
      id: 'early-analytics',
      icon: BarChart3,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.threads.features.earlyAnalytics.name',
      descriptionKey: 'platforms.threads.features.earlyAnalytics.description',
    },
    {
      id: 'smart-timing',
      icon: Clock,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.threads.features.smartTiming.name',
      descriptionKey: 'platforms.threads.features.smartTiming.description',
    },
  ],

  useCases: [
    {
      id: 'early-adopters',
      icon: Rocket,
      titleKey: 'platforms.threads.useCases.earlyAdopters.title',
      descriptionKey: 'platforms.threads.useCases.earlyAdopters.description',
      keywords: ['threads early adopter', 'new social platform', 'threads growth'],
    },
    {
      id: 'brands',
      icon: Building2,
      titleKey: 'platforms.threads.useCases.brands.title',
      descriptionKey: 'platforms.threads.useCases.brands.description',
      keywords: ['threads for brands', 'brand threads', 'corporate threads'],
    },
    {
      id: 'creators',
      icon: Users,
      titleKey: 'platforms.threads.useCases.creators.title',
      descriptionKey: 'platforms.threads.useCases.creators.description',
      keywords: ['threads creators', 'instagram to threads', 'multi-platform'],
    },
    {
      id: 'thought-leaders',
      icon: Lightbulb,
      titleKey: 'platforms.threads.useCases.thoughtLeaders.title',
      descriptionKey: 'platforms.threads.useCases.thoughtLeaders.description',
      keywords: ['threads thought leadership', 'threads opinions', 'conversation'],
    },
  ],

  faqs: [
    {
      id: 'instagram-required',
      questionKey: 'platforms.threads.faqs.instagramRequired.question',
      answerKey: 'platforms.threads.faqs.instagramRequired.answer',
    },
    {
      id: 'scheduling-support',
      questionKey: 'platforms.threads.faqs.schedulingSupport.question',
      answerKey: 'platforms.threads.faqs.schedulingSupport.answer',
    },
    {
      id: 'analytics-available',
      questionKey: 'platforms.threads.faqs.analyticsAvailable.question',
      answerKey: 'platforms.threads.faqs.analyticsAvailable.answer',
    },
    {
      id: 'cross-posting',
      questionKey: 'platforms.threads.faqs.crossPosting.question',
      answerKey: 'platforms.threads.faqs.crossPosting.answer',
    },
    {
      id: 'character-limit',
      questionKey: 'platforms.threads.faqs.characterLimit.question',
      answerKey: 'platforms.threads.faqs.characterLimit.answer',
    },
  ],

  competitor: {
    name: 'No direct competitor',
    attackKey: 'platforms.threads.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'instagram',
      headlineKey: 'platforms.threads.crossLinks.instagram.headline',
      bodyKey: 'platforms.threads.crossLinks.instagram.body',
    },
    {
      targetPlatform: 'x',
      headlineKey: 'platforms.threads.crossLinks.x.headline',
      bodyKey: 'platforms.threads.crossLinks.x.body',
    },
  ],

  seo: {
    titleKey: 'platforms.threads.seo.title',
    descriptionKey: 'platforms.threads.seo.description',
    keywords: [
      'threads scheduler',
      'threads growth',
      'threads by meta',
      'threads automation',
      'threads analytics',
      'threads marketing',
      'instagram threads',
      'threads app',
    ],
  },
}
