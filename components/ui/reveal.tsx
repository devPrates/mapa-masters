'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport'> {
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  duration?: number
}

const offsets: Record<NonNullable<RevealProps['direction']>, { x?: number; y?: number }> = {
  up: { y: 24 },
  left: { x: -24 },
  right: { x: 24 },
  none: {},
}

function Reveal({ delay = 0, direction = 'up', duration = 0.5, ...props }: RevealProps) {
  const offset = offsets[direction]

  return (
    <motion.div
      data-slot="reveal"
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    />
  )
}

export { Reveal }
