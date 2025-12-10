import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'

interface FooterLink {
  labelKey: string
  href: string
  external?: boolean
}

interface FooterLinkSectionProps {
  titleKey: string
  links: FooterLink[]
}

export function FooterLinkSection({ titleKey, links }: FooterLinkSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-sm font-semibold">{t(titleKey)}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.labelKey}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(link.labelKey)}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(link.labelKey)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
