'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, useCarousel } from '@/components/ui/carousel'
import {
  capitalize,
  formatBRL,
  productLooks,
  productType,
} from '@/components/master-page/product-meta'
import { cn } from '@/lib/utils'
import { MasterProduct } from './types'

interface MasterProductsCarouselProps {
  produtos: MasterProduct[]
  primeiroNome: string
}

/*
 * Vitrine de produtos no estilo do exemplo (card central em destaque, laterais
 * apagadas), com a identidade CCD: cards navy, cor de destaque por TIPO de
 * produto (curso, e-book, mentoria...) e figura Hairline quando não há capa.
 * Todos os campos além de `nome` são opcionais: o card se adapta ao que existir.
 */
export function MasterProductsCarousel({ produtos, primeiroNome }: MasterProductsCarouselProps) {
  return (
    <div>
      <div className="text-center">
        <div className="flex justify-center">
          <Badge variant="inverted" className="backdrop-blur-none">
            O que oferece
          </Badge>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-white md:text-4xl">
          Produtos e serviços de {primeiroNome}
        </h2>
      </div>

      {produtos.length > 0 ? (
        <Carousel
          opts={{ align: 'center', loop: produtos.length > 2, containScroll: false }}
          className="mt-10 md:mt-14"
        >
          <CarouselContent className="items-stretch py-4">
            {produtos.map((produto, index) => (
              <CarouselItem key={`${produto.nome}-${index}`} className="basis-[82%] sm:basis-1/2 lg:basis-1/3">
                <ProductCard produto={produto} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <Controls />
        </Carousel>
      ) : (
        <p className="mt-6 text-center text-sm text-white/50">
          Em breve, mais informações sobre os serviços deste Master.
        </p>
      )}
    </div>
  )
}

function ProductCard({ produto, index }: { produto: MasterProduct; index: number }) {
  const { selectedIndex, scrollTo } = useCarousel()
  const ativo = selectedIndex === index
  const look = productLooks[productType(produto)]
  const temPreco = produto.parcelas || produto.preco

  return (
    <article
      onClick={() => !ativo && scrollTo(index)}
      style={{ '--accent': look.accent } as CSSProperties}
      className={cn(
        'flex h-full flex-col rounded-3xl border bg-ccd-navy p-5 text-center transition-all duration-500 ease-out md:p-6',
        ativo
          ? 'scale-100 border-[color-mix(in_srgb,var(--accent)_55%,transparent)] opacity-100 shadow-[0_30px_70px_-25px_color-mix(in_srgb,var(--accent)_55%,transparent)]'
          : 'scale-[0.94] cursor-pointer border-white/10 opacity-50 hover:opacity-75',
      )}
    >
      {/* Capa: imagem do produto ou figura Hairline na cor do tipo */}
      <div className="hairline-ccd-dark relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-ccd-navy">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            sizes="(min-width: 1024px) 360px, 80vw"
            className="object-contain p-4"
          />
        ) : (
          <look.Figura
            theme="dark"
            intensity={0.55}
            play={ativo}
            label={`Ilustração de ${look.rotulo.toLowerCase()}`}
            style={{ '--hairline-hi': look.accent } as CSSProperties}
            className="absolute top-1/2 left-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>

      <p className="mt-5 text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
        {produto.categoria ?? look.rotulo}
      </p>
      <h3 className="mt-2 line-clamp-2 text-xl leading-snug font-bold text-white">
        {capitalize(produto.nome)}
      </h3>
      {produto.descricao && (
        <p className="mt-3 line-clamp-3 text-sm text-white/60">{produto.descricao}</p>
      )}

      <div className="flex-1" />

      {temPreco && (
        <div className="mt-5">
          {produto.precoDe && (
            <p className="text-sm text-white/40 line-through">De {formatBRL(produto.precoDe)}</p>
          )}
          <p className="text-2xl font-bold text-[var(--accent)] tabular-nums">
            {produto.parcelas
              ? `${produto.parcelas.quantidade}x ${formatBRL(produto.parcelas.valor)}`
              : formatBRL(produto.preco!)}
          </p>
          {produto.parcelas && produto.preco && (
            <p className="text-xs text-white/40">ou {formatBRL(produto.preco)} à vista</p>
          )}
        </div>
      )}

      <a
        href={produto.link ?? '#contato'}
        {...(produto.link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        tabIndex={ativo ? 0 : -1}
        className={cn(
          'mt-5 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold tracking-wider uppercase transition',
          'bg-[var(--accent)] text-ccd-navy-darker hover:brightness-110',
        )}
      >
        {produto.cta ?? (produto.link ? 'Saiba mais' : 'Quero saber mais')}
        {produto.link && <ExternalLink className="size-4" />}
      </a>
    </article>
  )
}

function Controls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext, scrollSnaps, selectedIndex, scrollTo } =
    useCarousel()
  if (scrollSnaps.length <= 1) return null

  const botao =
    'flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-30'

  return (
    <div className="mt-6 flex items-center justify-center gap-5">
      <button type="button" onClick={scrollPrev} disabled={!canScrollPrev} className={botao}>
        <ArrowLeft className="size-4" />
        <span className="sr-only">Produto anterior</span>
      </button>
      <div className="flex items-center gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Ir para o produto ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === selectedIndex ? 'w-6 bg-ccd-gold-light' : 'w-1.5 bg-white/25 hover:bg-white/45',
            )}
          />
        ))}
      </div>
      <button type="button" onClick={scrollNext} disabled={!canScrollNext} className={botao}>
        <ArrowRight className="size-4" />
        <span className="sr-only">Próximo produto</span>
      </button>
    </div>
  )
}
