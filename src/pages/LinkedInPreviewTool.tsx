import { useState, useEffect, useCallback } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  Globe,
  Loader2,
  Lightbulb,
} from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { OrganizationSchema, BreadcrumbSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// Power words that increase engagement
const POWER_WORDS = [
  'strategy',
  'mistake',
  'secret',
  'how i',
  'what i learned',
  'truth',
  'unpopular opinion',
  'controversial',
  'warning',
  'stop',
  'never',
  'always',
  'proven',
  'guaranteed',
  'breakthrough',
  'discover',
  'revealed',
  'shocking',
  'surprising',
  'unexpected',
  'finally',
  'announcing',
  'introducing',
  'exclusive',
  'limited',
  'free',
  'urgent',
  'important',
  'critical',
  'essential',
]

/**
 * LinkedIn Preview Component
 *
 * NOTE: This component intentionally uses hardcoded colors (#e0e0e0, #0077b5,
 * #191919, #666666, #f3f3f3, bg-white) to accurately simulate LinkedIn's actual UI.
 * These colors match LinkedIn's light theme and should NOT be replaced with
 * design system tokens, as the goal is to show users exactly how their post
 * will appear on the LinkedIn platform.
 */
interface LinkedInPreviewProps {
  content: string
  authorName: string
  authorHeadline: string
  isMobile: boolean
  seeMoreKey: string
}

function LinkedInPreview({
  content,
  authorName,
  authorHeadline,
  isMobile,
  seeMoreKey,
}: LinkedInPreviewProps) {
  const { t } = useTranslation()
  const maxLines = isMobile ? 3 : 5
  const lineHeight = 20
  const maxHeight = maxLines * lineHeight

  const lines = content.split('\n')
  let visibleContent = ''
  let currentHeight = 0
  let isTruncated = false

  for (const line of lines) {
    const lineCount = Math.ceil((line.length || 1) / (isMobile ? 35 : 55))
    const linePixels = lineCount * lineHeight

    if (currentHeight + linePixels > maxHeight) {
      isTruncated = true
      break
    }

    visibleContent += (visibleContent ? '\n' : '') + line
    currentHeight += linePixels
  }

  // LinkedIn preview uses hardcoded colors to match the actual LinkedIn UI
  return (
    <div
      className={cn(
        'rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-sm',
        isMobile ? 'max-w-[340px]' : 'max-w-[550px]'
      )}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Author Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0077b5] to-[#004182] text-lg font-semibold text-white">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#191919]">{authorName}</p>
          <p className="truncate text-[12px] text-[#666666]">{authorHeadline}</p>
          <div className="flex items-center gap-1 text-[12px] text-[#666666]">
            <span>1h</span>
            <span>•</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mt-3">
        <div
          className="text-[14px] whitespace-pre-wrap text-[#191919]"
          style={{ lineHeight: '1.4' }}
        >
          {visibleContent}
          {isTruncated && (
            <button className="ml-1 text-[#666666] hover:text-[#0077b5] hover:underline">
              {t(seeMoreKey)}
            </button>
          )}
        </div>
      </div>

      {/* Engagement Bar */}
      <div className="mt-4 border-t border-[#e0e0e0] pt-3">
        <div className="flex items-center justify-between text-[13px] text-[#666666]">
          <button className="flex items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-[#f3f3f3] hover:text-[#0077b5]">
            <ThumbsUp className="h-4 w-4" />
            <span className={isMobile ? 'hidden' : ''}>
              {t('tools.linkedinPreview.preview.reactions')}
            </span>
          </button>
          <button className="flex items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-[#f3f3f3] hover:text-[#0077b5]">
            <MessageCircle className="h-4 w-4" />
            <span className={isMobile ? 'hidden' : ''}>
              {t('tools.linkedinPreview.preview.comments')}
            </span>
          </button>
          <button className="flex items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-[#f3f3f3] hover:text-[#0077b5]">
            <Repeat2 className="h-4 w-4" />
            <span className={isMobile ? 'hidden' : ''}>
              {t('tools.linkedinPreview.preview.repost')}
            </span>
          </button>
          <button className="flex items-center gap-1 rounded px-2 py-1.5 transition-colors hover:bg-[#f3f3f3] hover:text-[#0077b5]">
            <Send className="h-4 w-4" />
            <span className={isMobile ? 'hidden' : ''}>
              {t('tools.linkedinPreview.preview.send')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface AnalysisResult {
  score: number
  visibleWords: number
  powerWordsFound: string[]
  hookLength: 'short' | 'optimal' | 'long'
  firstLineImpact: 'weak' | 'moderate' | 'strong'
  tips: string[]
}

function analyzeHook(content: string): AnalysisResult {
  const lines = content.split('\n').filter((l) => l.trim())
  const firstThreeLines = lines.slice(0, 3).join(' ')
  const words = firstThreeLines.split(/\s+/).filter((w) => w.length > 0)
  const visibleWords = words.length

  const lowerContent = firstThreeLines.toLowerCase()
  const powerWordsFound = POWER_WORDS.filter((word) => lowerContent.includes(word))

  let hookLength: 'short' | 'optimal' | 'long' = 'optimal'
  if (visibleWords < 10) hookLength = 'short'
  else if (visibleWords > 35) hookLength = 'long'

  const firstLine = lines[0] || ''
  let firstLineImpact: 'weak' | 'moderate' | 'strong' = 'moderate'
  const hasQuestion = firstLine.includes('?')
  const hasNumber = /\d/.test(firstLine)
  const hasPowerWord = POWER_WORDS.some((w) => firstLine.toLowerCase().includes(w))

  if ((hasQuestion && hasPowerWord) || (hasNumber && hasPowerWord)) {
    firstLineImpact = 'strong'
  } else if (!hasQuestion && !hasNumber && !hasPowerWord) {
    firstLineImpact = 'weak'
  }

  let score = 50
  score += Math.min(powerWordsFound.length * 7, 20)
  if (hookLength === 'optimal') score += 15
  else if (hookLength === 'short') score += 5
  else score -= 10
  if (firstLineImpact === 'strong') score += 15
  else if (firstLineImpact === 'weak') score -= 10
  if (hasQuestion) score += 5
  if (hasNumber) score += 5
  score = Math.min(Math.max(score, 0), 100)

  const tips: string[] = []
  if (powerWordsFound.length === 0) tips.push('addPowerWords')
  if (hookLength === 'long') tips.push('shortenHook')
  if (!hasNumber) tips.push('addNumbers')
  if (!hasQuestion && firstLineImpact !== 'strong') tips.push('questionHook')
  if (score >= 80) tips.push('great')

  return {
    score,
    visibleWords,
    powerWordsFound,
    hookLength,
    firstLineImpact,
    tips,
  }
}

export function LinkedInPreviewTool() {
  const { t, i18n } = useTranslation()
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('Your Name')
  const [authorHeadline, setAuthorHeadline] = useState('Your headline or job title')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  // Breadcrumb data for SEO - include language prefix
  const breadcrumbs = [
    { name: 'Home', url: `https://growonline.now/${i18n.language}` },
    { name: 'Free Tools', url: `https://growonline.now/${i18n.language}/free-tools` },
    {
      name: 'LinkedIn Preview',
      url: `https://growonline.now/${i18n.language}/free-tools/linkedin-post-preview-tool`,
    },
  ]

  const runAnalysis = useCallback(() => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    setAnalysisStep(1)
    setAnalysisResult(null)

    const steps = [1, 2, 3, 4]
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep < steps.length) {
        setAnalysisStep(currentStep + 1)
      } else {
        clearInterval(interval)
        setIsAnalyzing(false)
        setAnalysisStep(0)
        setAnalysisResult(analyzeHook(content))
      }
    }, 600)
  }, [content])

  useEffect(() => {
    if (analysisResult && content.length > 0) {
      setAnalysisResult(null)
    }
  }, [content, analysisResult])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    if (score >= 40) return 'text-warning/70' // Moderate warning for average scores
    return 'text-destructive'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('tools.linkedinPreview.analysis.ratings.excellent')
    if (score >= 60) return t('tools.linkedinPreview.analysis.ratings.good')
    if (score >= 40) return t('tools.linkedinPreview.analysis.ratings.average')
    if (score >= 20) return t('tools.linkedinPreview.analysis.ratings.needsWork')
    return t('tools.linkedinPreview.analysis.ratings.weak')
  }

  return (
    <HelmetProvider>
      <div className="bg-background min-h-screen">
        <SEOHead
          title={t('tools.meta.linkedinPreviewTitle')}
          description={t('tools.meta.linkedinPreviewDescription')}
          pagePath="/free-tools/linkedin-post-preview-tool"
          lang={i18n.language}
        />

        <OrganizationSchema />
        <BreadcrumbSchema items={breadcrumbs} />

        <Navbar />

        <main className="pt-24 pb-24">
          {/* Header */}
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              to="/free-tools"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('tools.common.backToTools')}
            </Link>

            <div className="mt-4">
              <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {t('tools.linkedinPreview.title')}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
                {t('tools.linkedinPreview.subtitle')}
              </p>
            </div>
          </header>

          {/* Tool Interface */}
          <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Input Section */}
              <div>
                <div className="border-border/50 bg-card/50 hover:border-border hover:bg-card rounded-2xl border p-6 transition-colors">
                  <h2 className="text-foreground text-lg font-semibold">
                    {t('tools.linkedinPreview.input.label')}
                  </h2>
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-foreground text-sm font-medium">
                          {t('tools.linkedinPreview.input.authorName')}
                        </label>
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder={t('tools.linkedinPreview.input.authorNamePlaceholder')}
                          className="border-border bg-background focus:ring-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-foreground text-sm font-medium">
                          {t('tools.linkedinPreview.input.authorHeadline')}
                        </label>
                        <input
                          type="text"
                          value={authorHeadline}
                          onChange={(e) => setAuthorHeadline(e.target.value)}
                          placeholder={t('tools.linkedinPreview.input.authorHeadlinePlaceholder')}
                          className="border-border bg-background focus:ring-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t('tools.linkedinPreview.input.placeholder')}
                        rows={10}
                        className="border-border bg-background focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                      />
                    </div>

                    <Button
                      onClick={runAnalysis}
                      disabled={!content.trim() || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t(`tools.linkedinPreview.analysis.analyzing.step${analysisStep}`)}
                        </>
                      ) : (
                        t('tools.linkedinPreview.analysis.analyze')
                      )}
                    </Button>

                    {isAnalyzing && (
                      <div className="space-y-2">
                        <Progress value={(analysisStep / 4) * 100} />
                        <p className="text-muted-foreground text-center text-xs">
                          {t(`tools.linkedinPreview.analysis.analyzing.step${analysisStep}`)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Result */}
                {analysisResult && (
                  <div className="border-border/50 bg-card/50 hover:border-border hover:bg-card mt-6 rounded-2xl border p-6 transition-colors">
                    <h2 className="text-foreground text-lg font-semibold">
                      {t('tools.linkedinPreview.analysis.title')}
                    </h2>
                    <div className="mt-4 space-y-6">
                      {/* Score Display */}
                      <div className="text-center">
                        <div
                          className={cn('text-6xl font-bold', getScoreColor(analysisResult.score))}
                        >
                          {analysisResult.score}
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {t('tools.linkedinPreview.analysis.score')} •{' '}
                          {getScoreLabel(analysisResult.score)}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-muted-foreground text-xs">
                            {t('tools.linkedinPreview.analysis.metrics.visibleWords')}
                          </p>
                          <p className="text-lg font-semibold">{analysisResult.visibleWords}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-muted-foreground text-xs">
                            {t('tools.linkedinPreview.analysis.metrics.powerWords')}
                          </p>
                          <p className="text-lg font-semibold">
                            {analysisResult.powerWordsFound.length}
                          </p>
                        </div>
                      </div>

                      {/* Power Words Found */}
                      {analysisResult.powerWordsFound.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-medium">
                            {t('tools.linkedinPreview.analysis.metrics.powerWords')}:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.powerWordsFound.map((word) => (
                              <Badge key={word} variant="default">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      <div>
                        <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                          <Lightbulb className="h-4 w-4" />
                          {t('tools.linkedinPreview.analysis.tips.title')}
                        </p>
                        <div className="space-y-2">
                          {analysisResult.tips.map((tip) => (
                            <p key={tip} className="text-muted-foreground text-sm">
                              • {t(`tools.linkedinPreview.analysis.tips.${tip}`)}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="bg-primary/10 rounded-lg p-4">
                        <p className="text-foreground text-sm">
                          {analysisResult.score < 60
                            ? t('tools.linkedinPreview.cta.weak')
                            : t('tools.linkedinPreview.cta.strong')}
                        </p>
                        <Button className="mt-3 w-full" asChild>
                          <Link to="/#hero">{t('tools.linkedinPreview.cta.button')}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div>
                <div className="border-border/50 bg-card/50 hover:border-border hover:bg-card rounded-2xl border p-6 transition-colors">
                  <h2 className="text-foreground text-lg font-semibold">
                    {t('tools.linkedinPreview.preview.title')}
                  </h2>
                  <div className="mt-4">
                    <Tabs defaultValue="mobile">
                      <TabsList className="mb-6">
                        <TabsTrigger value="mobile" className="gap-2">
                          <Smartphone className="h-4 w-4" />
                          {t('tools.linkedinPreview.preview.mobile')}
                        </TabsTrigger>
                        <TabsTrigger value="desktop" className="gap-2">
                          <Monitor className="h-4 w-4" />
                          {t('tools.linkedinPreview.preview.desktop')}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="mobile" className="flex justify-center">
                        <LinkedInPreview
                          content={content || t('tools.linkedinPreview.input.placeholder')}
                          authorName={authorName}
                          authorHeadline={authorHeadline}
                          isMobile={true}
                          seeMoreKey="tools.linkedinPreview.preview.seeMore"
                        />
                      </TabsContent>

                      <TabsContent value="desktop" className="flex justify-center">
                        <LinkedInPreview
                          content={content || t('tools.linkedinPreview.input.placeholder')}
                          authorName={authorName}
                          authorHeadline={authorHeadline}
                          isMobile={false}
                          seeMoreKey="tools.linkedinPreview.preview.seeMore"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-none">
              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                {t('tools.linkedinPreview.seo.howToUse.title')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="border-border/50 bg-card/50 hover:border-border hover:bg-card rounded-2xl border p-6 transition-colors"
                  >
                    <h3 className="text-foreground font-semibold">
                      {t(`tools.linkedinPreview.seo.howToUse.step${step}.title`)}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {t(`tools.linkedinPreview.seo.howToUse.step${step}.description`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  {t('tools.linkedinPreview.seo.whyMatters.title')}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {t('tools.linkedinPreview.seo.whyMatters.content')}
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  {t('tools.linkedinPreview.seo.methodology.title')}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {t('tools.linkedinPreview.seo.methodology.content')}
                </p>
              </div>
            </div>
          </section>
        </main>

        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
