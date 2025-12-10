import { useTranslation } from 'react-i18next'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface TooltipIconProps {
  tooltipKey: string
  icon?: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function TooltipIcon({ tooltipKey, icon, side = 'top', className }: TooltipIconProps) {
  const { t } = useTranslation()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'text-muted-foreground hover:text-foreground transition-colors',
            'focus-visible:ring-primary rounded-full focus:outline-none focus-visible:ring-2',
            className
          )}
        >
          {icon || <HelpCircle className="h-4 w-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {t(tooltipKey)}
      </TooltipContent>
    </Tooltip>
  )
}
