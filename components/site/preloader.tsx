'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

import { PRELOADER_EVENT, isPreloaderDone } from '@/lib/preloader'

gsap.registerPlugin(Flip, useGSAP)

// Medidos desde o início da navegação (performance.now()), não desde a
// hidratação: se o JS demorou, a intro em CSS já estava rodando esse tempo.
const MIN_DURATION = 1700 // ms
const MAX_DURATION = 4000 // ms

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)))

// Espera a imagem de fundo REAL da hero (a do next/image) carregar E ser
// decodificada. Sem o decode(), o navegador decodifica a foto no meio do voo,
// quando ela aparece — e o voo engasga.
async function heroImageReady(): Promise<void> {
  const img = document.querySelector<HTMLImageElement>('[data-hero-bg]')
  if (!img) return
  try {
    await img.decode()
  } catch {
    /* imagem com erro: segue sem ela */
  }
}

// Bloqueia o scroll sem esconder a barra de rolagem (esconder mudaria a
// largura da página e o "CCD Master" pousaria alguns pixels fora do lugar).
function lockScroll(): () => void {
  const block = (e: Event) => e.preventDefault()
  const keys = (e: KeyboardEvent) => {
    if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
    }
  }
  window.addEventListener('wheel', block, { passive: false })
  window.addEventListener('touchmove', block, { passive: false })
  window.addEventListener('keydown', keys)
  return () => {
    window.removeEventListener('wheel', block)
    window.removeEventListener('touchmove', block)
    window.removeEventListener('keydown', keys)
  }
}

/*
 * Divisão de trabalho (para nunca duas animações no mesmo elemento):
 *  - CSS (globals.css, .pl-in-*): intro dos elementos INTERNOS. Roda antes do
 *    JS carregar, direto no compositor.
 *  - GSAP: contador, saída do medidor/selo, voo (Flip) do wrapper EXTERNO do
 *    texto e subida do fundo.
 * Tudo anima só transform/opacity — nada de blur, clip-path ou letter-spacing.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    (_context, contextSafe) => {
      if (isPreloaderDone()) {
        setGone(true)
        return
      }

      const html = document.documentElement
      const brand = brandRef.current!
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Sempre abre no topo: o "CCD Master" da hero precisa estar na tela.
      const previousRestoration = history.scrollRestoration
      history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
      const unlockScroll = lockScroll()

      // ---- Contador 000 → 100 + barra (scaleX = compositor) ----
      const setBar = gsap.quickSetter(barRef.current, 'scaleX')
      const progress = { v: 0 }
      let shown = -1
      const render = () => {
        const n = Math.round(progress.v)
        setBar(progress.v / 100)
        if (n !== shown && counterRef.current) {
          shown = n
          counterRef.current.textContent = String(n).padStart(3, '0')
        }
      }
      const fill = gsap.to(progress, { v: 88, duration: 1.4, ease: 'power2.out', onUpdate: render })

      const finish = () => {
        history.scrollRestoration = previousRestoration
        // Mesmo frame: o CSS esconde o overlay e mostra o span real da hero.
        html.setAttribute('data-preloaded', '')
        unlockScroll()
        setGone(true)
      }

      // A hero começa a entrar um pouco ANTES do pouso: a transição fica contínua.
      let announced = false
      const announce = () => {
        if (announced) return
        announced = true
        window.dispatchEvent(new Event(PRELOADER_EVENT))
      }

      const handoff = contextSafe!(() => {
        fill.kill()
        const target = document.querySelector('[data-hero-brand]')
        const out = gsap.timeline({
          defaults: { force3D: true },
          onComplete: () => {
            announce()
            finish()
          },
        })

        out
          .to(progress, { v: 100, duration: 0.35, ease: 'power2.out', onUpdate: render })
          .to(
            ['[data-pl-meter]', '[data-pl-tag]'],
            { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power2.in' },
            '+=0.05',
          )

        if (reduce || !target) {
          out.to(rootRef.current, { autoAlpha: 0, duration: 0.45, ease: 'power1.out' })
          return
        }

        out.addLabel('fly', '-=0.15')
        out.add(
          Flip.fit(brand, target, {
            scale: true,
            duration: 1.1,
            ease: 'power4.inOut',
          }) as gsap.core.Tween,
          'fly',
        )
        // Fundo sobe como um painel (translate, não clip-path: sem repintura).
        out.to(
          '[data-pl-bg]',
          { yPercent: -100, duration: 1.0, ease: 'power4.inOut' },
          'fly+=0.08',
        )
        out.call(announce, undefined, 'fly+=0.75')
      })

      // `alive` evita handoff duplicado quando o efeito é desmontado/remontado
      // (React Strict Mode em dev).
      let alive = true
      const elapsed = performance.now()
      Promise.race([
        Promise.all([document.fonts.ready, heroImageReady(), wait(MIN_DURATION - elapsed)]),
        wait(MAX_DURATION - elapsed),
      ]).then(() => {
        if (alive) handoff()
      })

      return () => {
        alive = false
        unlockScroll()
      }
    },
    { scope: rootRef },
  )

  if (gone) return null

  return (
    <div ref={rootRef} data-preloader aria-hidden className="fixed inset-0 z-[100]">
      {/* Fundo: navy + brilhos em radial-gradient (sem filter: blur) + grid sutil */}
      <div
        data-pl-bg
        className="absolute inset-0 bg-ccd-navy-darker bg-[radial-gradient(circle_at_8%_10%,rgba(8,146,165,0.28),transparent_38%),radial-gradient(circle_at_95%_100%,rgba(201,145,13,0.22),transparent_40%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <div data-pl-tag>
          <span className="pl-in-tag block font-mono text-[10px] tracking-[0.35em] text-white/45 uppercase sm:text-xs">
            Comunidade Contadores Digitais
          </span>
        </div>

        {/* Externo: GSAP/Flip (voo). Interno: CSS (intro). */}
        {/* flex (não inline-block) → a caixa externa tem exatamente o tamanho do
            texto, sem a sobra da linha; o Flip.fit pousa no pixel. */}
        {/* will-change desde o início: a camada da GPU já existe (no tamanho
            GRANDE) quando o voo começa — sem engasgo no 1º frame e nítido ao encolher. */}
        <span ref={brandRef} className="mt-4 flex will-change-transform">
          <span className="pl-in-brand text-gradient-gold inline-block text-5xl leading-tight font-bold whitespace-nowrap sm:text-7xl md:text-8xl">
            CCD Master
          </span>
        </span>

        <div data-pl-meter className="mt-10">
          <div className="pl-in-meter flex w-56 items-center gap-4">
            <div className="relative h-px flex-1 overflow-hidden bg-white/10">
              <div
                ref={barRef}
                className="absolute inset-0 origin-left scale-x-0 bg-linear-to-r from-ccd-teal via-ccd-teal-light to-ccd-gold"
              />
            </div>
            <span ref={counterRef} className="font-mono text-xs text-white/50 tabular-nums">
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
