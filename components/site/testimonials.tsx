import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'

const depoimentos = [
  {
    src: '/depoimento-02.jpeg',
    alt: 'Print de depoimento via WhatsApp — prova social 2',
    width: 589,
    height: 1280,
  },
  {
    src: '/depoimento-01.jpeg',
    alt: 'Print de depoimento via WhatsApp — prova social 1',
    width: 932,
    height: 1600,
  },
  {
    src: '/depoimento-03.jpeg',
    alt: 'Print de depoimento via WhatsApp — prova social 3',
    width: 760,
    height: 1600,
  },
]

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
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {depoimentos.map((depoimento, index) => (
            <Reveal key={depoimento.src} delay={index * 0.1}>
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 shadow-lg"
                style={{ aspectRatio: `${depoimento.width} / ${depoimento.height}` }}
              >
                <Image
                  src={depoimento.src}
                  alt={depoimento.alt}
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
