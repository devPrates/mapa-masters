'use client';

import { useState } from 'react';
import { BrazilMap } from './brazil-map';
import { StatePanel } from './state-panel';
import { StateCode } from './types';
import { motion } from 'framer-motion';

export function MastersMap() {
  const [selectedState, setSelectedState] = useState<StateCode | null>(null);

  return (
    <section className="w-full bg-white flex flex-col">
      <div className="mx-auto w-full max-w-6xl flex flex-col px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center pb-6 md:pb-8"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-ccd-ink mb-2">
            Conheça os <span className="text-gradient-gold">Masters</span> de Cada Estado
          </h2>
          <p className="text-ccd-ink/60 text-sm md:text-lg">
            Explore nossos especialistas por região e encontre o parceiro ideal para seu negócio
          </p>
        </motion.div>

        {/* Map Container */}
        <div className="flex flex-col md:grid md:grid-cols-5 gap-4 lg:gap-6 md:h-130 lg:h-140">
          {/* State Panel - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-80 md:h-auto md:col-span-2 rounded-2xl border border-ccd-border overflow-hidden min-h-0"
          >
            <StatePanel selectedState={selectedState} onClear={() => setSelectedState(null)} />
          </motion.div>

          {/* Brazil Map - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-72 sm:h-96 md:h-auto md:col-span-3 rounded-2xl border border-ccd-border overflow-hidden min-h-0"
          >
            <BrazilMap selectedState={selectedState} onStateChange={setSelectedState} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
