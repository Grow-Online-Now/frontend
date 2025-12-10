import { useTranslation } from 'react-i18next'
import {
  FileText,
  Zap,
  Shield,
  CreditCard,
  Ban,
  Copyright,
  Globe,
  Cpu,
  Scale,
  XCircle,
  Gavel,
  Mail,
} from 'lucide-react'
import {
  LegalPageLayout,
  LegalSection,
  LegalParagraph,
  LegalList,
  LegalSubsection,
  LegalHighlight,
  LegalContact,
  type TocItem,
} from '@/components/legal'

const LAST_UPDATED = '2025-12-03'
const DATE_PUBLISHED = '2025-11-01'

const TOC_ITEMS: TocItem[] = [
  { id: 'introduction', titleKey: 'legal.terms.sections.introduction.title' },
  { id: 'services', titleKey: 'legal.terms.sections.services.title' },
  { id: 'accounts', titleKey: 'legal.terms.sections.accounts.title' },
  { id: 'payments', titleKey: 'legal.terms.sections.payments.title' },
  { id: 'acceptable-use', titleKey: 'legal.terms.sections.acceptableUse.title' },
  { id: 'content', titleKey: 'legal.terms.sections.content.title' },
  { id: 'third-party', titleKey: 'legal.terms.sections.thirdParty.title' },
  { id: 'ai-content', titleKey: 'legal.terms.sections.aiContent.title' },
  { id: 'liability', titleKey: 'legal.terms.sections.liability.title' },
  { id: 'termination', titleKey: 'legal.terms.sections.termination.title' },
  { id: 'governing-law', titleKey: 'legal.terms.sections.governingLaw.title' },
  { id: 'contact', titleKey: 'legal.terms.sections.contact.title' },
]

const KEYWORDS = [
  'terms of service',
  'user agreement',
  'social media terms',
  'platform terms',
  'legal terms',
  'Grow Online',
]

