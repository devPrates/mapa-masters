import type { ComponentType } from 'react'
import { Format, Hub, Laptop, Loupe, Riffle, Stack, type HairlineProps } from '@lucasmarkes/hairline/react'

import type { MasterProduct, ProductType } from '@/components/masters-map/types'

interface ProductLook {
  rotulo: string
  /** Cor de destaque (paleta CCD) usada no rótulo, preço, botão e brilho. */
  accent: string
  Figura: ComponentType<HairlineProps>
}

// Cores só da paleta CCD (tons claros, para ler bem sobre o navy).
export const productLooks: Record<ProductType, ProductLook> = {
  curso: { rotulo: 'Curso', accent: '#38BDF8', Figura: Laptop }, // teal-light
  ebook: { rotulo: 'E-book', accent: '#F2C94C', Figura: Riffle }, // gold-light
  mentoria: { rotulo: 'Mentoria', accent: '#4FC3D1', Figura: Hub }, // teal claro
  consultoria: { rotulo: 'Consultoria', accent: '#E2B23A', Figura: Loupe }, // gold
  tecnologia: { rotulo: 'Tecnologia', accent: '#7FD3DF', Figura: Format }, // teal bem claro
  servico: { rotulo: 'Serviço contábil', accent: '#B9D8DC', Figura: Stack }, // teal-mist
}

// Ordem importa: o primeiro que casar vence.
const regras: [RegExp, ProductType][] = [
  [/e-?book|livro|guia|manual/i, 'ebook'],
  [/curso|treinamento|m[ée]todo|aula/i, 'curso'],
  [/mentoria/i, 'mentoria'],
  [/consultoria|assessoria|orienta|diagn[óo]stic|parecer/i, 'consultoria'],
  [/sistema|ferramenta|automa|tecnol|digital|intelig[êe]ncia|tech/i, 'tecnologia'],
]

/** Tipo informado ou deduzido do nome (para os produtos que ainda só têm nome). */
export function productType(produto: MasterProduct): ProductType {
  if (produto.tipo) return produto.tipo
  return regras.find(([re]) => re.test(produto.nome))?.[1] ?? 'servico'
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatBRL = (valor: number) => brl.format(valor)

/** "Planejamento tributário" mesmo quando cadastrado como "planejamento tributário". */
export function capitalize(texto: string) {
  return texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1)
}
