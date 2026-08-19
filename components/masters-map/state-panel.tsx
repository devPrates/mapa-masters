'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Handshake, MousePointerClick, Sparkles, Users, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MasterCard } from './master-card';
import { Master, StateCode } from './types';
import { masters, stateNames } from './data-masters';

interface StatePanelProps {
  selectedState: StateCode | null;
  onClear?: () => void;
}

const guideSteps = [
  { icon: MousePointerClick, label: 'Clique em um estado no mapa' },
  { icon: Users, label: 'Veja os Masters daquela região' },
  { icon: Handshake, label: 'Entre em contato e conheça o trabalho' },
];

const legendItems = [
  { color: 'bg-ccd-teal', label: 'Com Master' },
  { color: 'bg-ccd-teal-mist', label: 'Em expansão' },
  { color: 'bg-ccd-navy', label: 'Selecionado' },
];

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function getFeaturedMaster(): { master: Master; stateCode: StateCode } | null {
  const entries = Object.entries(masters) as [StateCode, Master[]][];
  const pool = entries.flatMap(([stateCode, list]) => list.map((master) => ({ master, stateCode })));
  if (pool.length === 0) return null;
  // Rotates deterministically by day of month, so it feels curated ("today's
  // featured Master") without drifting between server/client render.
  const index = new Date().getDate() % pool.length;
  return pool[index];
}

export function StatePanel({ selectedState, onClear }: StatePanelProps) {
  const stateMasters = selectedState ? masters[selectedState] || [] : [];
  const stateName = selectedState ? stateNames[selectedState] : null;
  const featured = getFeaturedMaster();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-ccd-border">
        <AnimatePresence mode="wait">
          {selectedState && stateName ? (
            <motion.div
              key={selectedState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start justify-between gap-3"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-ccd-ink">
                  {stateName}
                </h2>
                <p className="text-sm text-ccd-ink/50 mt-1">
                  {stateMasters.length} Master{stateMasters.length !== 1 ? 's' : ''} disponível{stateMasters.length !== 1 ? 's' : ''}
                </p>
              </div>
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-ccd-border px-2.5 py-1 text-xs font-medium text-ccd-ink/50 transition-colors hover:border-ccd-teal/40 hover:text-ccd-teal"
                >
                  <X className="size-3" />
                  Limpar
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-ccd-ink/40">
                Estados
              </h2>
              <p className="text-sm text-ccd-ink/40 mt-1">
                Selecione um estado no mapa
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 md:px-8 py-6">
          <AnimatePresence mode="wait">
            {selectedState && stateName ? (
              <motion.div
                key={selectedState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {stateMasters.length > 0 ? (
                  <div className="space-y-3">
                    {stateMasters.map((master: Master, index: number) => (
                      <MasterCard key={master.id} master={master} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-ccd-ink/50 text-sm">
                      Nenhum Master disponível neste estado ainda.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {featured && (
                  <Link href={`/masters/${featured.master.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ccd-navy to-ccd-teal p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                      <div
                        aria-hidden
                        className="absolute -top-10 -right-10 size-32 rounded-full bg-ccd-gold/25 blur-2xl"
                      />
                      <Badge variant="gold" className="relative">
                        <Sparkles className="size-3" />
                        Master em destaque
                      </Badge>

                      <div className="relative mt-4 flex items-center gap-3">
                        <Avatar className="size-14 shrink-0 ring-2 ring-ccd-gold/60">
                          <AvatarImage src={featured.master.foto} alt={featured.master.nome} />
                          <AvatarFallback className="bg-white/10 text-white">
                            {initials(featured.master.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">{featured.master.nome}</p>
                          <p className="truncate text-xs text-white/60">{featured.master.empresa}</p>
                          <p className="mt-0.5 text-xs font-medium text-ccd-gold-light">
                            {stateNames[featured.stateCode]}
                          </p>
                        </div>
                      </div>

                      <div className="relative mt-4 flex items-center gap-1.5 text-xs font-medium text-white/80 transition-colors group-hover:text-ccd-gold-light">
                        Conhecer este Master
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                )}

                <div className="space-y-3 rounded-2xl border border-ccd-border p-4">
                  {guideSteps.map((step, index) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ccd-mist text-xs font-bold text-ccd-teal">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-ccd-ink/70">
                        <step.icon className="size-4 text-ccd-teal" />
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-ccd-border bg-ccd-mist px-4 py-3 text-xs text-ccd-ink/60">
                  {legendItems.map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5">
                      <span className={`size-2.5 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
