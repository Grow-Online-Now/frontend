interface FooterLink {
  labelKey: string
  href: string
  external?: boolean
}

interface FooterSection {
  titleKey: string
  links: FooterLink[]
}

/**
 * Footer sections configuration
 * Only includes links to pages that actually exist in the application
 */
export const footerSections: FooterSection[] = [
  {
    titleKey: 'waitlist.footer.sections.product.title',
    links: [
      { labelKey: 'waitlist.footer.sections.product.pricing', href: '/#pricing' },
      { labelKey: 'waitlist.footer.sections.product.faq', href: '/#faq' },
      { labelKey: 'waitlist.footer.sections.product.blog', href: '/blog' },
      { labelKey: 'waitlist.footer.sections.product.freeTools', href: '/free-tools' },
    ],
  },
  {
    titleKey: 'waitlist.footer.sections.freeTools.title',
    links: [
      {
        labelKey: 'waitlist.footer.sections.freeTools.linkedinPreview',
        href: '/free-tools/linkedin-post-preview-tool',
      },
      {
        labelKey: 'waitlist.footer.sections.freeTools.bestTimeToPost',
        href: '/free-tools/best-time-to-post-calculator',
      },
    ],
  },
  {
    titleKey: 'waitlist.footer.sections.compare.title',
    links: [
      { labelKey: 'waitlist.footer.sections.compare.hootsuite', href: '/alternatives/hootsuite' },
      { labelKey: 'waitlist.footer.sections.compare.buffer', href: '/alternatives/buffer' },
      { labelKey: 'waitlist.footer.sections.compare.later', href: '/alternatives/later' },
      {
        labelKey: 'waitlist.footer.sections.compare.sproutsocial',
        href: '/alternatives/sproutsocial',
      },
      { labelKey: 'waitlist.footer.sections.compare.planoly', href: '/alternatives/planoly' },
      { labelKey: 'waitlist.footer.sections.compare.metricool', href: '/alternatives/metricool' },
      { labelKey: 'waitlist.footer.sections.compare.postbridge', href: '/alternatives/postbridge' },
      { labelKey: 'waitlist.footer.sections.compare.postiz', href: '/alternatives/postiz' },
      {
        labelKey: 'waitlist.footer.sections.compare.postplanify',
        href: '/alternatives/postplanify',
      },
    ],
  },
  {
    titleKey: 'waitlist.footer.sections.platforms.title',
    links: [
      { labelKey: 'waitlist.footer.sections.platforms.instagram', href: '/platforms/instagram' },
      { labelKey: 'waitlist.footer.sections.platforms.facebook', href: '/platforms/facebook' },
      { labelKey: 'waitlist.footer.sections.platforms.youtube', href: '/platforms/youtube' },
      { labelKey: 'waitlist.footer.sections.platforms.tiktok', href: '/platforms/tiktok' },
      { labelKey: 'waitlist.footer.sections.platforms.x', href: '/platforms/x' },
      { labelKey: 'waitlist.footer.sections.platforms.linkedin', href: '/platforms/linkedin' },
      { labelKey: 'waitlist.footer.sections.platforms.threads', href: '/platforms/threads' },
      { labelKey: 'waitlist.footer.sections.platforms.pinterest', href: '/platforms/pinterest' },
      { labelKey: 'waitlist.footer.sections.platforms.bluesky', href: '/platforms/bluesky' },
    ],
  },
  {
    titleKey: 'waitlist.footer.sections.legal.title',
    links: [
      { labelKey: 'waitlist.footer.sections.legal.terms', href: '/terms' },
      { labelKey: 'waitlist.footer.sections.legal.privacy', href: '/privacy' },
      { labelKey: 'waitlist.footer.sections.legal.cookies', href: '/cookies' },
    ],
  },
]
