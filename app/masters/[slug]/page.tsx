import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AtSign, Award, CheckCircle2, Mail, MapPin, MessageCircle } from 'lucide-react';

import { BackToMapLink } from '@/components/site/back-to-map-link';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { masters, stateNames } from '@/components/masters-map/data';
import { MasterCard } from '@/components/masters-map/master-card';
import { Master, StateCode } from '@/components/masters-map/types';

interface MasterDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function findMaster(slug: string): { master: Master; stateCode: StateCode } | null {
  for (const key in masters) {
    const stateCode = key as StateCode;
    const found = masters[stateCode].find((m) => m.slug === slug);
    if (found) {
      return { master: found, stateCode };
    }
  }
  return null;
}

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export async function generateMetadata({ params }: MasterDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = findMaster(slug);

  if (!result) {
    return { title: 'Master não encontrado — CCD Masters' };
  }

  const { master } = result;
  return {
    title: `${master.nome} — Master CCD${master.cidade ? ` em ${master.cidade}` : ''}`,
    description:
      master.bio ?? `Conheça ${master.nome}, Master CCD, e os serviços oferecidos por ${master.empresa}.`,
  };
}

export default async function MasterDetailPage({ params }: MasterDetailPageProps) {
  const { slug } = await params;
  const result = findMaster(slug);

  if (!result) {
    notFound();
  }

  const { master, stateCode } = result;
  const stateName = stateNames[stateCode];

  const sameStateMasters = masters[stateCode].filter((m) => m.slug !== slug).slice(0, 3);
  const otherMasters =
    sameStateMasters.length > 0
      ? sameStateMasters
      : Object.values(masters)
          .flat()
          .filter((m) => m.slug !== slug)
          .slice(0, 3);

  const hasContact = Boolean(master.whatsapp || master.email || master.instagram);

  return (
    <div className="min-h-screen bg-white">
      <Header variant="solid" />

      <div className="mx-auto max-w-5xl px-4 pt-24">
        <BackToMapLink />
        <p className="mt-2 text-xs text-ccd-ink/40">
          Masters CCD / {stateName} / {master.nome}
        </p>
      </div>

      <section className="relative mt-6 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-ccd-navy to-ccd-teal py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center md:flex-row md:text-left">
          <Avatar className="size-32 shrink-0 ring-4 ring-white/20 md:size-40">
            <AvatarImage src={master.foto} alt={master.nome} />
            <AvatarFallback className="bg-white/10 text-3xl text-white">
              {initials(master.nome)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{master.nome}</h1>
            <p className="mt-1 text-white/80">{master.empresa}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {master.cidade && (
                <Badge variant="inverted">
                  <MapPin className="size-3" />
                  {master.cidade}
                </Badge>
              )}
              {master.especialidade && (
                <Badge variant="inverted">
                  <Award className="size-3" />
                  {master.especialidade}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-10 md:col-span-2">
          <div>
            <h2 className="text-xl font-semibold text-ccd-ink">Sobre</h2>
            <p className="mt-3 text-ccd-ink/70">
              {master.bio ??
                'Master CCD aplicando o método CCD para transformar a contabilidade de seus clientes.'}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-ccd-ink">Produtos e Serviços</h2>
            {master.produtos && master.produtos.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {master.produtos.map((produto) => (
                  <div key={produto.nome} className="rounded-2xl border border-ccd-border p-5">
                    <CheckCircle2 className="size-5 text-ccd-teal" />
                    <p className="mt-3 font-semibold text-ccd-ink">{produto.nome}</p>
                    {produto.descricao && (
                      <p className="mt-1 text-sm text-ccd-ink/60">{produto.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ccd-ink/50">
                Em breve, mais informações sobre os serviços deste Master.
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-3 rounded-2xl border border-ccd-border bg-ccd-mist p-6">
            <h2 className="text-sm font-semibold text-ccd-ink">Contato</h2>
            {hasContact ? (
              <div className="space-y-3 text-sm">
                {master.whatsapp && (
                  <a
                    href={`https://wa.me/${master.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ccd-ink/70 hover:text-ccd-teal"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </a>
                )}
                {master.email && (
                  <a
                    href={`mailto:${master.email}`}
                    className="flex items-center gap-2 text-ccd-ink/70 hover:text-ccd-teal"
                  >
                    <Mail className="size-4" />
                    {master.email}
                  </a>
                )}
                {master.instagram && (
                  <a
                    href={`https://instagram.com/${master.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ccd-ink/70 hover:text-ccd-teal"
                  >
                    <AtSign className="size-4" />@{master.instagram}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-ccd-ink/50">
                Este Master ainda não cadastrou um canal direto de contato. Em breve você poderá
                falar diretamente por aqui.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-xl font-semibold text-ccd-ink">
          {sameStateMasters.length > 0 ? `Outros Masters em ${stateName}` : 'Conheça outros Masters CCD'}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {otherMasters.map((m, index) => (
            <MasterCard key={m.id} master={m} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
