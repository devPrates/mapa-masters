import { CheckCircle2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { MasterProduct } from './types'

interface MasterProductsCarouselProps {
  produtos: MasterProduct[]
}

const gradients = [
  'from-ccd-teal to-ccd-teal-light',
  'from-ccd-navy to-ccd-teal',
  'from-ccd-gold to-ccd-gold-light',
]

export function MasterProductsCarousel({ produtos }: MasterProductsCarouselProps) {
  return (
    <div>
      <Badge variant="teal">O que oferece</Badge>
      <h2 className="mt-3 text-2xl font-bold text-ccd-ink">Produtos e Serviços</h2>

      {produtos.length > 0 ? (
        <Carousel opts={{ align: 'start', loop: produtos.length > 2 }} className="mt-6">
          <CarouselContent>
            {produtos.map((produto, index) => (
              <CarouselItem key={produto.nome} className="sm:basis-1/2">
                <div
                  className={cn(
                    'flex h-[450px] flex-col justify-between rounded-3xl bg-gradient-to-br p-8 text-white shadow-[0_10px_30px_rgba(4,44,78,0.12)]',
                    gradients[index % gradients.length],
                  )}
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <CheckCircle2 className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{produto.nome}</p>
                    {produto.descricao && (
                      <p className="mt-2 text-sm text-white/80">{produto.descricao}</p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-6 flex items-center justify-center gap-4">
            <CarouselPrevious />
            <CarouselDots />
            <CarouselNext />
          </div>
        </Carousel>
      ) : (
        <p className="mt-3 text-sm text-ccd-ink/50">
          Em breve, mais informações sobre os serviços deste Master.
        </p>
      )}
    </div>
  )
}
