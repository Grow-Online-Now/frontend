import { cn } from '@/lib/utils'
import { Link } from '@/components/common/LocalizedLink'

interface AnchorProps {
  href: string
  children: React.ReactNode
  className?: string
  newTab?: boolean
}

export function Anchor({ href, newTab, className, children }: AnchorProps) {
  return (
    <Link to={href} target={newTab ? '_blank' : undefined} className={cn('underline', className)}>
      {children}
    </Link>
  )
}
