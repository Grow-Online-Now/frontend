import { useTranslation } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { SEOHead, SITE_URL } from '@/lib/seo/SEOHead'
import { ArticleSchema } from '@/lib/seo/StructuredData'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { getLegalBreadcrumbs } from '@/lib/breadcrumbs'
import { LegalHero } from './LegalHero'
import { LegalTableOfContents, type TocItem } from './LegalTableOfContents'
import { cn } from '@/lib/utils'

interface LegalPageLayoutProps {
  pageType: 'terms' | 'privacy' | 'cookies'
  pagePath: string
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  icon: React.ReactNode
  iconColorClass?: string
  lastUpdated: string
  datePublished: string
  keywords: string[]
  tocItems: TocItem[]
  children: React.ReactNode
  className?: string
}

export function LegalPageLayout({
  pageType,
  pagePath,
  titleKey,
  subtitleKey,
  descriptionKey,
  icon,
  iconColorClass,
  lastUpdated,
  datePublished,
  keywords,
  tocItems,
  children,
  className,
}: LegalPageLayoutProps) {
  const { t, i18n } = useTranslation()
  const canonicalUrl = `${SITE_URL}${pagePath}`
  const breadcrumbItems = getLegalBreadcrumbs(pageType, pagePath)

  return (
    <HelmetProvider>
      <div className={cn('bg-background min-h-screen', className)}>
        <SEOHead
          title={t(titleKey)}
          description={t(descriptionKey)}
          canonicalUrl={canonicalUrl}
          lang={i18n.language}
          ogType="article"
          publishedTime={datePublished}
          modifiedTime={lastUpdated}
          pagePath={pagePath}
          keywords={keywords}
        />

        <ArticleSchema
          headline={t(titleKey)}
          description={t(descriptionKey)}
          datePublished={datePublished}
          dateModified={lastUpdated}
          url={canonicalUrl}
        />

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          <LegalHero
            titleKey={titleKey}
            subtitleKey={subtitleKey}
            icon={icon}
            lastUpdated={lastUpdated}
            iconColorClass={iconColorClass}
          />

          <div className="lg:grid lg:grid-cols-4 lg:gap-12">
            <LegalTableOfContents items={tocItems} className="col-span-1" />

            <main className="col-span-3 space-y-6">{children}</main>
          </div>

          <footer className="border-border mt-16 border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Grow Online. {t('legal.common.allRightsReserved')}
            </p>
          </footer>
        </div>
      </div>
    </HelmetProvider>
  )
}
