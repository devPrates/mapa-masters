import { Rocket, TrendingUp, Users, Workflow } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'

const pillars = [
  {
    numero: '01',
    titulo: 'Vendas',
    icone: TrendingUp,
    copy: 'Precificação estratégica, captação de clientes, marketing e gestão da carteira para vender mais e melhor.',
  },
  {
    numero: '02',
    titulo: 'Pessoas',
    icone: Users,
    copy: 'Liderança, delegação e contratação para montar um time capaz de sustentar o crescimento do escritório.',
  },
  {
    numero: '03',
    titulo: 'Automatização',
    icone: Workflow,
    copy: 'Processos e fluxos automatizados que tiram tarefas repetitivas das mãos do contador.',
  },
  {
    numero: '04',
    titulo: 'Escala',
    icone: Rocket,
    copy: 'Expansão estruturada e crescimento sustentável, sem depender só do dono da operação.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="metodo"
      className="relative scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_top,_var(--ccd-navy)_0%,_var(--ccd-navy-darker)_70%)] py-20 text-white md:py-28"
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

        <div className="relative mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute inset-x-0 top-24 hidden h-px bg-gradient-to-r from-transparent via-ccd-teal/40 to-transparent lg:block"
          />
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.titulo} delay={index * 0.1}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-2">
                <span className="font-mono text-xs text-white/30">{pillar.numero}</span>
                <div className="mt-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ccd-teal to-ccd-teal-light">
                  <pillar.icone className="size-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{pillar.titulo}</h3>
                <p className="mt-2 text-sm text-white/60">{pillar.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
