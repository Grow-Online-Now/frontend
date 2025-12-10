export function addLangPrefix(
  to: string | { pathname?: string },
  lang: string
): string | { pathname?: string } {
  if (typeof to === 'object') {
    if (to.pathname) {
      return { ...to, pathname: addLangPrefix(to.pathname, lang) as string }
    }
    return to
  }

  // Don't modify external links, anchors, or already-prefixed paths
  if (
    to.startsWith('http') ||
    to.startsWith('#') ||
    to.startsWith(`/${lang}/`) ||
    to === `/${lang}`
  ) {
    return to
  }

  // Handle root path
  if (to === '/') {
    return `/${lang}`
  }

  // Add prefix
  return `/${lang}${to.startsWith('/') ? to : `/${to}`}`
}
