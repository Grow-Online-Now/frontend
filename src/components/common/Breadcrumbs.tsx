import { Link } from '@/components/common/LocalizedLink'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { BreadcrumbSchema, type BreadcrumbItem } from '@/lib/seo/StructuredData'
import { SITE_URL } from '@/lib/seo/SEOHead'
import type { BreadcrumbItemConfig } from '@/lib/breadcrumbs'

interface BreadcrumbsProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItemConfig[]
  /** Additional CSS classes */
  className?: string
  /** Show home icon for first item */
  showHomeIcon?: boolean
}

/**
 * Breadcrumbs component with SEO-friendly markup and JSON-LD schema
 * Follows Google's breadcrumb structured data guidelines
 */
export function Breadcrumbs({ items, className, showHomeIcon = true }: BreadcrumbsProps) {
  const { t } = useTranslation()

  // Generate schema data
  const schemaItems: BreadcrumbItem[] = items.map((item) => ({
    name: item.label || t(item.labelKey || ''),
    url: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`,
  }))

  return (
    <>
      {/* JSON-LD Structured Data */}
      <BreadcrumbSchema items={schemaItems} />

      {/* Visual Breadcrumbs */}
      <nav aria-label={t('common.navigation.breadcrumbs')} className={cn('mb-6', className)}>
        <ol
          className="flex flex-wrap items-center gap-1.5 text-sm"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const label = item.label || t(item.labelKey || '')

            return (
              <li
                key={item.href}
                className="flex items-center gap-1.5"
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight
                    className="text-muted-foreground h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                )}

                {isLast || item.isCurrentPage ? (
                  // Current page - not a link
                  <span className="text-foreground font-medium" itemProp="name" aria-current="page">
                    {index === 0 && showHomeIcon ? (
                      <span className="flex items-center gap-1.5">
                        <Home className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">{label}</span>
                      </span>
                    ) : (
                      label
                    )}
                  </span>
                ) : (
                  // Link to parent page
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">
                      {index === 0 && showHomeIcon ? (
                        <span className="flex items-center gap-1.5">
                          <Home className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="hidden sm:inline">{label}</span>
                          <span className="sr-only sm:hidden">{label}</span>
                        </span>
                      ) : (
                        label
                      )}
                    </span>
                  </Link>
                )}

                <meta itemProp="position" content={String(index + 1)} />
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
