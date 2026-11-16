'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { Briefcase, Clock3, MapPin, Sparkles } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Master } from '@/components/masters-map/types'

gsap.registerPlugin(SplitText, useGSAP)

interface MasterHeroProps {
  master: Master
  stateName: string
}

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

const publicoLabel: Record<string, string> = {
  PJ: 'Atende empresas',
  PF: 'Atende pessoas físicas',
  Ambos: 'Atende PF e PJ',
}

/*
 * Cabeçalho do perfil do Master, na linguagem da home:
 * navy→teal, grid sutil, brilhos em gradiente (sem blur), selo dourado.
 * GSAP: nome sobe palavra por palavra (máscara), resto entra em stagger,
 * brilho segue o mouse. Só transform/opacity.
 */
export function MasterHero({ master, stateName }: MasterHeroProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current!
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const name = root.querySelector<HTMLElement>('[data-mh-name]')!

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (reduce) {
        tl.to([name, '[data-mh-item]', '[data-mh-avatar]'], { autoAlpha: 1, duration: 0.5 })
        return
      }

      const split = SplitText.create(name, { type: 'words', mask: 'words' })
      gsap.set(name, { autoAlpha: 1 })

      tl.fromTo(
        '[data-mh-avatar]',
        { autoAlpha: 0, scale: 0.85 },
        { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' },
        0,
      )
        .from(split.words, { yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.06 }, 0.15)
        .fromTo(
          '[data-mh-item]',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 },
          0.35,
        )

      // Brilho dourado segue o mouse (só mouse de verdade)
      const mm = gsap.matchMedia()
      mm.add('(pointer: fine)', () => {
        const glow = root.querySelector<HTMLElement>('[data-mh-glow]')!
        const toX = gsap.quickTo(glow, 'x', { duration: 1, ease: 'power3.out' })
        const toY = gsap.quickTo(glow, 'y', { duration: 1, ease: 'power3.out' })
        let rect = root.getBoundingClientRect()
        const onEnter = () => {
          rect = root.getBoundingClientRect()
        }
        const onMove = (e: PointerEvent) => {
          toX(((e.clientX - rect.left) / rect.width - 0.5) * 80)
          toY(((e.clientY - rect.top) / rect.height - 0.5) * 60)
        }
        root.addEventListener('pointerenter', onEnter)
        root.addEventListener('pointermove', onMove)
        return () => {
          root.removeEventListener('pointerenter', onEnter)
          root.removeEventListener('pointermove', onMove)
        }
      })

      return () => split.revert()
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-linear-to-br from-ccd-navy to-ccd-teal px-6 py-10 text-white shadow-[0_40px_90px_-30px_rgba(4,34,61,0.6)] md:px-10 md:py-12"
    >
      {/* Grid sutil + brilhos (mesma linguagem do preloader/hero) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_30%_50%,black_10%,transparent_65%)]"
      />
      <div
        aria-hidden
        data-mh-glow
        className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(242,201,76,0.28)_0%,rgba(242,201,76,0.08)_40%,transparent_70%)]"
      />

      <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
        {/* Foto com anel dourado */}
        <div data-mh-avatar className="relative shrink-0">
          <div
            aria-hidden
            className="absolute -inset-1.5 rounded-[1.9rem] bg-linear-to-br from-ccd-gold-light via-ccd-gold to-ccd-teal-light opacity-80"
          />
          <Avatar className="relative size-32 rounded-3xl ring-4 ring-ccd-navy md:size-40">
            <AvatarImage src={master.foto} alt={master.nome} />
            <AvatarFallback className="bg-white/10 text-3xl text-white">{initials(master.nome)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0 md:flex-1">
          <div data-mh-item className="flex justify-center md:justify-start">
            <Badge variant="gold" className="border-ccd-gold-light/30 bg-ccd-gold-light/15 text-ccd-gold-light">
              <Sparkles className="size-3" />
              CCD Master
            </Badge>
          </div>

          <h1 data-mh-name className="mt-3 text-3xl leading-tight font-bold md:text-5xl">
            {master.nome}
          </h1>
          <p data-mh-item className="mt-2 text-white/75 md:text-lg">
            {master.empresa}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
            {master.cidade && (
              <Badge data-mh-item variant="inverted" className="backdrop-blur-none">
                <MapPin className="size-3" />
                {master.cidade}, {master.uf}
              </Badge>
            )}
            {!master.cidade && (
              <Badge data-mh-item variant="inverted" className="backdrop-blur-none">
                <MapPin className="size-3" />
                {stateName}
              </Badge>
            )}
            {master.tempoAtuacao && (
              <Badge data-mh-item variant="inverted" className="backdrop-blur-none">
                <Clock3 className="size-3" />
                {master.tempoAtuacao} de atuação
              </Badge>
            )}
            {publicoLabel[master.publicoTipo] && (
              <Badge data-mh-item variant="inverted" className="backdrop-blur-none">
                <Briefcase className="size-3" />
                {publicoLabel[master.publicoTipo]}
              </Badge>
            )}
          </div>
        </div>

        {master.logo && (
          <div
            data-mh-item
            className="relative h-16 w-40 shrink-0 rounded-2xl bg-white/95 p-3 shadow-lg md:mr-2 md:h-20 md:w-48"
          >
            <Image
              src={master.logo}
              alt={master.empresa}
              fill
              sizes="192px"
              className="object-contain p-3"
            />
          </div>
        )}
      </div>
    </section>
  )
}
