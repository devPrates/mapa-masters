import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'

const chips = ['15+ anos de experiência', '3.000+ contadores impactados', 'ABSCON · CRCs · SESCONs']

export function About() {
  return (
    <section id="sobre" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
        <Reveal direction="left">
          <Badge variant="teal">Quem criou a CCD</Badge>
          <h2 className="mt-4 text-3xl font-bold text-ccd-ink md:text-4xl">
            Anderson Maisse — o contador por trás da Comunidade Contadores Digitais
          </h2>
          <p className="mt-5 text-ccd-ink/70">
            Contador, mentor e palestrante, Anderson Maisse já impactou mais de 3.000 contadores
            em todo o Brasil, levando o método CCD para eventos como ABSCON, CRCs de diversos
            estados e SESCONs. A CCD nasceu para reunir contadores que aplicam essa metodologia e
            transformar a forma como seus escritórios vendem, gerenciam pessoas, automatizam
            processos e escalam seus negócios.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-ccd-ink/70">
            {chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
          <Link
            href="https://andersonmaisse.com/ccdlesp/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1 font-semibold text-ccd-teal"
          >
            Conheça o programa CCD
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <Reveal direction="right">
          <div className="relative flex aspect-square items-center justify-center rounded-[2rem] bg-gradient-to-br from-ccd-navy to-ccd-teal">
            {/* Placeholder — do NOT hotlink a real photo of Anderson Maisse from his
                domain. Replace with a licensed/owned asset in public/ when available. */}
            <Avatar className="size-32 ring-4 ring-white/20 md:size-40">
              <AvatarFallback className="bg-white/10 text-4xl text-white">AM</AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-6 left-6 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
              <p className="font-semibold text-ccd-ink">Anderson Maisse</p>
              <p className="text-xs text-ccd-ink/60">Fundador · Mentor · Palestrante</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
