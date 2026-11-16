'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const images = [
  { src: '/carousel-01.webp', alt: 'Anderson Maisse — foto 1' },
  { src: '/carousel-02.jpeg', alt: 'Anderson Maisse — foto 2' },
  { src: '/carousel-03.webp', alt: 'Anderson Maisse — foto 3' },
  { src: '/carousel-04.jpeg', alt: 'Anderson Maisse — foto 4' },
]

const SLIDE_SECONDS = 4.5
const FADE_SECONDS = 0.9

/*
 * Carrossel GSAP (só transform/opacity), cada camada com um único dono:
 *  - [data-about-parallax]: parallax no scroll
 *  - [data-about-slide]:    crossfade entre fotos
 *  - [data-about-img]:      Ken Burns (zoom lento)
 *  - [data-about-bar]:      progresso estilo stories
 * Pausa quando a seção sai da tela.
 */
export function AboutCarousel() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const slides = gsap.utils.toArray<HTMLElement>('[data-about-slide]')
      const imgs = gsap.utils.toArray<HTMLElement>('[data-about-img]')
      const bars = gsap.utils.toArray<HTMLElement>('[data-about-bar]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const total = slides.length

      // Objeto (e não `let`) para o TypeScript não estreitar o tipo para null.
      const state: { active: gsap.core.Timeline | null } = { active: null }
      let visible = false
      let z = 1

      gsap.set(slides, { autoAlpha: 0 })
      gsap.set(slides[0], { autoAlpha: 1, zIndex: z })

      const crossfade = contextSafe!((from: number, to: number) => {
        z += 1
        gsap.set(slides[to], { zIndex: z, autoAlpha: 0 })
        if (!reduce) gsap.set(imgs[to], { scale: 1.08 })
        gsap.to(slides[to], {
          autoAlpha: 1,
          duration: FADE_SECONDS,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.set(slides[from], { autoAlpha: 0 })
          },
        })
      })

      const run = contextSafe!((i: number) => {
        bars.forEach((bar, k) => gsap.set(bar, { scaleX: k < i ? 1 : 0 }))
        state.active = gsap.timeline({
          paused: !visible,
          onComplete: () => {
            const next = (i + 1) % total
            crossfade(i, next)
            run(next)
          },
        })
        state.active.to(bars[i], { scaleX: 1, duration: SLIDE_SECONDS, ease: 'none' }, 0)
        if (!reduce) {
          state.active.fromTo(imgs[i], { scale: 1.08 }, { scale: 1, duration: SLIDE_SECONDS, ease: 'none' }, 0)
        }
      })

      run(0)

      // Só anda quando a seção está na tela.
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          visible = self.isActive
          if (visible) state.active?.resume()
          else state.active?.pause()
        },
      })
      if (st.isActive) {
        visible = true
        state.active?.resume()
      }

      // Parallax leve: a foto desliza dentro da moldura enquanto a página rola.
      if (!reduce) {
        gsap.fromTo(
          '[data-about-parallax]',
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      }

      return () => state.active?.kill()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="relative">
      {/* Contorno dourado deslocado atrás da foto */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-ccd-gold/40 md:translate-x-6 md:translate-y-6"
      />

      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-linear-to-br from-ccd-navy to-ccd-teal shadow-[0_30px_70px_-20px_rgba(4,34,61,0.45)]">
        {/* isolate: o z-index crescente dos slides fica contido aqui dentro */}
        <div data-about-parallax className="absolute inset-x-0 -inset-y-[8%] isolate">
          {images.map((image, i) => (
            <div
              key={image.src}
              data-about-slide
              className={cn('absolute inset-0', i > 0 && 'invisible opacity-0')}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 520px, 100vw"
                priority={i === 0}
                data-about-img
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Leve escurecido na base para o card do nome */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ccd-navy-darker/50 to-transparent"
        />

        {/* Progresso estilo stories */}
        <div aria-hidden className="absolute inset-x-5 top-5 flex gap-1.5">
          {images.map((image) => (
            <span key={image.src} className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
              <span data-about-bar className="absolute inset-0 origin-left scale-x-0 bg-white" />
            </span>
          ))}
        </div>
      </div>

      {/* Selo flutuante */}
      <div className="absolute -top-4 right-6 flex items-center gap-2 rounded-full bg-ccd-navy px-4 py-2 text-xs font-semibold text-white shadow-lg ring-1 ring-white/10">
        <span className="size-1.5 rounded-full bg-ccd-gold-light" />
        Criador do método CCD
      </div>

      {/* Card do nome */}
      <div className="absolute -bottom-6 left-6 rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-ccd-border">
        <p className="font-semibold text-ccd-ink">Anderson Maisse</p>
        <p className="text-xs text-ccd-ink/60">Fundador · Mentor · Palestrante</p>
      </div>
    </div>
  )
}
