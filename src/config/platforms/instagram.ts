import {
  Instagram,
  Grid3X3,
  Hash,
  Heart,
  TrendingUp,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Briefcase,
  Utensils,
  Dumbbell,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { instagramTheme } from './themes'

export const instagramConfig: PlatformConfig = {
  slug: 'instagram',
  nameKey: 'platforms.instagram.name',
  icon: Instagram,

  theme: instagramTheme,

  hero: {
    titleKey: 'platforms.instagram.hero.title',
    highlightKey: 'platforms.instagram.hero.highlight',
    subtitleKey: 'platforms.instagram.hero.subtitle',
    agitationKey: 'platforms.instagram.hero.agitation',
  },

  painPoints: [
    {
      id: 'messy-feed',
      icon: Grid3X3,
      titleKey: 'platforms.instagram.painPoints.messyFeed.title',
      descriptionKey: 'platforms.instagram.painPoints.messyFeed.description',
    },
    {
      id: 'engagement-drop',
      icon: TrendingUp,
      titleKey: 'platforms.instagram.painPoints.engagementDrop.title',
      descriptionKey: 'platforms.instagram.painPoints.engagementDrop.description',
    },
    {
      id: 'hashtag-chaos',
      icon: Hash,
      titleKey: 'platforms.instagram.painPoints.hashtagChaos.title',
      descriptionKey: 'platforms.instagram.painPoints.hashtagChaos.description',
    },
    {
      id: 'algorithm-ignore',
      icon: Heart,
      titleKey: 'platforms.instagram.painPoints.algorithmIgnore.title',
      descriptionKey: 'platforms.instagram.painPoints.algorithmIgnore.description',
    },
  ],

  features: [
    {
      id: 'caption-architect',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.instagram.features.captionArchitect.name',
      descriptionKey: 'platforms.instagram.features.captionArchitect.description',
    },
    {
      id: 'grid-planner',
      icon: Grid3X3,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.instagram.features.gridPlanner.name',
      descriptionKey: 'platforms.instagram.features.gridPlanner.description',
    },
    {
      id: 'hashtag-finder',
      icon: Hash,
      genericNameKey: 'platforms.common.features.hashtagTool',
      specificNameKey: 'platforms.instagram.features.hashtagFinder.name',
      descriptionKey: 'platforms.instagram.features.hashtagFinder.description',
    },
    {
      id: 'aesthetic-analytics',
      icon: BarChart3,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.instagram.features.aestheticAnalytics.name',
      descriptionKey: 'platforms.instagram.features.aestheticAnalytics.description',
    },
  ],

  useCases: [
    {
      id: 'ecommerce',
      icon: ShoppingBag,
      titleKey: 'platforms.instagram.useCases.ecommerce.title',
      descriptionKey: 'platforms.instagram.useCases.ecommerce.description',
      keywords: ['instagram for ecommerce', 'instagram shop', 'product photography'],
    },
    {
      id: 'coaches',
      icon: Briefcase,
      titleKey: 'platforms.instagram.useCases.coaches.title',
      descriptionKey: 'platforms.instagram.useCases.coaches.description',
      keywords: ['instagram for coaches', 'coaching business instagram'],
    },
    {
      id: 'restaurants',
      icon: Utensils,
      titleKey: 'platforms.instagram.useCases.restaurants.title',
      descriptionKey: 'platforms.instagram.useCases.restaurants.description',
      keywords: ['restaurant instagram', 'food photography', 'local business'],
    },
    {
      id: 'fitness',
      icon: Dumbbell,
      titleKey: 'platforms.instagram.useCases.fitness.title',
      descriptionKey: 'platforms.instagram.useCases.fitness.description',
      keywords: ['fitness influencer', 'gym instagram', 'personal trainer'],
    },
  ],

  faqs: [
    {
      id: 'auto-post-reels',
      questionKey: 'platforms.instagram.faqs.autoPostReels.question',
      answerKey: 'platforms.instagram.faqs.autoPostReels.answer',
    },
    {
      id: 'carousel-support',
      questionKey: 'platforms.instagram.faqs.carouselSupport.question',
      answerKey: 'platforms.instagram.faqs.carouselSupport.answer',
    },
    {
      id: 'hashtag-limit',
      questionKey: 'platforms.instagram.faqs.hashtagLimit.question',
      answerKey: 'platforms.instagram.faqs.hashtagLimit.answer',
    },
    {
      id: 'first-comment',
      questionKey: 'platforms.instagram.faqs.firstComment.question',
      answerKey: 'platforms.instagram.faqs.firstComment.answer',
    },
    {
      id: 'stories-scheduling',
      questionKey: 'platforms.instagram.faqs.storiesScheduling.question',
      answerKey: 'platforms.instagram.faqs.storiesScheduling.answer',
    },
  ],

  competitor: {
    name: 'Later & Planoly',
    attackKey: 'platforms.instagram.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'tiktok',
      headlineKey: 'platforms.instagram.crossLinks.tiktok.headline',
      bodyKey: 'platforms.instagram.crossLinks.tiktok.body',
    },
    {
      targetPlatform: 'facebook',
      headlineKey: 'platforms.instagram.crossLinks.facebook.headline',
      bodyKey: 'platforms.instagram.crossLinks.facebook.body',
    },
  ],

  seo: {
    titleKey: 'platforms.instagram.seo.title',
    descriptionKey: 'platforms.instagram.seo.description',
    keywords: [
      'instagram scheduler',
      'instagram growth tool',
      'instagram reels scheduler',
      'instagram analytics',
      'instagram hashtag finder',
      'instagram grid planner',
      'instagram automation',
    ],
  },
}
