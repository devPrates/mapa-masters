'use client'

import { useRef, type ComponentType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Laptop, Loupe, Terrain, type HairlineProps } from '@lucasmarkes/hairline/react'
import { ArrowRight } from 'lucide-react'

import { masters } from '@/components/masters-map/data-masters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CountUp } from '@/components/ui/count-up'
import { Reveal } from '@/components/ui/reveal'
import { useSectionNav } from '@/hooks/use-section-nav'
import { YouTubeAutoplay } from './youtube-autoplay'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Link (ou só o ID) do vídeo no YouTube (não listado).
const MASTERS_VIDEO_ID = 'https://youtu.be/awYYedwBbSk'

const allMasters = Object.values(masters).flat()
const totalEstados = Object.values(masters).filter((list) => list.length > 0).length

interface Destaque {
  numero: string
  titulo: string
  texto: string
  Figura: ComponentType<HairlineProps>
  label: string
}

const destaques: Destaque[] = [
  {
    numero: '01',
    titulo: 'Formados no método CCD',
    texto: 'Aplicam na prática os pilares de vendas, pessoas, automatização e escala.',
    Figura: Laptop,
    label: 'Notebook isométrico cuja tampa abre conforme a altura do cursor',
  },
  {
    numero: '02',
    titulo: 'Especialistas por nicho',
    texto: 'Cada Master domina um segmento e fala a língua do seu negócio.',
    Figura: Loupe,
    label: 'Lupa sobre uma folha pautada que amplia o trecho sob o cursor',
  },
  {
    numero: '03',
    titulo: `Presentes em ${totalEstados} estados`,
    texto: 'Uma rede nacional que cresce a cada turma, perto de você.',
    Figura: Terrain,
    label: 'Campo de pilares que se elevam ao redor do cursor, como um mapa de presença',
  },
]

const numeros = [
  { valor: allMasters.length, rotulo: 'Masters ativos' },
  { valor: totalEstados, rotulo: 'estados mapeados' },
  { valor: 4, rotulo: 'pilares do método' },
]

export function MastersIntro() {
  const { goToSection } = useSectionNav()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Vídeo "abre" ao rolar: cresce de 88% até o tamanho total (só transform).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-video-frame]',
          { scale: 0.88, y: 40 },
          {
            scale: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-video-frame]',
              start: 'top bottom',
              end: 'center center',
              scrub: 0.6,
            },
          },
        )
      })

    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="ccd-masters"
      className="relative flex min-h-svh scroll-mt-24 flex-col justify-center overflow-hidden bg-ccd-mist py-20 md:py-28"
    >
      {/* Brilhos suaves de fundo (gradiente, sem filter) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(8,146,165,0.12),transparent_40%),radial-gradient(circle_at_85%_55%,rgba(201,145,13,0.1),transparent_40%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        {/* ---------- Cabeçalho ---------- */}
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Badge variant="teal">Masters CCD</Badge>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-ccd-ink md:text-5xl">
            Quem são os <span className="text-gradient-gold">CCD Masters</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-ccd-ink/70 md:text-lg">
            Os Masters são contadores parceiros formados pelo método CCD que se destacaram na
            comunidade. Eles levam contabilidade consultiva e estratégica para empresas de todo o
            Brasil — e você pode encontrar o mais próximo de você no mapa.
          </p>
        </Reveal>

        {/* ---------- Vídeo em destaque ---------- */}
        <div className="relative mx-auto mt-12 max-w-5xl md:mt-16">
          {/* Halo teal/dourado atrás da moldura */}
          <div
            aria-hidden
            className="absolute -inset-x-10 -inset-y-12 bg-[radial-gradient(ellipse_at_center,rgba(8,146,165,0.28),transparent_65%)]"
          />
          <div
            data-video-frame
            className="relative overflow-hidden rounded-[2rem] bg-ccd-navy p-2 shadow-[0_40px_90px_-20px_rgba(4,34,61,0.55)] ring-1 ring-ccd-navy/10 will-change-transform md:p-3"
          >
            {/* Barra estilo HUD (mesma linguagem do painel do Método) */}
            <div className="flex items-center justify-between px-3 pt-1 pb-3 font-mono text-[10px] tracking-[0.25em] text-white/45 uppercase md:px-4 md:text-[11px]">
              <span className="flex items-center gap-2">
                <span className="size-1.5 animate-pulse rounded-full bg-ccd-gold-light" />
                Conheça os Masters
              </span>
              <span className="hidden text-ccd-teal-light/80 sm:inline">CCD · Apresentação · 40s</span>
            </div>
            <YouTubeAutoplay
              videoId={MASTERS_VIDEO_ID}
              title="Conheça os CCD Masters"
              className="rounded-2xl md:rounded-[1.4rem]"
            />
          </div>
        </div>

        {/* ---------- Destaques com figuras Hairline ---------- */}
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
          {destaques.map((item, index) => (
            <Reveal key={item.titulo} delay={index * 0.1}>
              <article className="group h-full overflow-hidden rounded-3xl border border-ccd-border bg-white shadow-[0_10px_30px_rgba(4,44,78,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(4,44,78,0.12)]">
                <item.Figura
                  theme="light"
                  intensity={0.6}
                  play
                  label={item.label}
                  className="hairline-ccd-light w-full border-b border-ccd-border"
                />
                <div className="p-6">
                  <span className="font-mono text-xs tracking-widest text-ccd-gold">
                    {item.numero} / 03
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-ccd-ink">{item.titulo}</h3>
                  <p className="mt-2 text-sm text-ccd-ink/60">{item.texto}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ---------- Números + CTA ---------- */}
        <Reveal className="mt-10 flex flex-col items-center justify-between gap-8 rounded-3xl bg-linear-to-r from-ccd-navy to-ccd-teal p-8 text-white md:flex-row md:p-10">
          <dl className="grid w-full grid-cols-3 gap-4 text-center md:w-auto md:gap-12 md:text-left">
            {numeros.map((n) => (
              <div key={n.rotulo}>
                <dt className="sr-only">{n.rotulo}</dt>
                <dd>
                  <CountUp
                    value={n.valor}
                    className="block text-3xl font-bold tabular-nums md:text-4xl"
                  />
                  <span className="mt-1 block text-xs text-white/70 md:text-sm">{n.rotulo}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Button
            variant="ghost"
            size="lg"
            nativeButton={false}
            className="h-11 w-full shrink-0 rounded-xl bg-white px-6 text-ccd-navy hover:bg-white/90 md:w-auto"
            render={<a href="#masters" onClick={goToSection('masters')} />}
          >
            Encontrar um Master no mapa
            <ArrowRight className="size-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
