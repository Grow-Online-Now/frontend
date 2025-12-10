import { cn } from '@/lib/utils'

interface SocialLink {
  name: string
  href: string
  icon: React.ReactNode
}

const socialLinks: SocialLink[] = [
  {
    name: 'X',
    href: '#',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

interface FooterSocialLinksProps {
  className?: string
}

export function FooterSocialLinks({ className }: FooterSocialLinksProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary flex h-10 w-10 items-center justify-center rounded-lg transition-all"
        >
          {social.icon}
        </a>
      ))}
    </div>
  )
}
