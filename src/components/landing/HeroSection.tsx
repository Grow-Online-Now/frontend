import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'

// Platform Icons as SVG components
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )
}

const platforms = [
  { name: 'Instagram', icon: InstagramIcon },
  { name: 'TikTok', icon: TikTokIcon },
  { name: 'X', icon: XIcon },
  { name: 'LinkedIn', icon: LinkedInIcon },
  { name: 'YouTube', icon: YouTubeIcon },
  { name: 'Pinterest', icon: PinterestIcon },
]

// Avatar stack component
function AvatarStack() {
  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  ]

  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          className="bg-muted border-background relative h-8 w-8 overflow-hidden rounded-full border-2"
        >
          <img
            src={avatar}
            alt="Grow Online community member"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  )
}

export function HeroSection() {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()

  return (
    <section className="relative mt-8 overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-40">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-foreground mb-6 text-center text-4xl leading-[1.15] font-medium tracking-tight sm:text-5xl lg:text-6xl"
        >
          {t('landing.hero.titleStart')}{' '}
          <em className="text-primary not-italic">{t('landing.hero.titleHighlight')}</em>{' '}
          {t('landing.hero.titleEnd')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed"
        >
          {t('landing.hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className={cn(
              'h-12 min-w-[160px] rounded-xl px-8 text-base font-semibold',
              'from-primary to-primary/70 bg-linear-to-r text-white',
              'shadow-primary/25 hover:shadow-primary/30 shadow-lg hover:shadow-xl',
              'transition-all duration-200 hover:-translate-y-0.5'
            )}
            asChild
          >
            <a href={localizeHref('/signup')}>{t('landing.hero.ctaPrimary')}</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={cn(
              'border-border bg-background h-12 min-w-[160px] rounded-xl px-8 text-base font-semibold',
              'hover:bg-muted/50 transition-all duration-200 hover:-translate-y-0.5'
            )}
            asChild
          >
            <a href={localizeHref('/contact')}>{t('landing.hero.ctaSecondary')}</a>
          </Button>
        </motion.div>

        {/* Social Proof & Platforms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8"
        >
          {/* Avatar Stack + Count */}
          <div className="flex items-center gap-3">
            <AvatarStack />
            <span className="text-muted-foreground text-sm">
              {t('landing.hero.socialProof', { count: 1247 })}
            </span>
          </div>

          {/* Divider */}
          <div className="bg-border hidden h-6 w-px sm:block" />

          {/* Platform Icons */}
          <div className="flex items-center gap-3">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="group"
                title={platform.name}
              >
                <platform.icon className="text-foreground/30 group-hover:text-foreground/60 h-5 w-5 transition-colors" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto"
        >
          <div className="border-border from-muted to-secondary relative aspect-video w-full overflow-hidden rounded-2xl border bg-linear-to-br shadow-2xl shadow-black/10">
            {/* Placeholder Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-background dark:bg-card mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg shadow-black/10 transition-shadow hover:shadow-xl"
              >
                <Play className="fill-primary text-primary ml-1 h-8 w-8" />
              </motion.button>
              <p className="text-muted-foreground text-sm font-medium">
                {t('landing.hero.videoPlaceholder')}
              </p>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
