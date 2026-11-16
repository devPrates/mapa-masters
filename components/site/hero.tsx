'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSectionNav } from '@/hooks/use-section-nav'
import { whenPreloaderDone } from '@/lib/preloader'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

// Sem backdrop-blur na hero: o desfoque de fundo é recalculado a cada frame em
// que algo se move (entrada, parallax) e era a principal causa de travadas.
// Um fundo um pouco mais opaco mantém o mesmo visual sobre o navy.
const heroBadge = 'backdrop-blur-none bg-white/12'

const stats = [
  '+15 anos de experiência',
  '+3.000 contadores impactados',
  'Presença em todo o Brasil',
]

/*
 * Animações da hero (todas GSAP, só transform/opacity):
 *  1. Entrada: palavras do título sobem de dentro de uma máscara, resto em stagger.
 *  2. Brilhos teal/dourado flutuam e seguem levemente o mouse (parallax).
 *  3. Scroll: foto de fundo desce mais devagar e o conteúdo sobe/esmaece (parallax).
 * Regra: cada elemento tem um único dono de animação — por isso brilhos e fundo
 * têm wrappers (externo = mouse/scroll, interno = flutuação).
 */
export function Hero() {
  const { goToSection } = useSectionNav()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const section = sectionRef.current!
      const mm = gsap.matchMedia()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // ---- 1. Entrada ----
      // O split acontece JÁ na montagem (antes do preloader medir o "CCD Master"),
      // assim o layout do título não muda no momento do pouso.
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]')
      const split = reduce ? null : SplitText.create(fades, { type: 'words', mask: 'words' })
      if (split) {
        gsap.set(split.words, { yPercent: 110 })
        gsap.set(fades, { autoAlpha: 1 })
      }

      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        if (split) {
          tl.to(split.words, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05 }, 0)
        } else {
          tl.to(fades, { autoAlpha: 1, duration: 0.6 }, 0)
        }
        tl.fromTo(
          '[data-hero-item]',
          { autoAlpha: 0, y: reduce ? 0 : 22 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 },
          0.15,
        )
      })
      const stopWaiting = whenPreloaderDone(enter)

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ---- 2. Brilhos: flutuação contínua (wrapper interno) ----
        gsap.to('[data-glow-float="a"]', { y: 22, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to('[data-glow-float="b"]', { y: -22, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })

        // ---- 3. Parallax no scroll ----
        gsap
          .timeline({
            defaults: { ease: 'none' },
            // scrub numérico suaviza os "degraus" da roda do mouse (Windows).
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
          .to('[data-hero-bg-wrap]', { yPercent: 18 }, 0)
          .to('[data-hero-content]', { y: -90, autoAlpha: 0.15 }, 0)
      })

      // ---- 2b. Brilhos seguem o mouse (só com mouse de verdade) ----
      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
        const movers = gsap.utils.toArray<HTMLElement>('[data-glow]').map((el) => ({
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
          depth: Number(el.dataset.glow),
        }))
        // Mede a seção só ao entrar com o mouse, não a cada movimento.
        let rect = section.getBoundingClientRect()
        const onEnter = () => {
          rect = section.getBoundingClientRect()
        }
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 … 0.5
          const ny = (e.clientY - rect.top) / rect.height - 0.5
          movers.forEach((m) => {
            m.x(nx * m.depth)
            m.y(ny * m.depth)
          })
        }
        section.addEventListener('pointerenter', onEnter)
        section.addEventListener('pointermove', onMove)
        return () => {
          section.removeEventListener('pointerenter', onEnter)
          section.removeEventListener('pointermove', onMove)
        }
      })

      return () => {
        stopWaiting()
        split?.revert()
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-ccd-navy"
    >
      {/* Foto de fundo com blur leve. O wrapper recebe o parallax (o blur fica
          estático na imagem, a GPU só move a camada). Mais alto que a seção
          para o parallax não revelar borda. */}
      <div data-hero-bg-wrap className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
        <Image
          src="/hero-bg.jpeg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          data-hero-bg
          className="scale-105 object-cover blur-[3px]"
        />
      </div>
      {/* Overlay navy: mais escuro no centro (atrás do texto) e na base */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,34,61,0.75)_0%,rgba(4,34,61,0.45)_60%,rgba(4,34,61,0.35)_100%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-ccd-navy-darker/80" />

      {/* Brilhos: gradiente radial em vez de filter: blur (mesmo visual, bem mais leve).
          data-glow = profundidade do parallax do mouse, em px. */}
      <div aria-hidden data-glow="60" className="absolute -top-48 -left-48 size-[36rem]">
        <div
          data-glow-float="a"
          className="size-full rounded-full bg-[radial-gradient(circle,rgba(8,146,165,0.35)_0%,rgba(8,146,165,0.12)_40%,transparent_70%)]"
        />
      </div>
      <div aria-hidden data-glow="-45" className="absolute -right-48 -bottom-24 size-[36rem]">
        <div
          data-glow-float="b"
          className="size-full rounded-full bg-[radial-gradient(circle,rgba(201,145,13,0.32)_0%,rgba(201,145,13,0.1)_40%,transparent_70%)]"
        />
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-20 text-center md:px-8"
      >
        <div data-hero-item className="flex justify-center">
          <Badge variant="inverted" className={heroBadge}>
            Comunidade Contadores Digitais
          </Badge>
        </div>

        {/* O h1 não recebe transform: o preloader mede a posição de [data-hero-brand]. */}
        <h1 className="mt-6 text-4xl leading-tight font-bold text-white sm:text-5xl md:text-6xl">
          <span data-hero-fade>Encontre o</span>{' '}
          <span data-hero-brand className="text-gradient-gold inline-block whitespace-nowrap">
            CCD Master
          </span>{' '}
          <span data-hero-fade>mais próximo de você</span>
        </h1>

        <div data-hero-item>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Uma rede nacional de contadores parceiros formados pelo método CCD, criado por
            Anderson Maisse, para levar contabilidade consultiva e estratégica a todo o Brasil.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div data-hero-item>
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              className="h-11 rounded-xl bg-linear-to-r from-ccd-teal to-ccd-teal-light px-6 text-white hover:opacity-90"
              render={<a href="#masters" onClick={goToSection('masters')} />}
            >
              Ver Masters no mapa
            </Button>
          </div>
          <div data-hero-item>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-11 rounded-xl border-white/25 bg-white/5 px-6 text-white hover:bg-white/10"
              render={
                <a href="https://andersonmaisse.com/ccdlesp/" target="_blank" rel="noopener noreferrer" />
              }
            >
              Conhecer o método CCD
              <ExternalLink className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {stats.map((stat) => (
            <Badge key={stat} data-hero-item variant="inverted" className={heroBadge}>
              {stat}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
