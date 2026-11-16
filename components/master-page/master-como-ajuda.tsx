import { Hub } from '@lucasmarkes/hairline/react'

import { Reveal } from '@/components/ui/reveal'

/*
 * Painel navy (mesma linguagem do painel do Método na home):
 * barra HUD + figura Hairline escura + texto "Como ajuda".
 * O fundo do painel é navy sólido porque --hairline-plate precisa ser igual.
 */
export function MasterComoAjuda({ texto, primeiroNome }: { texto: string; primeiroNome: string }) {
  if (!texto) return null

  return (
    <Reveal>
      <div className="hairline-ccd-dark overflow-hidden rounded-[2rem] border border-white/10 bg-ccd-navy text-white shadow-[0_30px_70px_-25px_rgba(2,22,39,0.6)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 font-mono text-[11px] tracking-widest text-white/40 uppercase">
          <span className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-ccd-gold-light" />
            Como {primeiroNome} pode ajudar
          </span>
          <span className="hidden text-ccd-teal-light/80 sm:inline">Rede CCD</span>
        </div>

        <div className="grid items-center gap-2 md:grid-cols-5">
          <Hub
            theme="dark"
            intensity={0.6}
            play
            label="Central conectada a vários pontos; o ponto sob o cursor se ativa"
            className="w-full md:col-span-2"
          />
          <p className="px-6 pb-8 text-lg leading-relaxed text-white/85 md:col-span-3 md:py-8 md:pr-8 md:pl-0">
            <span className="text-gradient-gold text-3xl leading-none font-bold">“</span>
            {texto}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
