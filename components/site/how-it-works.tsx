'use client'

import { useRef, useState, type ComponentType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Hub, Plot, Rebuild, Riffle, type HairlineProps } from '@lucasmarkes/hairline/react'

import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Pillar {
  numero: string
  titulo: string
  copy: string
  Figura: ComponentType<HairlineProps>
  label: string
  dica: string
}

// Cada pilar ganha uma figura Hairline que "conta" a ideia dele:
// Vendas = barras que sobem, Pessoas = fichas de talentos (a escolhida se levanta),
// Automatização = central conectada aos processos, Escala = árvore que cresce.
const pillars: Pillar[] = [
  {
    numero: '01',
    titulo: 'Vendas',
    copy: 'Precificação estratégica, captação de clientes, marketing e gestão da carteira para vender mais e melhor.',
    Figura: Plot,
    label: 'Gráfico de barras isométrico cujas barras sobem ao passar o cursor',
    dica: 'Passe o cursor nas barras',
  },
  {
    numero: '02',
    titulo: 'Pessoas',
    copy: 'Liderança, delegação e contratação para montar um time capaz de sustentar o crescimento do escritório.',
    Figura: Riffle,
    label: 'Bandeja de oito fichas de talentos; a ficha sob o cursor se levanta',
    dica: 'Passe o cursor nas fichas do time',
  },
  {
    numero: '03',
    titulo: 'Automatização',
    copy: 'Processos e fluxos automatizados que tiram tarefas repetitivas das mãos do contador.',
    Figura: Hub,
    label: 'Central de automação ligada a oito processos; o processo sob o cursor sobe e sua conexão se ativa',
    dica: 'Passe o cursor nos processos',
  },
  {
    numero: '04',
    titulo: 'Escala',
    copy: 'Expansão estruturada e crescimento sustentável, sem depender só do dono da operação.',
    Figura: Rebuild,
    label: 'Árvore de blocos em que cada bloco tocado eleva todos os que dependem dele',
    dica: 'Toque um bloco da estrutura',
  },
]

