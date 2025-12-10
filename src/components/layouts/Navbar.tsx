import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import InstagramIcon from '@/assets/icons/instagram.svg'
import TiktokIcon from '@/assets/icons/tiktok.svg'
import YoutubeIcon from '@/assets/icons/youtube.svg'
import LinkedinIcon from '@/assets/icons/linkedin.svg'
import XIcon from '@/assets/icons/x.svg'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

interface NavLinkItem {
  labelKey: string
  href: string
}

interface SubmenuItem {
  titleKey: string
  descriptionKey?: string
  href: string
  icon?: React.ReactNode
}

const simpleNavLinks: NavLinkItem[] = [
  { labelKey: 'landing.navbar.features', href: '/#features' },
  { labelKey: 'landing.navbar.pricing', href: '/#pricing' },
]

const platformSubmenuItems: SubmenuItem[] = [
  {
    titleKey: 'landing.navbar.platformsSubmenu.instagram',
    descriptionKey: 'landing.navbar.platformsSubmenu.instagramDesc',
    href: '/platforms/instagram',
    icon: <img src={InstagramIcon} alt="" className="h-5 w-5" />,
  },
  {
    titleKey: 'landing.navbar.platformsSubmenu.tiktok',
    descriptionKey: 'landing.navbar.platformsSubmenu.tiktokDesc',
    href: '/platforms/tiktok',
    icon: <img src={TiktokIcon} alt="" className="h-5 w-5" />,
  },
  {
    titleKey: 'landing.navbar.platformsSubmenu.youtube',
    descriptionKey: 'landing.navbar.platformsSubmenu.youtubeDesc',
    href: '/platforms/youtube',
    icon: <img src={YoutubeIcon} alt="" className="h-5 w-5" />,
  },
  {
    titleKey: 'landing.navbar.platformsSubmenu.linkedin',
    descriptionKey: 'landing.navbar.platformsSubmenu.linkedinDesc',
    href: '/platforms/linkedin',
    icon: <img src={LinkedinIcon} alt="" className="h-5 w-5" />,
  },
  {
    titleKey: 'landing.navbar.platformsSubmenu.twitter',
    descriptionKey: 'landing.navbar.platformsSubmenu.twitterDesc',
    href: '/platforms/twitter',
    icon: <img src={XIcon} alt="" className="h-5 w-5" />,
  },
]

const blogCategories: SubmenuItem[] = [
  {
    titleKey: 'landing.navbar.blogSubmenu.tips',
    href: '/blog?category=tips',
  },
  {
    titleKey: 'landing.navbar.blogSubmenu.tutorials',
    href: '/blog?category=tutorials',
  },
  {
    titleKey: 'landing.navbar.blogSubmenu.caseStudies',
    href: '/blog?category=case-studies',
  },
  {
    titleKey: 'landing.navbar.blogSubmenu.news',
    href: '/blog?category=news',
  },
]

// Keep for mobile menu
const allNavLinks: NavLinkItem[] = [
  { labelKey: 'landing.navbar.features', href: '/#features' },
  { labelKey: 'landing.navbar.pricing', href: '/#pricing' },
  { labelKey: 'landing.navbar.blog', href: '/blog' },
  { labelKey: 'landing.navbar.platforms', href: '/platforms' },
]

