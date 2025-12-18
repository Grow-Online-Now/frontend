import { useState, useCallback } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { ArrowLeft, Loader2, Calendar, Trophy, Medal, Award } from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { OrganizationSchema, BreadcrumbSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Platform = 'linkedin' | 'x' | 'tiktok' | 'instagram'
type Industry =
  | 'saas'
  | 'coaching'
  | 'ecommerce'
  | 'realestate'
  | 'finance'
  | 'health'
  | 'marketing'
  | 'creator'

interface TimeSlot {
  day: number
  hour: number
  score: 'hot' | 'warm' | 'cold' | 'neutral'
}

interface BestTime {
  day: string
  time: string
  dayIndex: number
  hour: number
}

const BEST_TIMES_DATA: Record<Platform, Record<Industry, BestTime[]>> = {
  linkedin: {
    saas: [
      { day: 'tue', time: '09:00', dayIndex: 1, hour: 9 },
      { day: 'wed', time: '08:00', dayIndex: 2, hour: 8 },
      { day: 'thu', time: '10:00', dayIndex: 3, hour: 10 },
    ],
    coaching: [
      { day: 'mon', time: '11:00', dayIndex: 0, hour: 11 },
      { day: 'tue', time: '09:00', dayIndex: 1, hour: 9 },
      { day: 'fri', time: '09:00', dayIndex: 4, hour: 9 },
    ],
    ecommerce: [
      { day: 'wed', time: '12:00', dayIndex: 2, hour: 12 },
      { day: 'thu', time: '11:00', dayIndex: 3, hour: 11 },
      { day: 'tue', time: '14:00', dayIndex: 1, hour: 14 },
    ],
    realestate: [
      { day: 'tue', time: '10:00', dayIndex: 1, hour: 10 },
      { day: 'wed', time: '09:00', dayIndex: 2, hour: 9 },
      { day: 'thu', time: '11:00', dayIndex: 3, hour: 11 },
    ],
    finance: [
      { day: 'tue', time: '08:00', dayIndex: 1, hour: 8 },
      { day: 'wed', time: '09:00', dayIndex: 2, hour: 9 },
      { day: 'thu', time: '08:00', dayIndex: 3, hour: 8 },
    ],
    health: [
      { day: 'mon', time: '07:00', dayIndex: 0, hour: 7 },
      { day: 'wed', time: '12:00', dayIndex: 2, hour: 12 },
      { day: 'fri', time: '08:00', dayIndex: 4, hour: 8 },
    ],
    marketing: [
      { day: 'tue', time: '10:00', dayIndex: 1, hour: 10 },
      { day: 'wed', time: '11:00', dayIndex: 2, hour: 11 },
      { day: 'thu', time: '09:00', dayIndex: 3, hour: 9 },
    ],
    creator: [
      { day: 'tue', time: '09:00', dayIndex: 1, hour: 9 },
      { day: 'thu', time: '12:00', dayIndex: 3, hour: 12 },
      { day: 'wed', time: '17:00', dayIndex: 2, hour: 17 },
    ],
  },
  x: {
    saas: [
      { day: 'mon', time: '09:00', dayIndex: 0, hour: 9 },
      { day: 'wed', time: '12:00', dayIndex: 2, hour: 12 },
      { day: 'fri', time: '09:00', dayIndex: 4, hour: 9 },
    ],
    coaching: [
      { day: 'tue', time: '12:00', dayIndex: 1, hour: 12 },
      { day: 'thu', time: '17:00', dayIndex: 3, hour: 17 },
      { day: 'sat', time: '10:00', dayIndex: 5, hour: 10 },
    ],
    ecommerce: [
      { day: 'fri', time: '12:00', dayIndex: 4, hour: 12 },
      { day: 'sat', time: '11:00', dayIndex: 5, hour: 11 },
      { day: 'sun', time: '15:00', dayIndex: 6, hour: 15 },
    ],
    realestate: [
      { day: 'tue', time: '11:00', dayIndex: 1, hour: 11 },
      { day: 'thu', time: '14:00', dayIndex: 3, hour: 14 },
      { day: 'sat', time: '10:00', dayIndex: 5, hour: 10 },
    ],
    finance: [
      { day: 'mon', time: '08:00', dayIndex: 0, hour: 8 },
      { day: 'wed', time: '12:00', dayIndex: 2, hour: 12 },
      { day: 'fri', time: '16:00', dayIndex: 4, hour: 16 },
    ],
    health: [
      { day: 'mon', time: '07:00', dayIndex: 0, hour: 7 },
      { day: 'wed', time: '18:00', dayIndex: 2, hour: 18 },
      { day: 'sat', time: '09:00', dayIndex: 5, hour: 9 },
    ],
    marketing: [
      { day: 'tue', time: '11:00', dayIndex: 1, hour: 11 },
      { day: 'thu', time: '15:00', dayIndex: 3, hour: 15 },
      { day: 'fri', time: '10:00', dayIndex: 4, hour: 10 },
    ],
    creator: [
      { day: 'thu', time: '18:00', dayIndex: 3, hour: 18 },
      { day: 'fri', time: '17:00', dayIndex: 4, hour: 17 },
      { day: 'sun', time: '20:00', dayIndex: 6, hour: 20 },
    ],
  },
  tiktok: {
    saas: [
      { day: 'tue', time: '19:00', dayIndex: 1, hour: 19 },
      { day: 'thu', time: '12:00', dayIndex: 3, hour: 12 },
      { day: 'fri', time: '17:00', dayIndex: 4, hour: 17 },
    ],
    coaching: [
      { day: 'mon', time: '18:00', dayIndex: 0, hour: 18 },
      { day: 'wed', time: '19:00', dayIndex: 2, hour: 19 },
      { day: 'fri', time: '20:00', dayIndex: 4, hour: 20 },
    ],
    ecommerce: [
      { day: 'thu', time: '19:00', dayIndex: 3, hour: 19 },
      { day: 'fri', time: '15:00', dayIndex: 4, hour: 15 },
      { day: 'sun', time: '18:00', dayIndex: 6, hour: 18 },
    ],
    realestate: [
      { day: 'sat', time: '11:00', dayIndex: 5, hour: 11 },
      { day: 'sun', time: '14:00', dayIndex: 6, hour: 14 },
      { day: 'wed', time: '19:00', dayIndex: 2, hour: 19 },
    ],
    finance: [
      { day: 'tue', time: '18:00', dayIndex: 1, hour: 18 },
      { day: 'thu', time: '19:00', dayIndex: 3, hour: 19 },
      { day: 'sun', time: '17:00', dayIndex: 6, hour: 17 },
    ],
    health: [
      { day: 'mon', time: '07:00', dayIndex: 0, hour: 7 },
      { day: 'wed', time: '19:00', dayIndex: 2, hour: 19 },
      { day: 'sun', time: '18:00', dayIndex: 6, hour: 18 },
    ],
    marketing: [
      { day: 'tue', time: '17:00', dayIndex: 1, hour: 17 },
      { day: 'thu', time: '15:00', dayIndex: 3, hour: 15 },
      { day: 'sat', time: '12:00', dayIndex: 5, hour: 12 },
    ],
    creator: [
      { day: 'tue', time: '19:00', dayIndex: 1, hour: 19 },
      { day: 'thu', time: '15:00', dayIndex: 3, hour: 15 },
      { day: 'sat', time: '21:00', dayIndex: 5, hour: 21 },
    ],
  },
  instagram: {
    saas: [
      { day: 'tue', time: '11:00', dayIndex: 1, hour: 11 },
      { day: 'wed', time: '10:00', dayIndex: 2, hour: 10 },
      { day: 'fri', time: '10:00', dayIndex: 4, hour: 10 },
    ],
    coaching: [
      { day: 'mon', time: '11:00', dayIndex: 0, hour: 11 },
      { day: 'wed', time: '13:00', dayIndex: 2, hour: 13 },
      { day: 'fri', time: '11:00', dayIndex: 4, hour: 11 },
    ],
    ecommerce: [
      { day: 'wed', time: '11:00', dayIndex: 2, hour: 11 },
      { day: 'fri', time: '10:00', dayIndex: 4, hour: 10 },
      { day: 'sat', time: '10:00', dayIndex: 5, hour: 10 },
    ],
    realestate: [
      { day: 'tue', time: '10:00', dayIndex: 1, hour: 10 },
      { day: 'thu', time: '09:00', dayIndex: 3, hour: 9 },
      { day: 'sat', time: '11:00', dayIndex: 5, hour: 11 },
    ],
    finance: [
      { day: 'wed', time: '11:00', dayIndex: 2, hour: 11 },
      { day: 'thu', time: '12:00', dayIndex: 3, hour: 12 },
      { day: 'fri', time: '11:00', dayIndex: 4, hour: 11 },
    ],
    health: [
      { day: 'mon', time: '08:00', dayIndex: 0, hour: 8 },
      { day: 'wed', time: '17:00', dayIndex: 2, hour: 17 },
      { day: 'sat', time: '11:00', dayIndex: 5, hour: 11 },
    ],
    marketing: [
      { day: 'tue', time: '13:00', dayIndex: 1, hour: 13 },
      { day: 'wed', time: '11:00', dayIndex: 2, hour: 11 },
      { day: 'fri', time: '10:00', dayIndex: 4, hour: 10 },
    ],
    creator: [
      { day: 'tue', time: '11:00', dayIndex: 1, hour: 11 },
      { day: 'fri', time: '11:00', dayIndex: 4, hour: 11 },
      { day: 'sat', time: '10:00', dayIndex: 5, hour: 10 },
    ],
  },
}

function generateHeatmapData(platform: Platform, industry: Industry): TimeSlot[] {
  const bestTimes = BEST_TIMES_DATA[platform][industry]
  const slots: TimeSlot[] = []

  for (let day = 0; day < 7; day++) {
    for (let hour = 6; hour <= 22; hour++) {
      const isBest = bestTimes.some((bt) => bt.dayIndex === day && bt.hour === hour)
      const isNearBest = bestTimes.some(
        (bt) => bt.dayIndex === day && (bt.hour === hour - 1 || bt.hour === hour + 1)
      )

      let score: 'hot' | 'warm' | 'cold' | 'neutral' = 'neutral'

      if (isBest) {
        score = 'hot'
      } else if (isNearBest) {
        score = 'warm'
      } else if ((platform === 'linkedin' && (day === 5 || day === 6)) || hour < 7 || hour > 20) {
        score = 'cold'
      }

      slots.push({ day, hour, score })
    }
  }

  return slots
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6)

export function BestTimeToPostTool() {
  const { t, i18n } = useTranslation()
  const [platform, setPlatform] = useState<Platform | ''>('')
  const [industry, setIndustry] = useState<Industry | ''>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [heatmapData, setHeatmapData] = useState<TimeSlot[] | null>(null)
  const [bestTimes, setBestTimes] = useState<BestTime[] | null>(null)

  // Breadcrumb data for SEO - include language prefix
  const breadcrumbs = [
    { name: 'Home', url: `https://growonline.now/${i18n.language}` },
    { name: 'Free Tools', url: `https://growonline.now/${i18n.language}/free-tools` },
    {
      name: 'Best Time to Post',
      url: `https://growonline.now/${i18n.language}/free-tools/best-time-to-post-calculator`,
    },
  ]

  const platforms: Platform[] = ['linkedin', 'x', 'tiktok', 'instagram']
  const industries: Industry[] = [
    'saas',
    'coaching',
    'ecommerce',
    'realestate',
    'finance',
    'health',
    'marketing',
    'creator',
  ]

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const runAnalysis = useCallback(() => {
    if (!platform || !industry) return

    setIsAnalyzing(true)
    setAnalysisStep(1)
    setHeatmapData(null)
    setBestTimes(null)

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
        setHeatmapData(generateHeatmapData(platform, industry))
        setBestTimes(BEST_TIMES_DATA[platform][industry])
      }
    }, 700)
  }, [platform, industry])

  const getSlotColor = (score: TimeSlot['score']) => {
    switch (score) {
      case 'hot':
        return 'bg-success hover:bg-success/80'
      case 'warm':
        return 'bg-warning hover:bg-warning/80'
      case 'cold':
        return 'bg-destructive/70 hover:bg-destructive/60'
      default:
        return 'bg-muted hover:bg-muted/80'
    }
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return '12am'
    if (hour === 12) return '12pm'
    if (hour < 12) return `${hour}am`
    return `${hour - 12}pm`
  }

  return (
    <HelmetProvider>
      <div className="bg-background min-h-screen">
        <SEOHead
          title={t('tools.meta.bestTimeTitle')}
          description={t('tools.meta.bestTimeDescription')}
          pagePath="/free-tools/best-time-to-post-calculator"
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
                {t('tools.bestTime.title')}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
                {t('tools.bestTime.subtitle')}
              </p>
            </div>
          </header>

          {/* Tool Interface */}
          <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-border/50 bg-card/50 hover:border-border hover:bg-card rounded-2xl border p-6 transition-colors">
              <h2 className="text-foreground text-lg font-semibold">
                {t('tools.bestTime.input.title')}
              </h2>
              <div className="mt-4 space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="text-foreground text-sm font-medium">
                    {t('tools.bestTime.input.platform')}
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {platforms.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={cn(
                          'rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                          platform === p
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        )}
                      >
                        {t(`tools.bestTime.input.platforms.${p}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry Selection */}
                <div>
                  <label className="text-foreground text-sm font-medium">
                    {t('tools.bestTime.input.industry')}
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {industries.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => setIndustry(ind)}
                        className={cn(
                          'rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                          industry === ind
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        )}
                      >
                        {t(`tools.bestTime.input.industries.${ind}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={runAnalysis}
                  disabled={!platform || !industry || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t(`tools.bestTime.analyzing.step${analysisStep}`)}
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      {t('tools.bestTime.input.generate')}
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <Progress value={(analysisStep / 4) * 100} />
                    <p className="text-muted-foreground text-center text-xs">
                      {t(`tools.bestTime.analyzing.step${analysisStep}`)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Heatmap Results */}
            {heatmapData && bestTimes && (
              <div className="border-border/50 bg-card/50 hover:border-border hover:bg-card mt-8 rounded-2xl border p-6 transition-colors">
                <h2 className="text-foreground text-lg font-semibold">
                  {t('tools.bestTime.heatmap.title')}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t('tools.bestTime.heatmap.subtitle')}
                </p>

                <div className="mt-6">
                  {/* Legend */}
                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-success h-4 w-4 rounded" />
                      <span className="text-sm">{t('tools.bestTime.heatmap.legend.hot')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-warning h-4 w-4 rounded" />
                      <span className="text-sm">{t('tools.bestTime.heatmap.legend.warm')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-destructive/70 h-4 w-4 rounded" />
                      <span className="text-sm">{t('tools.bestTime.heatmap.legend.cold')}</span>
                    </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      {/* Hour headers */}
                      <div className="flex">
                        <div className="w-12 shrink-0" />
                        {HOURS.filter((_, i) => i % 2 === 0).map((hour) => (
                          <div
                            key={hour}
                            className="text-muted-foreground flex-1 text-center text-xs"
                          >
                            {formatHour(hour)}
                          </div>
                        ))}
                      </div>

                      {/* Day rows */}
                      {days.map((day, dayIndex) => (
                        <div key={day} className="mt-1 flex items-center">
                          <div className="text-muted-foreground w-12 shrink-0 text-sm font-medium">
                            {t(`tools.bestTime.heatmap.days.${day}`)}
                          </div>
                          <div className="flex flex-1 gap-0.5">
                            {HOURS.map((hour) => {
                              const slot = heatmapData.find(
                                (s) => s.day === dayIndex && s.hour === hour
                              )
                              return (
                                <div
                                  key={`${day}-${hour}`}
                                  className={cn(
                                    'h-6 flex-1 cursor-default rounded-sm transition-colors',
                                    getSlotColor(slot?.score || 'neutral')
                                  )}
                                  title={`${t(`tools.bestTime.heatmap.days.${day}`)} ${formatHour(hour)}`}
                                />
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Times Cards */}
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold">
                      {t('tools.bestTime.heatmap.bestTimes.title')}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {bestTimes.map((time, index) => {
                        const icons = [Trophy, Medal, Award]
                        const Icon = icons[index]
                        const colors = ['text-warning', 'text-muted-foreground', 'text-orange-500']
                        const ranks = ['rank1', 'rank2', 'rank3']

                        return (
                          <div
                            key={index}
                            className="border-border/50 bg-card/50 hover:border-border hover:bg-card relative overflow-hidden rounded-xl border p-6 transition-colors"
                          >
                            <div className="absolute top-0 right-0 p-2">
                              <Icon className={cn('h-6 w-6', colors[index])} />
                            </div>
                            <Badge variant="default">
                              {t(`tools.bestTime.heatmap.bestTimes.${ranks[index]}`)}
                            </Badge>
                            <p className="mt-2 text-2xl font-bold">
                              {t(`tools.bestTime.heatmap.days.${time.day}`)}
                            </p>
                            <p className="text-muted-foreground text-lg">{time.time}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="from-primary/10 via-primary/5 mt-8 rounded-xl bg-gradient-to-br to-transparent p-6 text-center">
                    <h3 className="text-xl font-semibold">{t('tools.bestTime.cta.title')}</h3>
                    <p className="text-muted-foreground mt-2">
                      {t('tools.bestTime.cta.description')}
                    </p>
                    <Button size="lg" className="mt-4" asChild>
                      <Link to="/#hero">{t('tools.bestTime.cta.button')}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SEO Content Section */}
          <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-none">
              <h2 className="text-foreground mb-4 text-2xl font-semibold">
                {t('tools.bestTime.seo.howToUse.title')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="border-border/50 bg-card/50 hover:border-border hover:bg-card rounded-2xl border p-6 transition-colors"
                  >
                    <h3 className="text-foreground font-semibold">
                      {t(`tools.bestTime.seo.howToUse.step${step}.title`)}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {t(`tools.bestTime.seo.howToUse.step${step}.description`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  {t('tools.bestTime.seo.whyMatters.title')}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {t('tools.bestTime.seo.whyMatters.content')}
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  {t('tools.bestTime.seo.methodology.title')}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {t('tools.bestTime.seo.methodology.content')}
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
