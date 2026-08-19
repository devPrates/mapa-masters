// @ts-nocheck
// Backup: dados fictícios anteriores, substituídos por data-masters.ts (dados reais
// extraídos de lib/Mentores Master - Cadastros.csv). Mantido só como referência —
// não é mais importado em nenhum lugar do site. O modelo Master mudou (ver types.ts),
// por isso o ts-nocheck: esses dados antigos não seguem mais a shape atual.
import { Master, MasterProduct, StateMasters, StateNames } from './types';

const produtosPadrao: MasterProduct[] = [
  {
    nome: 'Consultoria Tributária',
    descricao: 'Planejamento e revisão do regime tributário ideal para o seu negócio.',
  },
  {
    nome: 'Abertura de Empresa',
    descricao: 'Abertura e regularização de CNPJ com suporte completo.',
  },
  {
    nome: 'BPO Financeiro',
    descricao: 'Gestão financeira terceirizada com relatórios mensais.',
  },
];

const especialidades = [
  'Contabilidade Consultiva',
  'Planejamento Tributário',
  'Abertura de Empresas',
  'Gestão Financeira para PMEs',
];

function especialidadePor(id: number): string {
  return especialidades[(id - 1) % especialidades.length];
}

function bioPor(cidade: string): string {
  return `Master CCD em ${cidade}, aplica o método CCD para ajudar empresários a organizar a contabilidade e crescer com previsibilidade.`;
}

export const masters: StateMasters = {
  BRSP: [
    {
      id: 1,
      nome: 'João Silva',
      empresa: 'Silva Contabilidade',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      slug: 'joao-silva',
      cidade: 'São Paulo, SP',
      especialidade: especialidadePor(1),
      bio: bioPor('São Paulo, SP'),
      produtos: produtosPadrao
    },
    {
      id: 2,
      nome: 'Maria Santos',
      empresa: 'Consultoria Santos & Co',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      slug: 'maria-santos',
      cidade: 'São Paulo, SP',
      especialidade: especialidadePor(2),
      bio: bioPor('São Paulo, SP'),
      produtos: produtosPadrao
    },
    {
      id: 3,
      nome: 'Carlos Oliveira',
      empresa: 'Oliveira Auditoria',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      slug: 'carlos-oliveira',
      cidade: 'São Paulo, SP',
      especialidade: especialidadePor(3),
      bio: bioPor('São Paulo, SP'),
      produtos: produtosPadrao
    }
  ],
  BRMG: [
    {
      id: 4,
      nome: 'Ana Costa',
      empresa: 'Costa Gestão Empresarial',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      slug: 'ana-costa',
      cidade: 'Belo Horizonte, MG',
      especialidade: especialidadePor(4),
      bio: bioPor('Belo Horizonte, MG'),
      produtos: produtosPadrao
    },
    {
      id: 5,
      nome: 'Roberto Martins',
      empresa: 'Martins & Associados',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      slug: 'roberto-martins',
      cidade: 'Belo Horizonte, MG',
      especialidade: especialidadePor(5),
      bio: bioPor('Belo Horizonte, MG'),
      produtos: produtosPadrao
    }
  ],
  BRBA: [
    {
      id: 6,
      nome: 'Fernanda Lima',
      empresa: 'Lima Consultoria',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      slug: 'fernanda-lima',
      cidade: 'Salvador, BA',
      especialidade: especialidadePor(6),
      bio: bioPor('Salvador, BA'),
      produtos: produtosPadrao
    }
  ],
  BRPR: [
    {
      id: 7,
      nome: 'Lucas Pereira',
      empresa: 'Pereira Finanças',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      slug: 'lucas-pereira',
      cidade: 'Curitiba, PR',
      especialidade: especialidadePor(7),
      bio: bioPor('Curitiba, PR'),
      produtos: produtosPadrao
    },
    {
      id: 8,
      nome: 'Patricia Gomes',
      empresa: 'Gomes Auditoria',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      slug: 'patricia-gomes',
      cidade: 'Curitiba, PR',
      especialidade: especialidadePor(8),
      bio: bioPor('Curitiba, PR'),
      produtos: produtosPadrao
    },
    {
      id: 9,
      nome: 'Eduardo Souza',
      empresa: 'Souza Consultoria Estratégica',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      slug: 'eduardo-souza',
      cidade: 'Curitiba, PR',
      especialidade: especialidadePor(9),
      bio: bioPor('Curitiba, PR'),
      produtos: produtosPadrao
    }
  ],
  BRRS: [
    {
      id: 10,
      nome: 'Gabriela Rocha',
      empresa: 'Rocha Assessoria',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      slug: 'gabriela-rocha',
      cidade: 'Porto Alegre, RS',
      especialidade: especialidadePor(10),
      bio: bioPor('Porto Alegre, RS'),
      produtos: produtosPadrao
    }
  ],
  BRCE: [
    {
      id: 11,
      nome: 'Thiago Monteiro',
      empresa: 'Monteiro & Filhos',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      slug: 'thiago-monteiro',
      cidade: 'Fortaleza, CE',
      especialidade: especialidadePor(11),
      bio: bioPor('Fortaleza, CE'),
      produtos: produtosPadrao
    }
  ],
  BRPE: [
    {
      id: 12,
      nome: 'Isabela Ferreira',
      empresa: 'Ferreira Gestão',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      slug: 'isabela-ferreira',
      cidade: 'Recife, PE',
      especialidade: especialidadePor(12),
      bio: bioPor('Recife, PE'),
      produtos: produtosPadrao
    }
  ]
};

export const stateNames: StateNames = {
  BRAC: 'Acre',
  BRAL: 'Alagoas',
  BRAM: 'Amazonas',
  BRAP: 'Amapá',
  BRBA: 'Bahia',
  BRCE: 'Ceará',
  BRDF: 'Distrito Federal',
  BRES: 'Espírito Santo',
  BRGO: 'Goiás',
  BRMA: 'Maranhão',
  BRMG: 'Minas Gerais',
  BRMS: 'Mato Grosso do Sul',
  BRMT: 'Mato Grosso',
  BRPA: 'Pará',
  BRPB: 'Paraíba',
  BRPE: 'Pernambuco',
  BRPI: 'Piauí',
  BRPR: 'Paraná',
  BRRJ: 'Rio de Janeiro',
  BRRN: 'Rio Grande do Norte',
  BRRO: 'Rondônia',
  BRRR: 'Roraima',
  BRRS: 'Rio Grande do Sul',
  BRSC: 'Santa Catarina',
  BRSE: 'Sergipe',
  BRSP: 'São Paulo',
  BRTO: 'Tocantins'
};
