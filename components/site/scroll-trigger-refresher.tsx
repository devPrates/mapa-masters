'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
 * O ScrollTrigger calcula onde cada animação começa UMA vez. Se a altura da
 * página muda depois (fonte carregando, imagens, hot reload em dev, seções
 * novas), as posições ficam velhas — foi o que fez o palco preso dos
 * "4 pilares" ligar cedo e cobrir a seção "Quem criou a CCD".
 * Este componente recalcula tudo sempre que a altura da página muda.
 */
export function ScrollTriggerRefresher() {
  useEffect(() => {
    // A barra do navegador do celular aparecendo/sumindo não deve recalcular tudo.
    ScrollTrigger.config({ ignoreMobileResize: true })

    let lastHeight = document.body.scrollHeight
    let timer: number | undefined

    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(document.body)

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
