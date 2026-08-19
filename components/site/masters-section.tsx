import { MastersMap } from '@/components/masters-map'
import { masters } from '@/components/masters-map/data-masters'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'

export function MastersSection() {
  const allMasters = Object.values(masters).flat()
  const statesWithMasters = Object.values(masters).filter((list) => list.length > 0).length

  return (
    <section id="masters" className="scroll-mt-24 bg-white pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 pb-2 text-center md:px-8">
        <Reveal className="flex justify-center">
          <Badge variant="navy">Mapa de Masters</Badge>
        </Reveal>
        <Reveal
          delay={0.1}
          className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-ccd-ink/60"
        >
          <span>{statesWithMasters} estados mapeados</span>
          <span aria-hidden>·</span>
          <span>{allMasters.length} Masters ativos</span>
          <span aria-hidden>·</span>
          <span>Metodologia CCD aplicada</span>
        </Reveal>
      </div>
      <MastersMap />
    </section>
  )
}
