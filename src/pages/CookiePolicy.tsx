import { useTranslation } from 'react-i18next'
import {
  Cookie,
  HelpCircle,
  ListChecks,
  Clock,
  Globe,
  Settings,
  FileEdit,
  Mail,
} from 'lucide-react'
import {
  LegalPageLayout,
  LegalSection,
  LegalParagraph,
  LegalList,
  LegalSubsection,
  LegalContact,
  type TocItem,
} from '@/components/legal'
import { Button } from '@/components/ui/button'
import { showCookiePreferences } from '@/lib/cookie-consent/cookie-utils'

const LAST_UPDATED = '2025-12-03'
const DATE_PUBLISHED = '2025-12-03'

const TOC_ITEMS: TocItem[] = [
  { id: 'what-are-cookies', titleKey: 'legal.cookies.sections.whatAreCookies.title' },
  { id: 'how-we-use', titleKey: 'legal.cookies.sections.howWeUse.title' },
  { id: 'types', titleKey: 'legal.cookies.sections.types.title' },
  { id: 'third-party', titleKey: 'legal.cookies.sections.thirdParty.title' },
  { id: 'duration', titleKey: 'legal.cookies.sections.duration.title' },
  { id: 'managing', titleKey: 'legal.cookies.sections.managing.title' },
  { id: 'changes', titleKey: 'legal.cookies.sections.changes.title' },
  { id: 'contact', titleKey: 'legal.cookies.sections.contact.title' },
]

const KEYWORDS = [
  'cookie policy',
  'cookies',
  'tracking',
  'analytics',
  'PostHog',
  'privacy',
  'GDPR cookies',
  'Grow Online',
]

export function CookiePolicy() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout
      pageType="cookies"
      pagePath="/cookies"
      titleKey="legal.cookies.title"
      subtitleKey="legal.cookies.subtitle"
      descriptionKey="common.seo.cookies.description"
      icon={<Cookie />}
      iconColorClass="from-warning to-warning/60"
      lastUpdated={LAST_UPDATED}
      datePublished={DATE_PUBLISHED}
      keywords={KEYWORDS}
      tocItems={TOC_ITEMS}
    >
      {/* Section 1: What Are Cookies */}
      <LegalSection
        id="what-are-cookies"
        titleKey="legal.cookies.sections.whatAreCookies.title"
        icon={<HelpCircle className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.cookies.sections.whatAreCookies.p1" />
        <LegalParagraph textKey="legal.cookies.sections.whatAreCookies.p2" />
      </LegalSection>

      {/* Section 2: How We Use Cookies */}
      <LegalSection
        id="how-we-use"
        titleKey="legal.cookies.sections.howWeUse.title"
        icon={<ListChecks className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.cookies.sections.howWeUse.p1" />
        <LegalList
          items={[
            'legal.cookies.sections.howWeUse.list.item1',
            'legal.cookies.sections.howWeUse.list.item2',
            'legal.cookies.sections.howWeUse.list.item3',
            'legal.cookies.sections.howWeUse.list.item4',
            'legal.cookies.sections.howWeUse.list.item5',
          ]}
        />
      </LegalSection>

      {/* Section 3: Types of Cookies */}
      <LegalSection
        id="types"
        titleKey="legal.cookies.sections.types.title"
        icon={<Cookie className="h-5 w-5" />}
      >
        <LegalSubsection titleKey="legal.cookies.sections.types.essential.title">
          <LegalParagraph textKey="legal.cookies.sections.types.essential.text" />
          <LegalParagraph
            textKey="legal.cookies.sections.types.essential.examples"
            className="text-sm italic"
          />
        </LegalSubsection>
        <LegalSubsection titleKey="legal.cookies.sections.types.analytics.title">
          <LegalParagraph textKey="legal.cookies.sections.types.analytics.text" />
          <LegalParagraph
            textKey="legal.cookies.sections.types.analytics.examples"
            className="text-sm italic"
          />
          <LegalParagraph textKey="legal.cookies.sections.types.analytics.optOut" />
        </LegalSubsection>
      </LegalSection>

      {/* Section 4: Third-Party Cookies */}
      <LegalSection
        id="third-party"
        titleKey="legal.cookies.sections.thirdParty.title"
        icon={<Globe className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.cookies.sections.thirdParty.p1" />
        <LegalList
          items={[
            'legal.cookies.sections.thirdParty.list.item1',
            'legal.cookies.sections.thirdParty.list.item2',
            'legal.cookies.sections.thirdParty.list.item3',
            'legal.cookies.sections.thirdParty.list.item4',
            'legal.cookies.sections.thirdParty.list.item5',
          ]}
        />
      </LegalSection>

      {/* Section 5: Cookie Duration */}
      <LegalSection
        id="duration"
        titleKey="legal.cookies.sections.duration.title"
        icon={<Clock className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.cookies.sections.duration.p1" />
        <LegalList
          items={[
            'legal.cookies.sections.duration.list.item1',
            'legal.cookies.sections.duration.list.item2',
            'legal.cookies.sections.duration.list.item3',
            'legal.cookies.sections.duration.list.item4',
          ]}
        />
      </LegalSection>

      {/* Section 6: Managing Cookies */}
      <LegalSection
        id="managing"
        titleKey="legal.cookies.sections.managing.title"
        icon={<Settings className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.cookies.sections.managing.p1" />
        <LegalSubsection titleKey="legal.cookies.sections.managing.consent.title">
          <LegalParagraph textKey="legal.cookies.sections.managing.consent.text" />
          <div className="mt-4">
            <Button onClick={showCookiePreferences} variant="secondary">
              {t('cookieConsent.customize')}
            </Button>
          </div>
        </LegalSubsection>
        <LegalSubsection titleKey="legal.cookies.sections.managing.browser.title">
          <LegalParagraph textKey="legal.cookies.sections.managing.browser.text" />
        </LegalSubsection>
        <LegalSubsection titleKey="legal.cookies.sections.managing.settings.title">
          <LegalParagraph textKey="legal.cookies.sections.managing.settings.text" />
        </LegalSubsection>
        <LegalParagraph textKey="legal.cookies.sections.managing.p2" />
      </LegalSection>

      {/* Section 7: Changes */}
      <LegalSection
        id="changes"
        titleKey="legal.cookies.sections.changes.title"
        icon={<FileEdit className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.cookies.sections.changes.p1" />
        <LegalParagraph textKey="legal.cookies.sections.changes.p2" />
      </LegalSection>

      {/* Section 8: Contact */}
      <LegalSection
        id="contact"
        titleKey="legal.cookies.sections.contact.title"
        icon={<Mail className="h-5 w-5" />}
        variant="highlight"
      >
        <LegalParagraph textKey="legal.cookies.sections.contact.p1" />
        <LegalContact
          email="support@growonline.now"
          emailLabel="legal.cookies.sections.contact.emailLabel"
        />
      </LegalSection>
    </LegalPageLayout>
  )
}
