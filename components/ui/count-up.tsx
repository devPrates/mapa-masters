'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

const format = (n: number, prefix: string, suffix: string) =>
  `${prefix}${Math.round(n).toLocaleString('pt-BR')}${suffix}`

/** Número que conta de 0 até `value` quando aparece na tela (uma vez). Ex.: 3.000+ */
export function CountUp({ value, prefix = '', suffix = '', duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const counter = { v: 0 }
      el.textContent = format(0, prefix, suffix)
      gsap.to(counter, {
        v: value,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = format(counter.v, prefix, suffix)
        },
      })
    },
    { dependencies: [value, prefix, suffix, duration] },
  )

  // Sem JS (ou antes de hidratar) já mostra o valor final.
  return (
    <span ref={ref} className={className}>
      {format(value, prefix, suffix)}
    </span>
  )
}
