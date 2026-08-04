import { Quote, Star, UserRound } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'

const placeholders = ['Região Sudeste', 'Região Sul', 'Região Nordeste']

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="scroll-mt-24 overflow-hidden bg-ccd-navy-darker py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Badge variant="inverted">Depoimentos</Badge>
          </div>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            O que dizem os <span className="text-gradient-gold">Masters CCD</span>
          </h2>
          <p className="mt-2 text-xs text-white/40 italic">
            Depoimentos ilustrativos — em breve, histórias reais dos Masters CCD.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {placeholders.map((regiao, index) => (
            <Reveal key={regiao} delay={index * 0.1}>
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <Badge variant="gold" className="absolute -top-3 left-6">
                  Em breve
                </Badge>
                <Quote className="absolute top-4 right-4 size-10 text-white/10" />
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-ccd-gold text-ccd-gold" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/70 italic">
                  Depoimento em breve — este espaço será atualizado com a experiência real de um
                  Master CCD.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-white/10 text-white">
                      <UserRound className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">Master CCD</p>
                    <p className="text-xs text-white/50">{regiao}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
