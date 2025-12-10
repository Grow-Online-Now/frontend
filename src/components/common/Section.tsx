import { cn } from '@/lib/utils'

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  /** Max width of the section content. Defaults to '6xl' */
  maxWidth?: MaxWidth
  /** Disable the container (for sections that handle their own container) */
  noContainer?: boolean
  /** Add top padding to account for fixed navbar (use on first section of a page) */
  firstSection?: boolean
}

export function Section({
  children,
  className,
  id,
  maxWidth = '6xl',
  noContainer = false,
  firstSection = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'px-4 py-6 text-center sm:px-6 md:py-16 lg:px-8',
        firstSection && 'pt-24 md:pt-28',
        className
      )}
    >
      {noContainer ? (
        children
      ) : (
        <div className={cn('mx-auto', maxWidthClasses[maxWidth])}>{children}</div>
      )}
    </section>
  )
}

interface SectionContentProps {
  children: React.ReactNode
  className?: string
  noMarginTop?: boolean
}

export function SectionContent({ children, className, noMarginTop = false }: SectionContentProps) {
  return <div className={cn(noMarginTop ? '' : 'mt-6 md:mt-10', className)}>{children}</div>
}
