export interface MasterProduct {
  nome: string;
  descricao?: string;
}

export interface Master {
  id: number;
  nome: string;
  empresa: string;
  foto: string;
  slug: string;
  cidade?: string;
  especialidade?: string;
  bio?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  produtos?: MasterProduct[];
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
