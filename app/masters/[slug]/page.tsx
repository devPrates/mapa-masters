import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Globe } from 'lucide-react';

import { MasterAtuacao } from '@/components/master-page/master-atuacao';
import { MasterComoAjuda } from '@/components/master-page/master-como-ajuda';
import { MasterHero } from '@/components/master-page/master-hero';
import { BackToMapLink } from '@/components/site/back-to-map-link';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import { masters, stateNames } from '@/components/masters-map/data-masters';
import { MasterCard } from '@/components/masters-map/master-card';
import { MasterProductsCarousel } from '@/components/masters-map/master-products-carousel';
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

function toExternalHref(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const INSTAGRAM_BASE_URL = 'https://www.instagram.com';
const YOUTUBE_BASE_URL = 'https://www.youtube.com';

interface ContactButtonProps {
  href: string;
  label: string;
  observacao?: string;
  iconSrc?: string;
  icon?: ReactNode;
}

function ContactButton({ href, label, observacao, iconSrc, icon }: ContactButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-ccd-border bg-white px-4 py-3 text-ccd-ink transition hover:-translate-y-0.5 hover:border-ccd-teal hover:shadow-sm"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ccd-mist">
        {iconSrc ? (
          <Image src={iconSrc} alt="" width={20} height={20} className="size-5" />
        ) : (
          icon
        )}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        {observacao && <span className="text-xs text-ccd-ink/50">{observacao}</span>}
      </span>
    </a>
  );
}

// Gera todas as páginas de Master no build (HTML estático, abre instantâneo).
export function generateStaticParams() {
  return Object.values(masters)
    .flat()
    .map((m) => ({ slug: m.slug }));
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
  const primeiroNome = master.nome.trim().split(/\s+/)[0];

  const sameStateMasters = masters[stateCode].filter((m) => m.slug !== slug).slice(0, 3);
  const otherMasters =
    sameStateMasters.length > 0
      ? sameStateMasters
      : Object.values(masters)
          .flat()
          .filter((m) => m.slug !== slug)
          .slice(0, 3);

  const hasContact = Boolean(
    master.contatos.length > 0 || master.instagram || master.youtube || master.site,
  );

  return (
    <div className="min-h-screen bg-white">
      <Header variant="solid" />

      <div className="pt-24">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 md:px-8">
          <BackToMapLink />
          <p className="hidden truncate text-xs text-ccd-ink/40 sm:block">
            Masters CCD / {stateName} / {master.nome}
          </p>
        </div>
      </div>

      {/* Cabeçalho animado (GSAP) */}
      <div className="px-4 md:px-8">
        <MasterHero master={master} stateName={stateName} />
      </div>

      <main className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Atuação: 3 cards com figuras Hairline */}
        <section className="pt-14 md:pt-20">
          <Reveal>
            <Badge variant="teal">Atuação</Badge>
            <h2 className="mt-3 text-2xl font-bold text-ccd-ink md:text-3xl">
              Onde {primeiroNome} faz a diferença
            </h2>
          </Reveal>
          <div className="mt-8">
            <MasterAtuacao master={master} />
          </div>
        </section>

        <div className="grid gap-10 py-14 md:grid-cols-3 md:py-20">
          <div className="min-w-0 space-y-14 md:col-span-2">
            <Reveal>
              <Badge variant="navy">Sobre</Badge>
              <h2 className="mt-3 text-2xl font-bold text-ccd-ink md:text-3xl">
                Conheça {primeiroNome}
              </h2>
              <p className="mt-4 leading-relaxed text-ccd-ink/70">
                {master.bio ??
                  'Master CCD aplicando o método CCD para transformar a contabilidade de seus clientes.'}
              </p>
            </Reveal>

            <MasterComoAjuda texto={master.comoAjuda} primeiroNome={primeiroNome} />
          </div>

          {/* Contatos */}
          <aside className="md:col-span-1">
            <div
              id="contato"
              className="sticky top-24 scroll-mt-28 overflow-hidden rounded-3xl border border-ccd-border bg-white shadow-[0_10px_30px_rgba(4,44,78,0.08)]">
              <div className="bg-linear-to-br from-ccd-navy to-ccd-teal px-6 py-5 text-white">
                <p className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-white/60 uppercase">
                  <span className="size-1.5 animate-pulse rounded-full bg-ccd-gold-light" />
                  Contato direto
                </p>
                <h2 className="mt-1 text-lg font-bold">Fale com {primeiroNome}</h2>
              </div>
              <div className="bg-ccd-mist p-5">
                {hasContact ? (
                  <div className="grid gap-2">
                    {master.contatos.map((contato, index) =>
                      contato.typeContact === 'email' ? (
                        <ContactButton
                          key={`${contato.typeContact}-${index}`}
                          href={`mailto:${contato.valor}`}
                          label="E-mail"
                          observacao={contato.observacao}
                          iconSrc="/icones/gmail.svg"
                        />
                      ) : (
                        <ContactButton
                          key={`${contato.typeContact}-${index}`}
                          href={`https://wa.me/${contato.valor.replace(/\D/g, '')}`}
                          label="WhatsApp"
                          observacao={contato.observacao}
                          iconSrc="/icones/whatsapp.svg"
                        />
                      ),
                    )}
                    {master.instagram && (
                      <ContactButton
                        href={`${INSTAGRAM_BASE_URL}/${master.instagram}`}
                        label="Instagram"
                        iconSrc="/icones/instagram.svg"
                      />
                    )}
                    {master.youtube && (
                      <ContactButton
                        href={`${YOUTUBE_BASE_URL}/${master.youtube}`}
                        label="YouTube"
                        iconSrc="/icones/youtube.svg"
                      />
                    )}
                    {master.site && (
                      <ContactButton
                        href={toExternalHref(master.site)}
                        label="Site"
                        icon={<Globe className="size-5" />}
                      />
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
          </aside>
        </div>

      </main>

      {/* Vitrine de produtos: faixa escura na largura toda (como o Método da home) */}
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top,_var(--ccd-navy)_0%,_var(--ccd-navy-darker)_70%)] py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <MasterProductsCarousel produtos={master.produtos ?? []} primeiroNome={primeiroNome} />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 md:px-8">
        <section className="pt-14 pb-20">
          <Reveal>
            <h2 className="text-2xl font-bold text-ccd-ink">
              {sameStateMasters.length > 0 ? `Outros Masters em ${stateName}` : 'Conheça outros Masters CCD'}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {otherMasters.map((m, index) => (
              <MasterCard key={m.id} master={m} index={index} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
