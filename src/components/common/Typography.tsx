import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

interface HeadingProps {
  children: React.ReactNode
  className?: string
}

export function Heading({ children, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        'font-title text-foreground text-[34px] leading-tight sm:text-5xl md:text-6xl',
        className
      )}
    >
      {children}
    </h1>
  )
}

interface PageHeadingProps {
  children: React.ReactNode
}

export function PageHeading({ children }: PageHeadingProps) {
  return <Heading className="mx-auto max-w-[780px]">{children}</Heading>
}

interface SectionHeadingProps {
  children: React.ReactNode
  wrap?: boolean
}

export function SectionHeading({ children, wrap }: SectionHeadingProps) {
  return <Subheading className={cn('mx-auto', wrap ? 'max-w-[620px]' : '')}>{children}</Subheading>
}

interface SectionSubtitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionSubtitle({ children, className }: SectionSubtitleProps) {
  return (
    <Paragraph className={cn('mx-auto mt-2.5 max-w-[650px]', className)} size="lg">
      {children}
    </Paragraph>
  )
}

interface SubheadingProps {
  children: React.ReactNode
  className?: string
}

export function Subheading({ children, className }: SubheadingProps) {
  return (
    <h2
      className={cn(
        'font-title text-foreground text-[1.7rem] leading-tight md:text-[2.5rem]',
        className
      )}
    >
      {children}
    </h2>
  )
}

interface ParagraphProps {
  children: React.ReactNode
  className?: string
  color?: 'default' | 'light' | 'dark' | 'gray-700' | 'gray-500' | 'gray-900'
  size?: 'default' | 'xs' | 'sm' | 'md' | 'lg'
  as?: 'p' | 'h3' | 'dt' | 'dl'
}

export function Paragraph({
  children,
  className,
  color = 'default',
  size = 'default',
  as = 'p',
}: ParagraphProps) {
  const paragraphStyles = cva('font-geist', {
    variants: {
      color: {
        default: 'text-muted-foreground',
        light: 'text-muted-foreground/70',
        dark: 'text-foreground/80',
        'gray-700': 'text-foreground/70',
        'gray-500': 'text-muted-foreground',
        'gray-900': 'text-foreground',
      },
      size: {
        default: 'text-sm md:text-base',
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
  })
  const ParagraphComponent = as as React.ElementType

  return (
    <ParagraphComponent className={paragraphStyles({ color, size, className })}>
      {children}
    </ParagraphComponent>
  )
}
