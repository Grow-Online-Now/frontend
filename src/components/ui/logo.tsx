import { cn } from '@/lib/utils'
import { Link } from '@/components/common/LocalizedLink'

type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  size?: LogoSize
  showText?: boolean
  className?: string
  asLink?: boolean
  href?: string
}

const sizeConfig: Record<LogoSize, { icon: string; text: string; imgSize: number }> = {
  sm: { icon: 'h-7 w-7', text: 'text-lg', imgSize: 28 },
  md: { icon: 'h-9 w-9', text: 'text-xl', imgSize: 36 },
  lg: { icon: 'h-12 w-12', text: 'text-2xl', imgSize: 48 },
}

export function Logo({
  size = 'md',
  showText = true,
  className,
  asLink = true,
  href = '/',
}: LogoProps) {
  const config = sizeConfig[size]

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/images/logo/logo-64.png"
        alt="Grow Online"
        width={config.imgSize}
        height={config.imgSize}
        className={cn('rounded-lg', config.icon)}
      />
      {showText && (
        <span className={cn('text-foreground font-bold', config.text)}>Grow Online</span>
      )}
    </div>
  )

  if (asLink) {
    return (
      <Link to={href} className="">
        {content}
      </Link>
    )
  }

  return content
}
