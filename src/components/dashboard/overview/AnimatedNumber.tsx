import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  className?: string
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    if (!inView) return

    const controls = animate(prev.current, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setDisplay(Math.round(v))
      },
    })

    prev.current = value
    return controls.stop
  }, [inView, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
