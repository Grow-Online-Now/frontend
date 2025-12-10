import {
  Cloud,
  TrendingUp,
  Sparkles,
  Clock,
  Users,
  Rocket,
  Code,
  Globe,
  Shield,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { blueskyTheme } from './themes'

export const blueskyConfig: PlatformConfig = {
  slug: 'bluesky',
  nameKey: 'platforms.bluesky.name',
  icon: Cloud, // Using Cloud as Bluesky icon placeholder

  theme: blueskyTheme,

  hero: {
    titleKey: 'platforms.bluesky.hero.title',
    highlightKey: 'platforms.bluesky.hero.highlight',
    subtitleKey: 'platforms.bluesky.hero.subtitle',
    agitationKey: 'platforms.bluesky.hero.agitation',
  },

  painPoints: [
    {
      id: 'algorithm-learning',
      icon: TrendingUp,
      titleKey: 'platforms.bluesky.painPoints.algorithmLearning.title',
      descriptionKey: 'platforms.bluesky.painPoints.algorithmLearning.description',
    },
    {
      id: 'small-audience',
      icon: Users,
      titleKey: 'platforms.bluesky.painPoints.smallAudience.title',
      descriptionKey: 'platforms.bluesky.painPoints.smallAudience.description',
    },
    {
      id: 'feed-complexity',
      icon: Code,
      titleKey: 'platforms.bluesky.painPoints.feedComplexity.title',
      descriptionKey: 'platforms.bluesky.painPoints.feedComplexity.description',
    },
    {
      id: 'migration-challenge',
      icon: Globe,
      titleKey: 'platforms.bluesky.painPoints.migrationChallenge.title',
      descriptionKey: 'platforms.bluesky.painPoints.migrationChallenge.description',
    },
  ],

  features: [
    {
      id: 'feed-trainer',
      icon: TrendingUp,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.bluesky.features.feedTrainer.name',
      descriptionKey: 'platforms.bluesky.features.feedTrainer.description',
    },
    {
      id: 'at-protocol',
      icon: Code,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.bluesky.features.atProtocol.name',
      descriptionKey: 'platforms.bluesky.features.atProtocol.description',
    },
    {
      id: 'ai-posts',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.bluesky.features.aiPosts.name',
      descriptionKey: 'platforms.bluesky.features.aiPosts.description',
    },
    {
      id: 'growth-scheduler',
      icon: Clock,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.bluesky.features.growthScheduler.name',
      descriptionKey: 'platforms.bluesky.features.growthScheduler.description',
    },
  ],

  useCases: [
    {
      id: 'early-movers',
      icon: Rocket,
      titleKey: 'platforms.bluesky.useCases.earlyMovers.title',
      descriptionKey: 'platforms.bluesky.useCases.earlyMovers.description',
      keywords: ['bluesky early adopter', 'decentralized social', 'twitter alternative'],
    },
    {
      id: 'developers',
      icon: Code,
      titleKey: 'platforms.bluesky.useCases.developers.title',
      descriptionKey: 'platforms.bluesky.useCases.developers.description',
      keywords: ['bluesky developers', 'at protocol', 'decentralized apps'],
    },
    {
      id: 'privacy-focused',
      icon: Shield,
      titleKey: 'platforms.bluesky.useCases.privacyFocused.title',
      descriptionKey: 'platforms.bluesky.useCases.privacyFocused.description',
      keywords: ['privacy social media', 'decentralized identity', 'data ownership'],
    },
    {
      id: 'twitter-migrants',
      icon: Globe,
      titleKey: 'platforms.bluesky.useCases.twitterMigrants.title',
      descriptionKey: 'platforms.bluesky.useCases.twitterMigrants.description',
      keywords: ['twitter to bluesky', 'x alternative', 'twitter migration'],
    },
  ],

  faqs: [
    {
      id: 'at-protocol',
      questionKey: 'platforms.bluesky.faqs.atProtocol.question',
      answerKey: 'platforms.bluesky.faqs.atProtocol.answer',
    },
    {
      id: 'scheduling-support',
      questionKey: 'platforms.bluesky.faqs.schedulingSupport.question',
      answerKey: 'platforms.bluesky.faqs.schedulingSupport.answer',
    },
    {
      id: 'custom-feeds',
      questionKey: 'platforms.bluesky.faqs.customFeeds.question',
      answerKey: 'platforms.bluesky.faqs.customFeeds.answer',
    },
    {
      id: 'cross-posting',
      questionKey: 'platforms.bluesky.faqs.crossPosting.question',
      answerKey: 'platforms.bluesky.faqs.crossPosting.answer',
    },
    {
      id: 'verification',
      questionKey: 'platforms.bluesky.faqs.verification.question',
      answerKey: 'platforms.bluesky.faqs.verification.answer',
    },
  ],

  competitor: {
    name: 'No direct competitor',
    attackKey: 'platforms.bluesky.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'x',
      headlineKey: 'platforms.bluesky.crossLinks.x.headline',
      bodyKey: 'platforms.bluesky.crossLinks.x.body',
    },
    {
      targetPlatform: 'threads',
      headlineKey: 'platforms.bluesky.crossLinks.threads.headline',
      bodyKey: 'platforms.bluesky.crossLinks.threads.body',
    },
  ],

  seo: {
    titleKey: 'platforms.bluesky.seo.title',
    descriptionKey: 'platforms.bluesky.seo.description',
    keywords: [
      'bluesky scheduler',
      'bluesky growth',
      'at protocol',
      'decentralized social',
      'bluesky automation',
      'bluesky analytics',
      'twitter alternative',
      'bluesky marketing',
    ],
  },
}
