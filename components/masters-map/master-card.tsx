'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Master } from './types';
import { ArrowRight } from 'lucide-react';

interface MasterCardProps {
  master: Master;
  index: number;
}

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function MasterCard({ master, index }: MasterCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/masters/${master.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-ccd-border hover:border-ccd-teal/30 p-3"
    >
      <div className="flex gap-3 h-full">
        {/* Photo - Left Side */}
        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-ccd-mist ring-1 ring-ccd-border">
          {master.foto ? (
            <Image
              src={master.foto}
              alt={master.nome}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-semibold text-ccd-navy">
              {initials(master.nome)}
            </div>
          )}
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-ccd-ink text-sm leading-tight line-clamp-2">
              {master.nome}
            </h3>
            <p className="text-xs text-ccd-ink/50 line-clamp-1 mt-0.5">
              {master.empresa}
            </p>
          </div>

          <button
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ccd-teal hover:text-ccd-gold transition-colors mt-2"
          >
            Conhecer
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
