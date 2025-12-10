export interface BreadcrumbItemConfig {
  /** Translation key for the breadcrumb label */
  labelKey?: string
  /** Direct label (use when dynamic, like competitor names) */
  label?: string
  /** URL path for this breadcrumb */
  href: string
  /** Whether this is the current/active page */
  isCurrentPage?: boolean
}

/**
 * Helper function to generate breadcrumb items for alternative pages
 */
export function getAlternativesBreadcrumbs(competitorName: string): BreadcrumbItemConfig[] {
  return [
    { labelKey: 'common.navigation.home', href: '/' },
    { labelKey: 'common.navigation.alternatives', href: '/alternatives' },
    {
      label: competitorName,
      href: `/alternatives/${competitorName.toLowerCase()}`,
      isCurrentPage: true,
    },
  ]
}

/**
 * Helper function to generate breadcrumb items for legal pages
 */
export function getLegalBreadcrumbs(pageKey: string, pagePath: string): BreadcrumbItemConfig[] {
  return [
    { labelKey: 'common.navigation.home', href: '/' },
    { labelKey: `common.navigation.${pageKey}`, href: pagePath, isCurrentPage: true },
  ]
}