interface NavbarProps {
  variant?: 'default' | 'dark'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isDark = variant === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
          isScrolled ? 'py-3' : 'py-5'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className={cn(
              'relative flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300',
              isScrolled
                ? isDark
                  ? 'border-zinc-800 bg-zinc-900/90 shadow-lg backdrop-blur-lg'
                  : 'glass shadow-lg shadow-black/10'
                : 'border-transparent bg-transparent'
            )}
          >
            {/* Logo */}
            <motion.a href={localizeHref('/')} className="relative z-10 flex items-center gap-2">
              <img
                src="/images/logo/logo-64.png"
                alt="Grow Online"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg"
              />
              <span className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-foreground')}>
                Grow Online
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-1">
                {/* Simple links (Features, Pricing) */}
                {simpleNavLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={localizeHref(link.href)}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-transparent transition-colors duration-200',
                        isDark
                          ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800'
                          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:bg-foreground/5'
                      )}
                    >
                      {t(link.labelKey)}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* Platforms Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'bg-transparent transition-colors duration-200',
                      isDark
                        ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 data-[state=open]:bg-zinc-800'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:bg-foreground/5 data-[state=open]:bg-foreground/5'
                    )}
                  >
                    {t('landing.navbar.platforms')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-3 md:grid-cols-2">
                      {platformSubmenuItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={localizeHref(item.href)}
                              className={cn(
                                'flex items-start gap-3 rounded-lg p-3 leading-none no-underline transition-colors outline-none select-none',
                                isDark
                                  ? 'hover:bg-zinc-800 focus:bg-zinc-800'
                                  : 'hover:bg-accent focus:bg-accent'
                              )}
                            >
                              {item.icon && <div className="mt-0.5 shrink-0">{item.icon}</div>}
                              <div>
                                <div className="text-sm leading-none font-medium">
                                  {t(item.titleKey)}
                                </div>
                                {item.descriptionKey && (
                                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-snug">
                                    {t(item.descriptionKey)}
                                  </p>
                                )}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Blog Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'bg-transparent transition-colors duration-200',
                      isDark
                        ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 data-[state=open]:bg-zinc-800'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:bg-foreground/5 data-[state=open]:bg-foreground/5'
                    )}
                  >
                    {t('landing.navbar.blog')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {/* Featured Section */}
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <a
                            href={localizeHref('/blog')}
                            className={cn(
                              'flex h-full w-full flex-col justify-end rounded-md p-6 no-underline transition-colors outline-none select-none',
                              isDark
                                ? 'bg-gradient-to-b from-zinc-800/50 to-zinc-800 hover:from-zinc-700/50 hover:to-zinc-700'
                                : 'from-muted/50 to-muted hover:from-muted hover:to-muted/80 bg-gradient-to-b'
                            )}
                          >
                            <div className="mb-2 text-lg font-medium">
                              {t('landing.navbar.blogSubmenu.featured')}
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              {t('landing.navbar.blogSubmenu.featuredDesc')}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {/* Category Links */}
                      {blogCategories.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={localizeHref(item.href)}
                              className={cn(
                                'block rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
                                isDark
                                  ? 'hover:bg-zinc-800 focus:bg-zinc-800'
                                  : 'hover:bg-accent focus:bg-accent'
                              )}
                            >
                              <div className="text-sm leading-none font-medium">
                                {t(item.titleKey)}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-3 md:flex">
              <Button
                variant="ghost"
                className={cn(
                  isDark
                    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                )}
                asChild
              >
                <a href={localizeHref('/login')}>{t('landing.navbar.login')}</a>
              </Button>
              <Button
                className={cn(
                  'border-0 px-5',
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'glass-button'
                )}
                asChild
              >
                <a href={localizeHref('/signup')}>{t('landing.navbar.getStarted')}</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={cn(
                'relative z-10 flex h-10 w-10 items-center justify-center rounded-lg md:hidden',
                isDark ? 'text-white hover:bg-zinc-800' : 'text-foreground hover:bg-foreground/5'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={t('landing.navbar.mobileMenuAriaLabel')}
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu navLinks={allNavLinks} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

interface MobileMenuProps {
  navLinks: NavLinkItem[]
  onClose: () => void
}

function MobileMenu({ navLinks, onClose }: MobileMenuProps) {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 md:hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-background/80 absolute inset-0 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Menu Content */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative flex h-full flex-col items-center justify-center gap-8 p-8"
      >
        {/* Navigation Links */}
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={localizeHref(link.href)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              className="text-muted-foreground hover:text-foreground text-2xl font-medium transition-colors"
              onClick={onClose}
            >
              {t(link.labelKey)}
            </motion.a>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground text-lg"
            asChild
          >
            <a href={localizeHref('/login')} onClick={onClose}>
              {t('landing.navbar.login')}
            </a>
          </Button>
          <Button size="lg" className="glass-button border-0 px-8 text-lg" asChild>
            <a href={localizeHref('/signup')} onClick={onClose}>
              {t('landing.navbar.getStarted')}
            </a>
          </Button>
        </motion.div>
      </motion.nav>
    </motion.div>
  )
}
