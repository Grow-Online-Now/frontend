import { useParams } from 'react-router-dom'
import { addLangPrefix } from '@/utils/languageUtils'

/**
 * Hook to get a function that localizes paths
 * Useful for native <a> tags, motion.a, or components that use href prop
 *
 * @example
 * const localizeHref = useLocalizedHref()
 * <a href={localizeHref('/blog')}>Blog</a>
 * <motion.a href={localizeHref('/')}>Home</motion.a>
 */
export function useLocalizedHref() {
  const { lang = 'en' } = useParams<{ lang: string }>()

  return (path: string) => addLangPrefix(path, lang) as string
}
