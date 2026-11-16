import { CalendarRange, ExternalLink, Laptop, ShieldCheck, TrendingUp, Users, Video } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'

const statCards = [
  {
    icone: Users,
    valor: '4.257',
    descricao: 'clientes conquistados pelos alunos em 2024',
  },
  {
    icone: TrendingUp,
    valor: 'R$ 3.192.750',
    descricao: 'em crescimento de faturamento registrado pelos alunos',
  },
]

const features = [
  { icone: Laptop, label: '100% online' },
  { icone: CalendarRange, label: '12 meses de acesso' },
  { icone: Video, label: '12 mentorias em grupo ao vivo' },
  { icone: ShieldCheck, label: 'Garantia de 7 dias' },
]

export function ProgramaStats() {
  return (
    <section id="resultados" className="flex min-h-svh flex-col justify-center scroll-mt-24 bg-ccd-mist py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Badge variant="gold">Resultados do programa CCD</Badge>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-ccd-ink md:text-4xl">
            Resultados que os alunos do método CCD já conquistaram
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ccd-ink/60">
            Números registrados pelos próprios alunos da Comunidade Contadores Digitais.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {statCards.map((stat, index) => (
            <Reveal key={stat.descricao} delay={index * 0.1}>
              <div className="rounded-3xl border border-ccd-border bg-white p-8 shadow-[0_10px_30px_rgba(4,44,78,0.06)]">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ccd-navy to-ccd-teal">
                  <stat.icone className="size-6 text-white" />
                </div>
                <p className="mt-5 bg-gradient-to-br from-ccd-navy to-ccd-teal bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  {stat.valor}
                </p>
                <p className="mt-2 text-sm text-ccd-ink/60">{stat.descricao}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap justify-center gap-4">
          {features.map((feature) => (
            <span
              key={feature.label}
              className="flex items-center gap-2 rounded-full border border-ccd-border bg-white px-4 py-2 text-sm text-ccd-ink/80"
            >
              <feature.icone className="size-4 text-ccd-teal" />
              {feature.label}
            </span>
          ))}
        </Reveal>

        <Reveal className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-ccd-navy to-ccd-teal p-8 text-white md:flex-row md:p-10">
          <div>
            <p className="text-lg font-semibold">Quer conhecer o método CCD por dentro?</p>
            <p className="mt-1 text-sm text-white/70">
              Saiba como funciona o programa que forma os Masters CCD em todo o Brasil.
            </p>
          </div>
          <Button
            variant="ghost"
            nativeButton={false}
            className="rounded-xl bg-white text-ccd-navy hover:bg-white/90"
            render={<a href="https://andersonmaisse.com/ccdlesp/" target="_blank" rel="noopener noreferrer" />}
          >
            Conhecer o programa CCD
            <ExternalLink className="size-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
