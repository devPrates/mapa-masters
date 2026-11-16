/** Define a cor de destaque e a figura do card. Sem tipo, é deduzido pelo nome. */
export type ProductType = 'curso' | 'ebook' | 'mentoria' | 'consultoria' | 'tecnologia' | 'servico';

export interface MasterProduct {
  nome: string;
  /** Tipo do produto (cor + ícone do card). Opcional: deduzido do nome se faltar. */
  tipo?: ProductType;
  /** Texto pequeno acima do título. Ex.: "Curso completo", "E-book prático". */
  categoria?: string;
  /** 1–2 frases sobre o que a pessoa ganha. O card mostra até 3 linhas. */
  descricao?: string;
  /** Capa/logo do produto em /public (ex.: '/produtos/guia-processos.png'). */
  imagem?: string;
  /** Página de venda ou de mais informações. Sem link, o botão leva aos contatos. */
  link?: string;
  /** Preço à vista, em reais. Ex.: 497 */
  preco?: number;
  /** Preço "de" (riscado), em reais. Ex.: 597 */
  precoDe?: number;
  /** Parcelamento. Ex.: { quantidade: 6, valor: 8.32 } → "6x R$ 8,32" */
  parcelas?: { quantidade: number; valor: number };
  /** Texto do botão. Padrão: "Saiba mais" (com link) ou "Quero saber mais". */
  cta?: string;
}

export type ContactType = 'email' | 'telefone';

export interface MasterContact {
  typeContact: ContactType;
  valor: string;
  observacao?: string;
}

export interface Master {
  id: number;
  nome: string;
  slug: string;
  uf: string;
  cidade: string;
  empresa: string;
  especialidade: string[];
  publicoTipo: string;
  nichoDescricao: string[];
  tempoAtuacao: string;
  bio: string;
  produtos: MasterProduct[];
  comoAjuda: string;
  contatos: MasterContact[];
  instagram?: string;
  youtube?: string;
  site?: string;
  foto: string;
  logo?: string;
}

export type StateCode =
  | 'BRAC' | 'BRAL' | 'BRAM' | 'BRAP' | 'BRBA' | 'BRCE' | 'BRDF'
  | 'BRES' | 'BRGO' | 'BRMA' | 'BRMG' | 'BRMS' | 'BRMT' | 'BRPA'
  | 'BRPB' | 'BRPE' | 'BRPI' | 'BRPR' | 'BRRJ' | 'BRRN' | 'BRRO'
  | 'BRRR' | 'BRRS' | 'BRSC' | 'BRSE' | 'BRSP' | 'BRTO';

export interface StateMasters {
  [key: string]: Master[];
}

export interface StateNames {
  [key: string]: string;
}
