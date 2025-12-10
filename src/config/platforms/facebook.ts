import {
  Facebook,
  Users,
  TrendingUp,
  Video,
  Sparkles,
  Clock,
  MessageCircle,
  Store,
  Building2,
  HeartHandshake,
  Newspaper,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { facebookTheme } from './themes'

export const facebookConfig: PlatformConfig = {
  slug: 'facebook',
  nameKey: 'platforms.facebook.name',
  icon: Facebook,

  theme: facebookTheme,

  hero: {
    titleKey: 'platforms.facebook.hero.title',
    highlightKey: 'platforms.facebook.hero.highlight',
    subtitleKey: 'platforms.facebook.hero.subtitle',
    agitationKey: 'platforms.facebook.hero.agitation',
  },

  painPoints: [
    {
      id: 'organic-death',
      icon: TrendingUp,
      titleKey: 'platforms.facebook.painPoints.organicDeath.title',
      descriptionKey: 'platforms.facebook.painPoints.organicDeath.description',
    },
    {
      id: 'group-fatigue',
      icon: Users,
      titleKey: 'platforms.facebook.painPoints.groupFatigue.title',
      descriptionKey: 'platforms.facebook.painPoints.groupFatigue.description',
    },
    {
      id: 'reels-transition',
      icon: Video,
      titleKey: 'platforms.facebook.painPoints.reelsTransition.title',
      descriptionKey: 'platforms.facebook.painPoints.reelsTransition.description',
    },
    {
      id: 'cross-posting',
      icon: MessageCircle,
      titleKey: 'platforms.facebook.painPoints.crossPosting.title',
      descriptionKey: 'platforms.facebook.painPoints.crossPosting.description',
    },
  ],

  features: [
    {
      id: 'community-pulse',
      icon: Users,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.facebook.features.communityPulse.name',
      descriptionKey: 'platforms.facebook.features.communityPulse.description',
    },
    {
      id: 'reel-crosspost',
      icon: Video,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.facebook.features.reelCrosspost.name',
      descriptionKey: 'platforms.facebook.features.reelCrosspost.description',
    },
    {
      id: 'group-scheduler',
      icon: Clock,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.facebook.features.groupScheduler.name',
      descriptionKey: 'platforms.facebook.features.groupScheduler.description',
    },
    {
      id: 'ai-captions',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.facebook.features.aiCaptions.name',
      descriptionKey: 'platforms.facebook.features.aiCaptions.description',
    },
  ],

  useCases: [
    {
      id: 'local-business',
      icon: Store,
      titleKey: 'platforms.facebook.useCases.localBusiness.title',
      descriptionKey: 'platforms.facebook.useCases.localBusiness.description',
      keywords: ['local business facebook', 'facebook marketing local', 'small business'],
    },
    {
      id: 'agencies',
      icon: Building2,
      titleKey: 'platforms.facebook.useCases.agencies.title',
      descriptionKey: 'platforms.facebook.useCases.agencies.description',
      keywords: ['facebook agency', 'social media agency', 'client management'],
    },
    {
      id: 'nonprofits',
      icon: HeartHandshake,
      titleKey: 'platforms.facebook.useCases.nonprofits.title',
      descriptionKey: 'platforms.facebook.useCases.nonprofits.description',
      keywords: ['nonprofit facebook', 'charity social media', 'fundraising'],
    },
    {
      id: 'publishers',
      icon: Newspaper,
      titleKey: 'platforms.facebook.useCases.publishers.title',
      descriptionKey: 'platforms.facebook.useCases.publishers.description',
      keywords: ['facebook publishing', 'news facebook', 'content distribution'],
    },
  ],

  faqs: [
    {
      id: 'page-vs-profile',
      questionKey: 'platforms.facebook.faqs.pageVsProfile.question',
      answerKey: 'platforms.facebook.faqs.pageVsProfile.answer',
    },
    {
      id: 'group-posting',
      questionKey: 'platforms.facebook.faqs.groupPosting.question',
      answerKey: 'platforms.facebook.faqs.groupPosting.answer',
    },
    {
      id: 'reels-auto-post',
      questionKey: 'platforms.facebook.faqs.reelsAutoPost.question',
      answerKey: 'platforms.facebook.faqs.reelsAutoPost.answer',
    },
    {
      id: 'instagram-sync',
      questionKey: 'platforms.facebook.faqs.instagramSync.question',
      answerKey: 'platforms.facebook.faqs.instagramSync.answer',
    },
    {
      id: 'stories-support',
      questionKey: 'platforms.facebook.faqs.storiesSupport.question',
      answerKey: 'platforms.facebook.faqs.storiesSupport.answer',
    },
  ],

  competitor: {
    name: 'Meta Business Suite',
    attackKey: 'platforms.facebook.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'instagram',
      headlineKey: 'platforms.facebook.crossLinks.instagram.headline',
      bodyKey: 'platforms.facebook.crossLinks.instagram.body',
    },
    {
      targetPlatform: 'threads',
      headlineKey: 'platforms.facebook.crossLinks.threads.headline',
      bodyKey: 'platforms.facebook.crossLinks.threads.body',
    },
  ],

  seo: {
    titleKey: 'platforms.facebook.seo.title',
    descriptionKey: 'platforms.facebook.seo.description',
    keywords: [
      'facebook scheduler',
      'facebook growth tool',
      'facebook groups',
      'facebook reels',
      'facebook automation',
      'facebook analytics',
      'facebook marketing',
      'meta business',
    ],
  },
}
