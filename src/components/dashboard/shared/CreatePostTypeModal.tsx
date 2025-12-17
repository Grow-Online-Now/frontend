/**
 * CreatePostTypeModal
 * Minimal modal for choosing between text-first and media-first post creation
 */

import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Type, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { SocialPlatform } from '@/types/connections'

interface CreatePostTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PostTypeOption {
  id: 'text' | 'media'
  titleKey: string
  descriptionKey: string
  icon: typeof Type
  href: string
  platforms: SocialPlatform[]
}

const postTypes: PostTypeOption[] = [
  {
    id: 'text',
    titleKey: 'dashboard.createTypeModal.text.title',
    descriptionKey: 'dashboard.createTypeModal.text.description',
    icon: Type,
    href: '/dashboard/create/text',
    platforms: ['linkedin', 'twitter', 'facebook'],
  },
  {
    id: 'media',
    titleKey: 'dashboard.createTypeModal.media.title',
    descriptionKey: 'dashboard.createTypeModal.media.description',
    icon: ImageIcon,
    href: '/dashboard/create/media',
    platforms: ['instagram', 'tiktok', 'youtube', 'pinterest'],
  },
]

export function CreatePostTypeModal({ open, onOpenChange }: CreatePostTypeModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  const handleSelect = useCallback(
    (option: PostTypeOption) => {
      onOpenChange(false)
      setTimeout(() => {
        navigate(`/${lang}${option.href}`)
      }, 100)
    },
    [navigate, lang, onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {t('dashboard.createTypeModal.title')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t('dashboard.createTypeModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 p-6 pt-4">
          {postTypes.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'group flex flex-col items-center gap-3 rounded-xl p-5 text-center',
                'border border-transparent',
                'bg-muted/40 hover:bg-muted/70',
                'transition-all duration-150',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  'bg-background shadow-sm',
                  'transition-transform duration-150 group-hover:scale-105'
                )}
              >
                <option.icon className="text-foreground h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground text-sm font-medium">{t(option.titleKey)}</h3>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {t(option.descriptionKey)}
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {option.platforms.map((platform) => (
                    <PlatformIcon key={platform} platform={platform} size="xs" />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
