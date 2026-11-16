import { ArrowRight, CalendarClock, Mic, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CountUp } from '@/components/ui/count-up'
import { Reveal } from '@/components/ui/reveal'
import { AboutCarousel } from './about-carousel'

const numeros = [
  { icone: CalendarClock, valor: 15, sufixo: '+', rotulo: 'anos de experiência' },
  { icone: Users, valor: 3000, sufixo: '+', rotulo: 'contadores impactados' },
]

export function About() {
  return (
    <section
      id="sobre"
      // relative z-10 + fundo opaco: nada de uma seção vizinha pinta por cima desta.
      className="relative z-10 flex min-h-svh scroll-mt-24 flex-col justify-center overflow-hidden bg-white py-20 md:py-28"
    >
      {/* Brilhos suaves de fundo (mesma linguagem da seção dos Masters) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,145,13,0.08),transparent_40%),radial-gradient(circle_at_10%_85%,rgba(8,146,165,0.08),transparent_40%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-4 md:grid-cols-2 md:px-8 lg:gap-20">
        <Reveal direction="left">
          <Badge variant="teal">Quem criou a CCD</Badge>

          <h2 className="mt-4 text-ccd-ink">
            <span className="block text-4xl font-bold md:text-5xl">Anderson Maisse</span>
            <span className="mt-3 block text-xl leading-snug font-semibold text-ccd-ink/75 md:text-2xl">
              o contador por trás da{' '}
              <span className="text-gradient-gold">Comunidade Contadores Digitais</span>
            </span>
          </h2>

          <p className="mt-5 text-ccd-ink/70">
            Contador, mentor e palestrante, Anderson Maisse já impactou mais de 3.000 contadores
            em todo o Brasil, levando o método CCD para eventos como ABSCON, CRCs de diversos
            estados e SESCONs. A CCD nasceu para reunir contadores que aplicam essa metodologia e
            transformar a forma como seus escritórios vendem, gerenciam pessoas, automatizam
            processos e escalam seus negócios.
          </p>

          {/* Números */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {numeros.map((n) => (
              <div
                key={n.rotulo}
                className="rounded-2xl border border-ccd-border bg-white p-4 shadow-[0_10px_30px_rgba(4,44,78,0.06)] md:p-5"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-ccd-navy to-ccd-teal">
                  <n.icone className="size-4 text-white" />
                </span>
                <p className="mt-3 bg-linear-to-br from-ccd-navy to-ccd-teal bg-clip-text text-3xl font-bold text-transparent tabular-nums md:text-4xl">
                  <CountUp value={n.valor} suffix={n.sufixo} />
                </p>
                <p className="mt-1 text-xs text-ccd-ink/60 md:text-sm">{n.rotulo}</p>
              </div>
            ))}
          </div>

          {/* Palcos */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-ccd-border bg-ccd-mist px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-ccd-gold to-ccd-gold-light">
              <Mic className="size-4 text-ccd-navy" />
            </span>
            <p className="text-sm text-ccd-ink/70">
              Já palestrou em{' '}
              <span className="font-semibold text-ccd-ink">ABSCON · CRCs · SESCONs</span>
            </p>
          </div>

          <Button
            variant="ghost"
            size="lg"
            nativeButton={false}
            className="mt-8 h-11 rounded-xl bg-linear-to-r from-ccd-teal to-ccd-teal-light px-6 text-white hover:opacity-90"
            render={<a href="https://andersonmaisse.com/ccdlesp/" target="_blank" rel="noopener noreferrer" />}
          >
            Conheça o programa CCD
            <ArrowRight className="size-4" />
          </Button>
        </Reveal>

        <Reveal direction="right" className="px-2 pb-8 md:px-0">
          <AboutCarousel />
        </Reveal>
      </div>
    </section>
  )
}
