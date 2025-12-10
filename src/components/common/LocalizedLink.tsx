import { forwardRef } from 'react'
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Navigate as RouterNavigate,
  useParams,
} from 'react-router-dom'
import type { LinkProps, NavLinkProps, NavigateProps } from 'react-router-dom'
import { addLangPrefix } from '@/utils/languageUtils'

/**
 * Drop-in replacement for react-router-dom's Link
 * Automatically adds the current language prefix to paths
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => {
  const { lang = 'en' } = useParams<{ lang: string }>()
  const localizedTo = addLangPrefix(to as string, lang)

  return <RouterLink ref={ref} to={localizedTo} {...props} />
})
Link.displayName = 'Link'

/**
 * Drop-in replacement for react-router-dom's NavLink
 * Automatically adds the current language prefix to paths
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ to, ...props }, ref) => {
  const { lang = 'en' } = useParams<{ lang: string }>()
  const localizedTo = addLangPrefix(to as string, lang)

  return <RouterNavLink ref={ref} to={localizedTo} {...props} />
})
NavLink.displayName = 'NavLink'

/**
 * Drop-in replacement for react-router-dom's Navigate
 * Automatically adds the current language prefix to paths
 */
export function Navigate({ to, ...props }: NavigateProps) {
  const { lang = 'en' } = useParams<{ lang: string }>()
  const localizedTo = addLangPrefix(to as string, lang)

  return <RouterNavigate to={localizedTo} {...props} />
}
