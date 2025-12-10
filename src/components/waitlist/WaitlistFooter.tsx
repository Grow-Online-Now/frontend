import { useTranslation } from 'react-i18next'
import { FooterCompanyInfo, FooterLinkSection, FooterSocialLinks } from './footer'
import { footerSections } from './footer/footerLinks'
import { cn } from '@/lib/utils'

interface WaitlistFooterProps {
  variant?: 'default' | 'dark'
}

export function WaitlistFooter({ variant = 'default' }: WaitlistFooterProps) {
  const { t } = useTranslation()
  const isDark = variant === 'dark'

  return (
    <footer
      className={cn(
        'relative overflow-hidden border-t',
        isDark ? 'border-zinc-800 bg-zinc-900' : 'border-border bg-secondary/30'
      )}
    >
      {/* Animated liquid metal background */}
      {/* Content overlay */}
      <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main footer grid */}
          <div className="grid gap-12 lg:grid-cols-6">
            {/* Company info - takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <FooterCompanyInfo />
              <div className="mt-6">
                <FooterSocialLinks />
              </div>
            </div>

            {/* Link sections - remaining 4 columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-5">
              {footerSections.map((section) => (
                <FooterLinkSection
                  key={section.titleKey}
                  titleKey={section.titleKey}
                  links={section.links}
                />
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-border mt-16 border-t pt-8">
            <p className="text-muted-foreground text-center text-sm">
              {t('waitlist.footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
