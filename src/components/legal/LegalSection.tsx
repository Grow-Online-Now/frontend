import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/common/Card'
import { Paragraph } from '@/components/common/Typography'
import { cn } from '@/lib/utils'

interface LegalSectionProps {
  id: string
  titleKey: string
  icon?: React.ReactNode
  children: React.ReactNode
  variant?: 'default' | 'highlight'
  className?: string
}

export function LegalSection({
  id,
  titleKey,
  icon,
  children,
  variant = 'default',
  className,
}: LegalSectionProps) {
  const { t } = useTranslation()

  return (
    <section id={id} className="scroll-mt-24">
      <Card
        variant="extra-rounding"
        className={cn(variant === 'highlight' && 'border-primary/20 bg-primary/5', className)}
      >
        <CardContent className="space-y-4">
          <h2 className="text-foreground flex items-center gap-3 text-lg font-semibold">
            {icon && <span className="text-primary">{icon}</span>}
            {t(titleKey)}
          </h2>
          <div className="space-y-4">{children}</div>
        </CardContent>
      </Card>
    </section>
  )
}

interface LegalParagraphProps {
  textKey?: string
  children?: React.ReactNode
  className?: string
}

export function LegalParagraph({ textKey, children, className }: LegalParagraphProps) {
  const { t } = useTranslation()

  return (
    <Paragraph size="md" color="gray-500" className={cn('leading-relaxed', className)}>
      {textKey ? t(textKey) : children}
    </Paragraph>
  )
}

interface LegalListProps {
  items: string[]
  className?: string
}

export function LegalList({ items, className }: LegalListProps) {
  const { t } = useTranslation()

  return (
    <ul className={cn('ml-6 list-disc space-y-2', className)}>
      {items.map((itemKey) => (
        <li key={itemKey} className="text-muted-foreground">
          {t(itemKey)}
        </li>
      ))}
    </ul>
  )
}

interface LegalSubsectionProps {
  titleKey: string
  children: React.ReactNode
  className?: string
}

export function LegalSubsection({ titleKey, children, className }: LegalSubsectionProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-foreground font-medium">{t(titleKey)}</h3>
      {children}
    </div>
  )
}

interface LegalHighlightProps {
  textKey: string
  className?: string
}

export function LegalHighlight({ textKey, className }: LegalHighlightProps) {
  const { t } = useTranslation()

  return <p className={cn('text-foreground font-semibold', className)}>{t(textKey)}</p>
}

interface LegalContactProps {
  email: string
  emailLabel?: string
  address?: string
  addressLabel?: string
  className?: string
}

export function LegalContact({
  email,
  emailLabel,
  address,
  addressLabel,
  className,
}: LegalContactProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('mt-4 space-y-2', className)}>
      {emailLabel && <p className="text-muted-foreground text-sm">{t(emailLabel)}</p>}
      <a href={`mailto:${email}`} className="text-primary block font-mono hover:underline">
        {email}
      </a>
      {address && (
        <>
          {addressLabel && <p className="text-muted-foreground mt-4 text-sm">{t(addressLabel)}</p>}
          <p className="text-foreground/80">{address}</p>
        </>
      )}
    </div>
  )
}
