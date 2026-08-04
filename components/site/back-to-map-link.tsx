'use client';

import { CircleArrowLeft } from 'lucide-react';

import { useSectionNav } from '@/hooks/use-section-nav';

export function BackToMapLink() {
  const { goToSection } = useSectionNav();

  return (
    <a
      href="#masters"
      onClick={goToSection('masters')}
      className="inline-flex items-center gap-1.5 rounded-full border border-ccd-border py-1.5 pr-3 pl-2.5 text-sm font-medium text-ccd-ink/60 transition-colors hover:border-ccd-teal/40 hover:text-ccd-teal"
    >
      <CircleArrowLeft className="size-4" />
      Voltar ao mapa
    </a>
  );
}
