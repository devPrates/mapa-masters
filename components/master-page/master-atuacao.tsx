import { Cabinet, Dish, Elevator } from '@lucasmarkes/hairline/react'

import { Reveal } from '@/components/ui/reveal'
import type { Master } from '@/components/masters-map/types'

const publicoTexto: Record<string, string> = {
  PJ: 'Empresas (PJ)',
  PF: 'Pessoas físicas (PF)',
  Ambos: 'Empresas e pessoas físicas',
}

/*
 * 3 cards de atuação com figuras Hairline (tema claro), no mesmo padrão dos
 * cards da seção "Quem são os CCD Masters" da home.
 */
export function MasterAtuacao({ master }: { master: Master }) {
  const cards = [
    {
      numero: '01',
      titulo: 'Especialidade',
      Figura: Dish,
      label: 'Antena parabólica que mira na direção do cursor, representando o foco do Master',
      conteudo: (
        <ul className="space-y-1.5">
          {master.especialidade.map((item) => (
            <li key={item} className="text-sm text-ccd-ink/70">
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      numero: '02',
      titulo: 'Para quem',
      Figura: Cabinet,
      label: 'Rack de lâminas que deslizam para fora, representando os segmentos atendidos',
      conteudo: (
        <div>
          <p className="text-sm font-semibold text-ccd-ink">
            {publicoTexto[master.publicoTipo] ?? master.publicoTipo}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {master.nichoDescricao.length > 0 ? (
              master.nichoDescricao.map((nicho) => (
                <span
                  key={nicho}
                  className="rounded-full border border-ccd-teal/20 bg-ccd-teal/10 px-2.5 py-1 text-xs font-medium text-ccd-teal"
                >
                  {nicho}
                </span>
              ))
            ) : (
              <span className="text-sm text-ccd-ink/60">Atende diversos segmentos</span>
            )}
          </div>
        </div>
      ),
    },
    {
      numero: '03',
      titulo: 'Experiência',
      Figura: Elevator,
      label: 'Elevador que sobe entre andares, representando os anos de carreira',
      conteudo: (
        <div>
          <p className="bg-linear-to-br from-ccd-navy to-ccd-teal bg-clip-text text-2xl font-bold text-transparent">
            {master.tempoAtuacao}
          </p>
          <p className="mt-1 text-sm text-ccd-ink/60">de atuação na contabilidade</p>
        </div>
      ),
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map((card, index) => (
        <Reveal key={card.titulo} delay={index * 0.08}>
          <article className="h-full overflow-hidden rounded-3xl border border-ccd-border bg-white shadow-[0_10px_30px_rgba(4,44,78,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(4,44,78,0.12)]">
            <card.Figura
              theme="light"
              intensity={0.6}
              play
              label={card.label}
              className="hairline-ccd-light w-full border-b border-ccd-border"
            />
            <div className="p-6">
              <span className="font-mono text-xs tracking-widest text-ccd-gold">{card.numero} / 03</span>
              <h3 className="mt-1 mb-3 text-lg font-semibold text-ccd-ink">{card.titulo}</h3>
              {card.conteudo}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  )
}
