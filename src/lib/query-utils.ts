/**
 * Build a URL query string from a params object.
 * Skips undefined, null, and empty-string values.
 */
export function buildQueryString<T extends object>(params?: T): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}
