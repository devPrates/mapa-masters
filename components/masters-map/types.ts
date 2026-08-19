export interface MasterProduct {
  nome: string;
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
