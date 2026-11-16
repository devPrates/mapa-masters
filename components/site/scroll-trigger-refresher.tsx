'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { whenPreloaderDone } from '@/lib/preloader'

/*
 * O ScrollTrigger calcula onde cada animação começa UMA vez. Se a altura da
 * página muda depois (fonte carregando, imagens, hot reload em dev, seções
 * novas), as posições ficam velhas. Este componente recalcula tudo:
 *  - sempre que a altura da página muda (ResizeObserver);
 *  - quando as fontes terminam de carregar;
 *  - no `load` da janela;
 *  - quando o preloader termina;
 *  - quando qualquer <img> termina de carregar (pega as com loading="lazy").
 */
export function ScrollTriggerRefresher() {
  useEffect(() => {
    // A barra do navegador do celular aparecendo/sumindo não deve recalcular tudo.
    ScrollTrigger.config({ ignoreMobileResize: true })

    let timer: number | undefined
    const refreshSoon = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    }

    let lastHeight = document.body.scrollHeight
    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      refreshSoon()
    })
    observer.observe(document.body)

    document.fonts?.ready.then(refreshSoon)

    if (document.readyState !== 'complete') window.addEventListener('load', refreshSoon, { once: true })

    const stopWaiting = whenPreloaderDone(refreshSoon)

    // `load` de <img> não sobe (bubble) — por isso em captura.
    const onAssetLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) refreshSoon()
    }
    document.addEventListener('load', onAssetLoad, true)

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
      window.removeEventListener('load', refreshSoon)
      document.removeEventListener('load', onAssetLoad, true)
      stopWaiting()
    }
  }, [])

  return null
}
