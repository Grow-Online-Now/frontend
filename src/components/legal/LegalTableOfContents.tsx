import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

export interface TocItem {
  id: string
  titleKey: string
}

interface LegalTableOfContentsProps {
  items: TocItem[]
  className?: string
}

export function LegalTableOfContents({ items, className }: LegalTableOfContentsProps) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%', threshold: 0 }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className={cn('hidden lg:block', className)}>
      <div className="sticky top-24 space-y-4">
        <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <List className="h-4 w-4" />
          {t('legal.common.tableOfContents')}
        </div>
        <ul className="border-border space-y-2 border-l">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  '-ml-px border-l-2 pl-4 text-left text-sm transition-colors',
                  activeId === item.id
                    ? 'border-primary text-primary font-medium'
                    : 'text-muted-foreground hover:border-border hover:text-foreground border-transparent'
                )}
              >
                {t(item.titleKey)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
