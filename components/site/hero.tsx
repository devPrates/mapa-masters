'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { useSectionNav } from '@/hooks/use-section-nav'

const stats = [
  '+15 anos de experiência',
  '+3.000 contadores impactados',
  'Presença em todo o Brasil',
]

export function Hero() {
  const { goToSection } = useSectionNav()

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-linear-to-b from-ccd-navy via-ccd-navy to-ccd-navy-darker md:min-h-screen">
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-24 size-96 rounded-full bg-ccd-teal opacity-20 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-24 bottom-0 size-96 rounded-full bg-ccd-gold opacity-20 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-20 text-center md:px-8">
        <Reveal className="flex justify-center">
          <Badge variant="inverted">Comunidade Contadores Digitais</Badge>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-6 text-4xl leading-tight font-bold text-white sm:text-5xl md:text-6xl">
            Encontre o <span className="text-gradient-gold">Master CCD</span> mais próximo de
            você
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Uma rede nacional de contadores parceiros formados pelo método CCD, criado por
            Anderson Maisse, para levar contabilidade consultiva e estratégica a todo o Brasil.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="ghost"
            size="lg"
            nativeButton={false}
            className="h-11 rounded-xl bg-linear-to-r from-ccd-teal to-ccd-teal-light px-6 text-white hover:opacity-90"
            render={<a href="#masters" onClick={goToSection('masters')} />}
          >
            Ver Masters no mapa
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="h-11 rounded-xl border-white/25 bg-white/5 px-6 text-white hover:bg-white/10"
            render={<a href="https://andersonmaisse.com/ccdlesp/" target="_blank" rel="noopener noreferrer" />}
          >
            Conhecer o método CCD
            <ExternalLink className="size-4" />
          </Button>
        </Reveal>

        <Reveal delay={0.4} className="mt-10 flex flex-wrap justify-center gap-3">
          {stats.map((stat) => (
            <Badge key={stat} variant="inverted">
              {stat}
            </Badge>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
