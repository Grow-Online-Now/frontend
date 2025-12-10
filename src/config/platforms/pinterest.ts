import {
  Image,
  Search,
  Calendar,
  BarChart3,
  Grid3X3,
  ShoppingBag,
  Home,
  Palette,
  Utensils,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { pinterestTheme } from './themes'

// Using a custom icon approach since Lucide doesn't have Pinterest
const PinterestIcon = Image // Placeholder

export const pinterestConfig: PlatformConfig = {
  slug: 'pinterest',
  nameKey: 'platforms.pinterest.name',
  icon: PinterestIcon,

  theme: pinterestTheme,

  hero: {
    titleKey: 'platforms.pinterest.hero.title',
    highlightKey: 'platforms.pinterest.hero.highlight',
    subtitleKey: 'platforms.pinterest.hero.subtitle',
    agitationKey: 'platforms.pinterest.hero.agitation',
  },

  painPoints: [
    {
      id: 'seo-heavy',
      icon: Search,
      titleKey: 'platforms.pinterest.painPoints.seoHeavy.title',
      descriptionKey: 'platforms.pinterest.painPoints.seoHeavy.description',
    },
    {
      id: 'seasonal-timing',
      icon: Calendar,
      titleKey: 'platforms.pinterest.painPoints.seasonalTiming.title',
      descriptionKey: 'platforms.pinterest.painPoints.seasonalTiming.description',
    },
    {
      id: 'pin-design',
      icon: Image,
      titleKey: 'platforms.pinterest.painPoints.pinDesign.title',
      descriptionKey: 'platforms.pinterest.painPoints.pinDesign.description',
    },
    {
      id: 'board-strategy',
      icon: Grid3X3,
      titleKey: 'platforms.pinterest.painPoints.boardStrategy.title',
      descriptionKey: 'platforms.pinterest.painPoints.boardStrategy.description',
    },
  ],

  features: [
    {
      id: 'pin-seo',
      icon: Search,
      genericNameKey: 'platforms.common.features.seoTool',
      specificNameKey: 'platforms.pinterest.features.pinSeo.name',
      descriptionKey: 'platforms.pinterest.features.pinSeo.description',
    },
    {
      id: 'board-strategy',
      icon: Grid3X3,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.pinterest.features.boardStrategy.name',
      descriptionKey: 'platforms.pinterest.features.boardStrategy.description',
    },
    {
      id: 'seasonal-planner',
      icon: Calendar,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.pinterest.features.seasonalPlanner.name',
      descriptionKey: 'platforms.pinterest.features.seasonalPlanner.description',
    },
    {
      id: 'visual-analytics',
      icon: BarChart3,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.pinterest.features.visualAnalytics.name',
      descriptionKey: 'platforms.pinterest.features.visualAnalytics.description',
    },
  ],

  useCases: [
    {
      id: 'ecommerce',
      icon: ShoppingBag,
      titleKey: 'platforms.pinterest.useCases.ecommerce.title',
      descriptionKey: 'platforms.pinterest.useCases.ecommerce.description',
      keywords: ['pinterest ecommerce', 'pinterest shopping', 'product pins'],
    },
    {
      id: 'home-decor',
      icon: Home,
      titleKey: 'platforms.pinterest.useCases.homeDecor.title',
      descriptionKey: 'platforms.pinterest.useCases.homeDecor.description',
      keywords: ['home decor pinterest', 'interior design', 'diy pinterest'],
    },
    {
      id: 'creatives',
      icon: Palette,
      titleKey: 'platforms.pinterest.useCases.creatives.title',
      descriptionKey: 'platforms.pinterest.useCases.creatives.description',
      keywords: ['creative pinterest', 'artist pinterest', 'design portfolio'],
    },
    {
      id: 'food-bloggers',
      icon: Utensils,
      titleKey: 'platforms.pinterest.useCases.foodBloggers.title',
      descriptionKey: 'platforms.pinterest.useCases.foodBloggers.description',
      keywords: ['food blogger pinterest', 'recipe pins', 'food photography'],
    },
  ],

  faqs: [
    {
      id: 'idea-pins',
      questionKey: 'platforms.pinterest.faqs.ideaPins.question',
      answerKey: 'platforms.pinterest.faqs.ideaPins.answer',
    },
    {
      id: 'scheduling-frequency',
      questionKey: 'platforms.pinterest.faqs.schedulingFrequency.question',
      answerKey: 'platforms.pinterest.faqs.schedulingFrequency.answer',
    },
    {
      id: 'rich-pins',
      questionKey: 'platforms.pinterest.faqs.richPins.question',
      answerKey: 'platforms.pinterest.faqs.richPins.answer',
    },
    {
      id: 'keyword-research',
      questionKey: 'platforms.pinterest.faqs.keywordResearch.question',
      answerKey: 'platforms.pinterest.faqs.keywordResearch.answer',
    },
    {
      id: 'video-pins',
      questionKey: 'platforms.pinterest.faqs.videoPins.question',
      answerKey: 'platforms.pinterest.faqs.videoPins.answer',
    },
  ],

  competitor: {
    name: 'Tailwind',
    attackKey: 'platforms.pinterest.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'instagram',
      headlineKey: 'platforms.pinterest.crossLinks.instagram.headline',
      bodyKey: 'platforms.pinterest.crossLinks.instagram.body',
    },
    {
      targetPlatform: 'youtube',
      headlineKey: 'platforms.pinterest.crossLinks.youtube.headline',
      bodyKey: 'platforms.pinterest.crossLinks.youtube.body',
    },
  ],

  seo: {
    titleKey: 'platforms.pinterest.seo.title',
    descriptionKey: 'platforms.pinterest.seo.description',
    keywords: [
      'pinterest scheduler',
      'pinterest growth',
      'pinterest seo',
      'pinterest marketing',
      'pinterest automation',
      'pinterest analytics',
      'pin scheduling',
      'pinterest strategy',
    ],
  },
}