export function TermsOfService() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout
      pageType="terms"
      pagePath="/terms"
      titleKey="legal.terms.title"
      subtitleKey="legal.terms.subtitle"
      descriptionKey="common.seo.terms.description"
      icon={<FileText />}
      iconColorClass="from-primary to-primary/60"
      lastUpdated={LAST_UPDATED}
      datePublished={DATE_PUBLISHED}
      keywords={KEYWORDS}
      tocItems={TOC_ITEMS}
    >
      {/* Section 1: Introduction */}
      <LegalSection
        id="introduction"
        titleKey="legal.terms.sections.introduction.title"
        icon={<Zap className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.introduction.p1" />
        <LegalParagraph textKey="legal.terms.sections.introduction.p2" />
        <LegalParagraph textKey="legal.terms.sections.introduction.p3" />
      </LegalSection>

      {/* Section 2: Services */}
      <LegalSection
        id="services"
        titleKey="legal.terms.sections.services.title"
        icon={<Globe className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.services.p1" />
        <LegalList
          items={[
            'legal.terms.sections.services.list.item1',
            'legal.terms.sections.services.list.item2',
            'legal.terms.sections.services.list.item3',
            'legal.terms.sections.services.list.item4',
            'legal.terms.sections.services.list.item5',
            'legal.terms.sections.services.list.item6',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.services.p2" />
      </LegalSection>

      {/* Section 3: Accounts */}
      <LegalSection
        id="accounts"
        titleKey="legal.terms.sections.accounts.title"
        icon={<Shield className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.accounts.p1" />
        <LegalList
          items={[
            'legal.terms.sections.accounts.list.item1',
            'legal.terms.sections.accounts.list.item2',
            'legal.terms.sections.accounts.list.item3',
            'legal.terms.sections.accounts.list.item4',
            'legal.terms.sections.accounts.list.item5',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.accounts.p2" />
      </LegalSection>

      {/* Section 4: Payments */}
      <LegalSection
        id="payments"
        titleKey="legal.terms.sections.payments.title"
        icon={<CreditCard className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.payments.p1" />
        <LegalList
          items={[
            'legal.terms.sections.payments.list.item1',
            'legal.terms.sections.payments.list.item2',
            'legal.terms.sections.payments.list.item3',
            'legal.terms.sections.payments.list.item4',
          ]}
        />
        <LegalSubsection titleKey="legal.terms.sections.payments.refundTitle">
          <LegalParagraph textKey="legal.terms.sections.payments.refundText" />
        </LegalSubsection>
        <LegalParagraph textKey="legal.terms.sections.payments.p2" />
      </LegalSection>

      {/* Section 5: Acceptable Use */}
      <LegalSection
        id="acceptable-use"
        titleKey="legal.terms.sections.acceptableUse.title"
        icon={<Ban className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.acceptableUse.p1" />
        <LegalList
          items={[
            'legal.terms.sections.acceptableUse.list.item1',
            'legal.terms.sections.acceptableUse.list.item2',
            'legal.terms.sections.acceptableUse.list.item3',
            'legal.terms.sections.acceptableUse.list.item4',
            'legal.terms.sections.acceptableUse.list.item5',
            'legal.terms.sections.acceptableUse.list.item6',
            'legal.terms.sections.acceptableUse.list.item7',
            'legal.terms.sections.acceptableUse.list.item8',
            'legal.terms.sections.acceptableUse.list.item9',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.acceptableUse.p2" />
      </LegalSection>

      {/* Section 6: Content & IP */}
      <LegalSection
        id="content"
        titleKey="legal.terms.sections.content.title"
        icon={<Copyright className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.content.p1" />
        <LegalList
          items={[
            'legal.terms.sections.content.list.item1',
            'legal.terms.sections.content.list.item2',
            'legal.terms.sections.content.list.item3',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.content.p2" />
      </LegalSection>

      {/* Section 7: Third-Party Platforms */}
      <LegalSection
        id="third-party"
        titleKey="legal.terms.sections.thirdParty.title"
        icon={<Globe className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.thirdParty.p1" />
        <LegalHighlight textKey="legal.terms.sections.thirdParty.platforms" />
        <LegalParagraph textKey="legal.terms.sections.thirdParty.p2" />
        <LegalList
          items={[
            'legal.terms.sections.thirdParty.list.item1',
            'legal.terms.sections.thirdParty.list.item2',
            'legal.terms.sections.thirdParty.list.item3',
            'legal.terms.sections.thirdParty.list.item4',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.thirdParty.p3" />
      </LegalSection>

      {/* Section 8: AI Content */}
      <LegalSection
        id="ai-content"
        titleKey="legal.terms.sections.aiContent.title"
        icon={<Cpu className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.aiContent.p1" />
        <LegalList
          items={[
            'legal.terms.sections.aiContent.list.item1',
            'legal.terms.sections.aiContent.list.item2',
            'legal.terms.sections.aiContent.list.item3',
            'legal.terms.sections.aiContent.list.item4',
            'legal.terms.sections.aiContent.list.item5',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.aiContent.p2" />
      </LegalSection>

      {/* Section 9: Liability */}
      <LegalSection
        id="liability"
        titleKey="legal.terms.sections.liability.title"
        icon={<Scale className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.liability.p1" />
        <LegalList
          items={[
            'legal.terms.sections.liability.list.item1',
            'legal.terms.sections.liability.list.item2',
            'legal.terms.sections.liability.list.item3',
            'legal.terms.sections.liability.list.item4',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.liability.p2" />
      </LegalSection>

      {/* Section 10: Termination */}
      <LegalSection
        id="termination"
        titleKey="legal.terms.sections.termination.title"
        icon={<XCircle className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.termination.p1" />
        <LegalList
          items={[
            'legal.terms.sections.termination.list.item1',
            'legal.terms.sections.termination.list.item2',
            'legal.terms.sections.termination.list.item3',
          ]}
        />
        <LegalParagraph textKey="legal.terms.sections.termination.p2" />
      </LegalSection>

      {/* Section 11: Governing Law */}
      <LegalSection
        id="governing-law"
        titleKey="legal.terms.sections.governingLaw.title"
        icon={<Gavel className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.terms.sections.governingLaw.p1" />
        <LegalParagraph textKey="legal.terms.sections.governingLaw.p2" />
        <LegalParagraph textKey="legal.terms.sections.governingLaw.p3" />
      </LegalSection>

      {/* Section 12: Contact */}
      <LegalSection
        id="contact"
        titleKey="legal.terms.sections.contact.title"
        icon={<Mail className="h-5 w-5" />}
        variant="highlight"
      >
        <LegalParagraph textKey="legal.terms.sections.contact.p1" />
        <LegalContact
          email="support@growonline.now"
          emailLabel="legal.terms.sections.contact.emailLabel"
          address={t('legal.common.businessAddress')}
          addressLabel="legal.terms.sections.contact.addressLabel"
        />
      </LegalSection>
    </LegalPageLayout>
  )
}
