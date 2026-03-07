import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import type { BreadcrumbItemConfig } from '@/lib/breadcrumbs'

interface DashboardBreadcrumbsProps {
  items: BreadcrumbItemConfig[]
}

export function DashboardBreadcrumbs({ items }: DashboardBreadcrumbsProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label="Breadcrumbs" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const label = item.label || t(item.labelKey || '')

          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="text-text-muted h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast || item.isCurrentPage ? (
                <span className="text-text-primary font-medium">{label}</span>
              ) : (
                <Link
                  to={item.href}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
