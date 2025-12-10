import { useTranslation } from 'react-i18next'
import {
  Shield,
  Database,
  Eye,
  Share2,
  Globe,
  Clock,
  UserCheck,
  Users,
  Cookie,
  Lock,
  FileEdit,
  Scale,
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
  { id: 'introduction', titleKey: 'legal.privacy.sections.introduction.title' },
  { id: 'data-collected', titleKey: 'legal.privacy.sections.dataCollected.title' },
  { id: 'data-use', titleKey: 'legal.privacy.sections.dataUse.title' },
  { id: 'legal-basis', titleKey: 'legal.privacy.sections.legalBasis.title' },
  { id: 'data-sharing', titleKey: 'legal.privacy.sections.dataSharing.title' },
  { id: 'data-transfers', titleKey: 'legal.privacy.sections.dataTransfers.title' },
  { id: 'data-retention', titleKey: 'legal.privacy.sections.dataRetention.title' },
  { id: 'rights', titleKey: 'legal.privacy.sections.rights.title' },
  { id: 'children', titleKey: 'legal.privacy.sections.children.title' },
  { id: 'cookies', titleKey: 'legal.privacy.sections.cookies.title' },
  { id: 'security', titleKey: 'legal.privacy.sections.security.title' },
  { id: 'changes', titleKey: 'legal.privacy.sections.changes.title' },
  { id: 'ccpa', titleKey: 'legal.privacy.sections.ccpa.title' },
  { id: 'contact', titleKey: 'legal.privacy.sections.contact.title' },
]

const KEYWORDS = [
  'privacy policy',
  'data protection',
  'GDPR',
  'CCPA',
  'personal data',
  'data security',
  'user privacy',
  'Grow Online',
]

