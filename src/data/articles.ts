export interface Article {
  slug: string
  titleKey: string
  descriptionKey: string
  contentKey: string // Base key for article content sections
  category: ArticleCategory
  publishedAt: string // ISO date string
  readingTime: number // minutes
  authorName: string
  authorRole: string
  imageUrl: string
  featured?: boolean
  keywords?: string[]
}

export type ArticleCategory = 'strategy' | 'tips' | 'case-study' | 'news' | 'tutorial' | 'growth'

export const articles: Article[] = [
  {
    slug: 'ultimate-guide-social-media-scheduling-2025',
    titleKey: 'blog.articles.scheduling2025.title',
    descriptionKey: 'blog.articles.scheduling2025.description',
    contentKey: 'blog.articles.scheduling2025.content',
    category: 'strategy',
    publishedAt: '2025-12-11',
    readingTime: 12,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/guide.webp',
    featured: true,
    keywords: ['social media scheduling', 'content calendar', 'best time to post', 'automation'],
  },
  {
    slug: 'how-ai-is-transforming-content-creation',
    titleKey: 'blog.articles.aiContent.title',
    descriptionKey: 'blog.articles.aiContent.description',
    contentKey: 'blog.articles.aiContent.content',
    category: 'news',
    publishedAt: '2025-12-10',
    readingTime: 8,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/growth.webp',
    featured: true,
    keywords: [
      'AI content creation',
      'artificial intelligence',
      'content automation',
      'machine learning',
    ],
  },
  {
    slug: 'instagram-algorithm-secrets-creators-need-know',
    titleKey: 'blog.articles.instagramAlgo.title',
    descriptionKey: 'blog.articles.instagramAlgo.description',
    contentKey: 'blog.articles.instagramAlgo.content',
    category: 'tips',
    publishedAt: '2025-12-09',
    readingTime: 10,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/instagram.webp',
    keywords: ['Instagram algorithm', 'Instagram growth', 'engagement', 'reach'],
  },
  {
    slug: 'case-study-10x-engagement-90-days',
    titleKey: 'blog.articles.caseStudy10x.title',
    descriptionKey: 'blog.articles.caseStudy10x.description',
    contentKey: 'blog.articles.caseStudy10x.content',
    category: 'case-study',
    publishedAt: '2025-12-08',
    readingTime: 15,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/engagement.webp',
    keywords: ['case study', 'engagement growth', 'social media success', 'growth strategy'],
  },
  {
    slug: 'tiktok-growth-hacks-that-actually-work',
    titleKey: 'blog.articles.tiktokGrowth.title',
    descriptionKey: 'blog.articles.tiktokGrowth.description',
    contentKey: 'blog.articles.tiktokGrowth.content',
    category: 'growth',
    publishedAt: '2025-12-07',
    readingTime: 9,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/tiktok.webp',
    keywords: ['TikTok growth', 'TikTok algorithm', 'viral content', 'short-form video'],
  },
  {
    slug: 'complete-guide-linkedin-personal-branding',
    titleKey: 'blog.articles.linkedinBranding.title',
    descriptionKey: 'blog.articles.linkedinBranding.description',
    contentKey: 'blog.articles.linkedinBranding.content',
    category: 'tutorial',
    publishedAt: '2025-12-06',
    readingTime: 11,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/linkedin.webp',
    keywords: ['LinkedIn', 'personal branding', 'professional network', 'B2B marketing'],
  },
  {
    slug: 'why-consistency-beats-virality',
    titleKey: 'blog.articles.consistencyWins.title',
    descriptionKey: 'blog.articles.consistencyWins.description',
    contentKey: 'blog.articles.consistencyWins.content',
    category: 'strategy',
    publishedAt: '2025-12-05',
    readingTime: 7,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/consistency.webp',
    keywords: ['content consistency', 'posting schedule', 'sustainable growth', 'content strategy'],
  },
  {
    slug: 'cross-platform-content-strategy-guide',
    titleKey: 'blog.articles.crossPlatform.title',
    descriptionKey: 'blog.articles.crossPlatform.description',
    contentKey: 'blog.articles.crossPlatform.content',
    category: 'tutorial',
    publishedAt: '2025-12-04',
    readingTime: 14,
    authorName: 'Bastien Youssfi',
    authorRole: 'Founder of Grow Online',
    imageUrl: '/images/blog/og/cross-platform.webp',
    keywords: [
      'cross-platform',
      'content repurposing',
      'multi-platform strategy',
      'content adaptation',
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured)
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((article) => article.category === category)
}

export function getRelatedArticles(currentSlug: string, limit: number = 3): Article[] {
  const current = getArticleBySlug(currentSlug)
  if (!current) return articles.slice(0, limit)

  // Prioritize same category, then recent articles
  const sameCategory = articles.filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  )
  const others = articles.filter((a) => a.slug !== currentSlug && a.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}
