import {
  Linkedin,
  FileText,
  Users,
  Sparkles,
  Calendar,
  Target,
  Briefcase,
  Building2,
  GraduationCap,
  Home,
} from 'lucide-react'
import type { PlatformConfig } from './index'
import { linkedinTheme } from './themes'

export const linkedinConfig: PlatformConfig = {
  slug: 'linkedin',
  nameKey: 'platforms.linkedin.name',
  icon: Linkedin,

  theme: linkedinTheme,

  hero: {
    titleKey: 'platforms.linkedin.hero.title',
    highlightKey: 'platforms.linkedin.hero.highlight',
    subtitleKey: 'platforms.linkedin.hero.subtitle',
    agitationKey: 'platforms.linkedin.hero.agitation',
  },

  painPoints: [
    {
      id: 'blank-screen',
      icon: FileText,
      titleKey: 'platforms.linkedin.painPoints.blankScreen.title',
      descriptionKey: 'platforms.linkedin.painPoints.blankScreen.description',
    },
    {
      id: 'broetry-format',
      icon: Users,
      titleKey: 'platforms.linkedin.painPoints.broetryFormat.title',
      descriptionKey: 'platforms.linkedin.painPoints.broetryFormat.description',
    },
    {
      id: 'engagement-timing',
      icon: Calendar,
      titleKey: 'platforms.linkedin.painPoints.engagementTiming.title',
      descriptionKey: 'platforms.linkedin.painPoints.engagementTiming.description',
    },
    {
      id: 'lead-tracking',
      icon: Target,
      titleKey: 'platforms.linkedin.painPoints.leadTracking.title',
      descriptionKey: 'platforms.linkedin.painPoints.leadTracking.description',
    },
  ],

  features: [
    {
      id: 'b2b-ghostwriter',
      icon: Sparkles,
      genericNameKey: 'platforms.common.features.aiWriter',
      specificNameKey: 'platforms.linkedin.features.b2bGhostwriter.name',
      descriptionKey: 'platforms.linkedin.features.b2bGhostwriter.description',
    },
    {
      id: 'lead-signals',
      icon: Target,
      genericNameKey: 'platforms.common.features.analytics',
      specificNameKey: 'platforms.linkedin.features.leadSignals.name',
      descriptionKey: 'platforms.linkedin.features.leadSignals.description',
    },
    {
      id: 'carousel-builder',
      icon: FileText,
      genericNameKey: 'platforms.common.features.contentTool',
      specificNameKey: 'platforms.linkedin.features.carouselBuilder.name',
      descriptionKey: 'platforms.linkedin.features.carouselBuilder.description',
    },
    {
      id: 'authority-scheduler',
      icon: Calendar,
      genericNameKey: 'platforms.common.features.scheduler',
      specificNameKey: 'platforms.linkedin.features.authorityScheduler.name',
      descriptionKey: 'platforms.linkedin.features.authorityScheduler.description',
    },
  ],

  useCases: [
    {
      id: 'saas-founders',
      icon: Building2,
      titleKey: 'platforms.linkedin.useCases.saasFounders.title',
      descriptionKey: 'platforms.linkedin.useCases.saasFounders.description',
      keywords: ['linkedin for saas', 'founder led marketing', 'b2b linkedin'],
    },
    {
      id: 'real-estate',
      icon: Home,
      titleKey: 'platforms.linkedin.useCases.realEstate.title',
      descriptionKey: 'platforms.linkedin.useCases.realEstate.description',
      keywords: ['linkedin for real estate', 'realtor linkedin', 'real estate marketing'],
    },
    {
      id: 'consultants',
      icon: Briefcase,
      titleKey: 'platforms.linkedin.useCases.consultants.title',
      descriptionKey: 'platforms.linkedin.useCases.consultants.description',
      keywords: ['linkedin for consultants', 'consulting leads', 'thought leadership'],
    },
    {
      id: 'coaches',
      icon: GraduationCap,
      titleKey: 'platforms.linkedin.useCases.coaches.title',
      descriptionKey: 'platforms.linkedin.useCases.coaches.description',
      keywords: ['linkedin for coaches', 'executive coaching', 'coaching business'],
    },
  ],

  faqs: [
    {
      id: 'personal-vs-company',
      questionKey: 'platforms.linkedin.faqs.personalVsCompany.question',
      answerKey: 'platforms.linkedin.faqs.personalVsCompany.answer',
    },
    {
      id: 'pdf-carousels',
      questionKey: 'platforms.linkedin.faqs.pdfCarousels.question',
      answerKey: 'platforms.linkedin.faqs.pdfCarousels.answer',
    },
    {
      id: 'connection-limits',
      questionKey: 'platforms.linkedin.faqs.connectionLimits.question',
      answerKey: 'platforms.linkedin.faqs.connectionLimits.answer',
    },
    {
      id: 'linkedin-algorithm',
      questionKey: 'platforms.linkedin.faqs.linkedinAlgorithm.question',
      answerKey: 'platforms.linkedin.faqs.linkedinAlgorithm.answer',
    },
    {
      id: 'newsletter-support',
      questionKey: 'platforms.linkedin.faqs.newsletterSupport.question',
      answerKey: 'platforms.linkedin.faqs.newsletterSupport.answer',
    },
  ],

  competitor: {
    name: 'Taplio & Typefully',
    attackKey: 'platforms.linkedin.competitor.attack',
  },

  crossLinks: [
    {
      targetPlatform: 'x',
      headlineKey: 'platforms.linkedin.crossLinks.x.headline',
      bodyKey: 'platforms.linkedin.crossLinks.x.body',
    },
    {
      targetPlatform: 'threads',
      headlineKey: 'platforms.linkedin.crossLinks.threads.headline',
      bodyKey: 'platforms.linkedin.crossLinks.threads.body',
    },
  ],

  seo: {
    titleKey: 'platforms.linkedin.seo.title',
    descriptionKey: 'platforms.linkedin.seo.description',
    keywords: [
      'linkedin automation',
      'linkedin scheduler',
      'linkedin growth tool',
      'personal branding',
      'b2b marketing',
      'thought leadership',
      'linkedin carousel',
      'linkedin analytics',
    ],
  },
}