export function PrivacyPolicy() {
  const { t } = useTranslation()

  return (
    <LegalPageLayout
      pageType="privacy"
      pagePath="/privacy"
      titleKey="legal.privacy.title"
      subtitleKey="legal.privacy.subtitle"
      descriptionKey="common.seo.privacy.description"
      icon={<Shield />}
      iconColorClass="from-success to-success/60"
      lastUpdated={LAST_UPDATED}
      datePublished={DATE_PUBLISHED}
      keywords={KEYWORDS}
      tocItems={TOC_ITEMS}
    >
      {/* Section 1: Introduction */}
      <LegalSection
        id="introduction"
        titleKey="legal.privacy.sections.introduction.title"
        icon={<Shield className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.introduction.p1" />
        <LegalParagraph textKey="legal.privacy.sections.introduction.p2" />
        <LegalHighlight textKey="legal.privacy.sections.introduction.controllerInfo" />
        <LegalParagraph textKey="legal.privacy.sections.introduction.p3" />
      </LegalSection>

      {/* Section 2: Information We Collect */}
      <LegalSection
        id="data-collected"
        titleKey="legal.privacy.sections.dataCollected.title"
        icon={<Database className="h-5 w-5" />}
      >
        <LegalSubsection titleKey="legal.privacy.sections.dataCollected.accountData.title">
          <LegalList
            items={[
              'legal.privacy.sections.dataCollected.accountData.list.item1',
              'legal.privacy.sections.dataCollected.accountData.list.item2',
              'legal.privacy.sections.dataCollected.accountData.list.item3',
              'legal.privacy.sections.dataCollected.accountData.list.item4',
            ]}
          />
        </LegalSubsection>
        <LegalSubsection titleKey="legal.privacy.sections.dataCollected.socialData.title">
          <LegalList
            items={[
              'legal.privacy.sections.dataCollected.socialData.list.item1',
              'legal.privacy.sections.dataCollected.socialData.list.item2',
              'legal.privacy.sections.dataCollected.socialData.list.item3',
              'legal.privacy.sections.dataCollected.socialData.list.item4',
            ]}
          />
        </LegalSubsection>
        <LegalSubsection titleKey="legal.privacy.sections.dataCollected.usageData.title">
          <LegalList
            items={[
              'legal.privacy.sections.dataCollected.usageData.list.item1',
              'legal.privacy.sections.dataCollected.usageData.list.item2',
              'legal.privacy.sections.dataCollected.usageData.list.item3',
              'legal.privacy.sections.dataCollected.usageData.list.item4',
              'legal.privacy.sections.dataCollected.usageData.list.item5',
            ]}
          />
        </LegalSubsection>
      </LegalSection>

      {/* Section 3: How We Use Your Information */}
      <LegalSection
        id="data-use"
        titleKey="legal.privacy.sections.dataUse.title"
        icon={<Eye className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.dataUse.p1" />
        <LegalList
          items={[
            'legal.privacy.sections.dataUse.list.item1',
            'legal.privacy.sections.dataUse.list.item2',
            'legal.privacy.sections.dataUse.list.item3',
            'legal.privacy.sections.dataUse.list.item4',
            'legal.privacy.sections.dataUse.list.item5',
            'legal.privacy.sections.dataUse.list.item6',
            'legal.privacy.sections.dataUse.list.item7',
            'legal.privacy.sections.dataUse.list.item8',
            'legal.privacy.sections.dataUse.list.item9',
          ]}
        />
      </LegalSection>

      {/* Section 4: Legal Basis */}
      <LegalSection
        id="legal-basis"
        titleKey="legal.privacy.sections.legalBasis.title"
        icon={<Scale className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.legalBasis.p1" />
        <LegalList
          items={[
            'legal.privacy.sections.legalBasis.list.item1',
            'legal.privacy.sections.legalBasis.list.item2',
            'legal.privacy.sections.legalBasis.list.item3',
            'legal.privacy.sections.legalBasis.list.item4',
          ]}
        />
        <LegalParagraph textKey="legal.privacy.sections.legalBasis.p2" />
      </LegalSection>

      {/* Section 5: Data Sharing */}
      <LegalSection
        id="data-sharing"
        titleKey="legal.privacy.sections.dataSharing.title"
        icon={<Share2 className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.dataSharing.p1" />
        <LegalSubsection titleKey="legal.privacy.sections.dataSharing.socialPlatforms.title">
          <LegalParagraph textKey="legal.privacy.sections.dataSharing.socialPlatforms.text" />
        </LegalSubsection>
        <LegalSubsection titleKey="legal.privacy.sections.dataSharing.serviceProviders.title">
          <LegalList
            items={[
              'legal.privacy.sections.dataSharing.serviceProviders.list.item1',
              'legal.privacy.sections.dataSharing.serviceProviders.list.item2',
              'legal.privacy.sections.dataSharing.serviceProviders.list.item3',
              'legal.privacy.sections.dataSharing.serviceProviders.list.item4',
              'legal.privacy.sections.dataSharing.serviceProviders.list.item5',
            ]}
          />
        </LegalSubsection>
        <LegalSubsection titleKey="legal.privacy.sections.dataSharing.legalRequirements.title">
          <LegalParagraph textKey="legal.privacy.sections.dataSharing.legalRequirements.text" />
        </LegalSubsection>
        <LegalHighlight textKey="legal.privacy.sections.dataSharing.noSale" />
      </LegalSection>

      {/* Section 6: International Transfers */}
      <LegalSection
        id="data-transfers"
        titleKey="legal.privacy.sections.dataTransfers.title"
        icon={<Globe className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.dataTransfers.p1" />
        <LegalParagraph textKey="legal.privacy.sections.dataTransfers.p2" />
        <LegalList
          items={[
            'legal.privacy.sections.dataTransfers.list.item1',
            'legal.privacy.sections.dataTransfers.list.item2',
            'legal.privacy.sections.dataTransfers.list.item3',
          ]}
        />
      </LegalSection>

      {/* Section 7: Data Retention */}
      <LegalSection
        id="data-retention"
        titleKey="legal.privacy.sections.dataRetention.title"
        icon={<Clock className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.dataRetention.p1" />
        <LegalList
          items={[
            'legal.privacy.sections.dataRetention.list.item1',
            'legal.privacy.sections.dataRetention.list.item2',
            'legal.privacy.sections.dataRetention.list.item3',
            'legal.privacy.sections.dataRetention.list.item4',
          ]}
        />
        <LegalParagraph textKey="legal.privacy.sections.dataRetention.p2" />
      </LegalSection>

      {/* Section 8: Your Rights */}
      <LegalSection
        id="rights"
        titleKey="legal.privacy.sections.rights.title"
        icon={<UserCheck className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.rights.p1" />
        <LegalSubsection titleKey="legal.privacy.sections.rights.gdprRights.title">
          <LegalList
            items={[
              'legal.privacy.sections.rights.gdprRights.list.item1',
              'legal.privacy.sections.rights.gdprRights.list.item2',
              'legal.privacy.sections.rights.gdprRights.list.item3',
              'legal.privacy.sections.rights.gdprRights.list.item4',
              'legal.privacy.sections.rights.gdprRights.list.item5',
              'legal.privacy.sections.rights.gdprRights.list.item6',
              'legal.privacy.sections.rights.gdprRights.list.item7',
            ]}
          />
        </LegalSubsection>
        <LegalParagraph textKey="legal.privacy.sections.rights.p2" />
      </LegalSection>

      {/* Section 9: Children's Privacy */}
      <LegalSection
        id="children"
        titleKey="legal.privacy.sections.children.title"
        icon={<Users className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.children.p1" />
        <LegalParagraph textKey="legal.privacy.sections.children.p2" />
      </LegalSection>

      {/* Section 10: Cookies */}
      <LegalSection
        id="cookies"
        titleKey="legal.privacy.sections.cookies.title"
        icon={<Cookie className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.cookies.p1" />
        <LegalParagraph textKey="legal.privacy.sections.cookies.p2" />
      </LegalSection>

      {/* Section 11: Data Security */}
      <LegalSection
        id="security"
        titleKey="legal.privacy.sections.security.title"
        icon={<Lock className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.security.p1" />
        <LegalList
          items={[
            'legal.privacy.sections.security.list.item1',
            'legal.privacy.sections.security.list.item2',
            'legal.privacy.sections.security.list.item3',
            'legal.privacy.sections.security.list.item4',
            'legal.privacy.sections.security.list.item5',
          ]}
        />
        <LegalParagraph textKey="legal.privacy.sections.security.p2" />
      </LegalSection>

      {/* Section 12: Changes */}
      <LegalSection
        id="changes"
        titleKey="legal.privacy.sections.changes.title"
        icon={<FileEdit className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.changes.p1" />
        <LegalList
          items={[
            'legal.privacy.sections.changes.list.item1',
            'legal.privacy.sections.changes.list.item2',
            'legal.privacy.sections.changes.list.item3',
          ]}
        />
        <LegalParagraph textKey="legal.privacy.sections.changes.p2" />
      </LegalSection>

      {/* Section 13: CCPA */}
      <LegalSection
        id="ccpa"
        titleKey="legal.privacy.sections.ccpa.title"
        icon={<Scale className="h-5 w-5" />}
      >
        <LegalParagraph textKey="legal.privacy.sections.ccpa.p1" />
        <LegalList
          items={[
            'legal.privacy.sections.ccpa.list.item1',
            'legal.privacy.sections.ccpa.list.item2',
            'legal.privacy.sections.ccpa.list.item3',
            'legal.privacy.sections.ccpa.list.item4',
          ]}
        />
        <LegalParagraph textKey="legal.privacy.sections.ccpa.p2" />
      </LegalSection>

      {/* Section 14: Contact */}
      <LegalSection
        id="contact"
        titleKey="legal.privacy.sections.contact.title"
        icon={<Mail className="h-5 w-5" />}
        variant="highlight"
      >
        <LegalParagraph textKey="legal.privacy.sections.contact.p1" />
        <LegalContact
          email="privacy@growonline.now"
          emailLabel="legal.privacy.sections.contact.emailLabel"
        />
        <LegalContact
          email="support@growonline.now"
          emailLabel="legal.privacy.sections.contact.generalLabel"
          address={t('legal.common.businessAddress')}
          addressLabel="legal.privacy.sections.contact.addressLabel"
        />
        <LegalParagraph
          textKey="legal.privacy.sections.contact.dpoText"
          className="mt-4 text-sm italic"
        />
      </LegalSection>
    </LegalPageLayout>
  )
}