const STEPS = pillars.length - 1

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const [leituras, setLeituras] = useState<string[]>(() => pillars.map(() => ''))

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Só no desktop: a seção fica presa na tela e o scroll troca os pilares.
      // No mobile o layout é uma lista de cards (sem pin).
      mm.add(
        { desktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' },
        (context) => {
          const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean }
          if (!desktop || !stageRef.current) return

          const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', stageRef.current)
          const shift = reduce ? 0 : 48

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stageRef.current,
              start: 'top top',
              end: () => `+=${window.innerHeight * STEPS}`,
              pin: true,
              scrub: reduce ? true : 0.8,
              snap: {
                snapTo: 1 / STEPS,
                duration: { min: 0.2, max: 0.6 },
                delay: 0.08,
                ease: 'power1.inOut',
              },
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const next = Math.round(self.progress * STEPS)
                setActive((prev) => (prev === next ? prev : next))
              },
            },
          })

          triggerRef.current = tl.scrollTrigger ?? null

          // Linha de progresso (teal → dourado) acompanha o scroll inteiro.
          tl.fromTo('[data-progress]', { scaleY: 0 }, { scaleY: 1, duration: STEPS }, 0)

          // Cada troca acontece no meio do trecho; nos pontos de snap (0, 1/3, 2/3, 1)
          // um pilar está 100% visível.
          slides.forEach((slide, i) => {
            if (i === 0) return
            const at = i - 1 + 0.25
            tl.to(
              slides[i - 1],
              { autoAlpha: 0, y: -shift, scale: reduce ? 1 : 0.94, duration: 0.45 },
              at,
            ).fromTo(
              slide,
              { autoAlpha: 0, y: shift, scale: reduce ? 1 : 0.94 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 },
              at + 0.25,
            )
          })

          return () => {
            triggerRef.current = null
          }
        },
      )
    },
    { scope: sectionRef },
  )

  // Clicar num pilar da lista rola até o ponto em que ele fica ativo.
  const goTo = (index: number) => {
    const st = triggerRef.current
    if (!st) return
    window.scrollTo({ top: st.start + ((st.end - st.start) * index) / STEPS, behavior: 'smooth' })
  }

  const setLeitura = (index: number) => (texto: string) =>
    setLeituras((prev) => {
      if (prev[index] === texto) return prev
      const next = [...prev]
      next[index] = texto
      return next
    })

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className="relative min-h-svh scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_top,_var(--ccd-navy)_0%,_var(--ccd-navy-darker)_70%)] pt-20 pb-20 text-white md:pt-28 lg:pb-0"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Badge variant="inverted">O método CCD</Badge>
          </div>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            4 pilares para escalar sua contabilidade
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            O método aplicado pelos Masters CCD em todo o Brasil, estruturado em quatro frentes
            complementares.
          </p>
        </Reveal>
      </div>

      {/* ---------- Desktop: palco preso na tela, controlado pelo scroll ---------- */}
      <div ref={stageRef} className="hidden h-screen items-center pt-20 lg:flex">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-12 items-center gap-12 px-8">
          {/* Lista de pilares + linha de progresso */}
          <div className="col-span-5 flex gap-6">
            <div aria-hidden className="relative w-px shrink-0 bg-white/10">
              <div
                data-progress
                className="absolute inset-0 origin-top scale-y-0 bg-linear-to-b from-ccd-teal via-ccd-teal-light to-ccd-gold"
              />
            </div>

            <ol className="flex flex-col gap-7">
              {pillars.map((pillar, index) => {
                const isActive = active === index
                return (
                  <li key={pillar.titulo}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={isActive ? 'step' : undefined}
                      className={cn(
                        'group text-left transition-opacity duration-500',
                        isActive ? 'opacity-100' : 'opacity-35 hover:opacity-70',
                      )}
                    >
                      <span
                        className={cn(
                          'font-mono text-xs tracking-widest transition-colors duration-500',
                          isActive ? 'text-ccd-gold-light' : 'text-white/50',
                        )}
                      >
                        {pillar.numero} / 0{pillars.length}
                      </span>
                      <h3 className="mt-1 text-2xl font-bold">{pillar.titulo}</h3>
                      <p
                        className={cn(
                          'grid text-sm text-white/60 transition-all duration-500',
                          isActive ? 'mt-2 grid-rows-[1fr]' : 'grid-rows-[0fr]',
                        )}
                      >
                        <span className="overflow-hidden">{pillar.copy}</span>
                      </p>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Painel com as figuras empilhadas (GSAP faz o crossfade) */}
          <div className="col-span-7">
            <div className="hairline-ccd-dark relative overflow-hidden rounded-[2rem] border border-white/10 bg-ccd-navy shadow-[0_30px_80px_rgba(2,22,39,0.6)]">
              {/* Barra estilo HUD */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 font-mono text-[11px] tracking-widest text-white/40 uppercase">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 animate-pulse rounded-full bg-ccd-gold-light" />
                  Método CCD · pilar {pillars[active].numero}
                </span>
                <span className="tabular-nums text-ccd-teal-light/80">
                  {leituras[active] ? `leitura ${leituras[active]}` : 'aguardando cursor'}
                </span>
              </div>

              <div className="grid p-8">
                {pillars.map((pillar, index) => (
                  <div
                    key={pillar.titulo}
                    data-slide
                    className={cn('[grid-area:1/1]', index > 0 && 'invisible opacity-0')}
                  >
                    <pillar.Figura
                      theme="dark"
                      intensity={0.65}
                      play={active === index}
                      label={pillar.label}
                      onRead={setLeitura(index)}
                      className="mx-auto w-full max-w-md"
                    />
                  </div>
                ))}
              </div>

              <p className="border-t border-white/10 px-6 py-3 text-center font-mono text-[11px] tracking-widest text-white/35 uppercase">
                {pillars[active].dica}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Mobile/tablet: cards empilhados ---------- */}
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:px-8 lg:hidden">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.titulo} delay={index * 0.1}>
            <div className="hairline-ccd-dark overflow-hidden rounded-3xl border border-white/10 bg-ccd-navy">
              <pillar.Figura
                theme="dark"
                intensity={0.65}
                play
                label={pillar.label}
                className="w-full border-b border-white/10"
              />
              <div className="p-6">
                <span className="font-mono text-xs tracking-widest text-ccd-gold-light">
                  {pillar.numero} / 0{pillars.length}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{pillar.titulo}</h3>
                <p className="mt-2 text-sm text-white/60">{pillar.copy}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
