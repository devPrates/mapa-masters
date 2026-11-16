'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StateCode } from './types';
import { masters } from './data-masters';
import { Loader } from '@/components/ui/loader';

interface BrazilMapProps {
  selectedState: StateCode | null;
  onStateChange: (state: StateCode | null) => void;
}

// Single teal hue family throughout - states with Masters get the full,
// saturated tone so they stand out a bit; states without get a muted tint of
// the same color instead of a different hue. Selected always goes navy.
const MAP_COLORS = {
  withMaster: '#0892A5', // ccd-teal
  withMasterHover: '#04223D', // ccd-navy
  withoutMaster: '#B9D8DC', // muted tint of ccd-teal
  withoutMasterHover: '#8FBAC0', // slightly deeper tint on hover
  selected: '#04223D', // ccd-navy
};

export function BrazilMap({ selectedState, onStateChange }: BrazilMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  const onStateChangeRef = useRef(onStateChange);
  const selectedStateRef = useRef(selectedState);
  const [isLoading, setIsLoading] = useState(true);

  // Update refs when props change, so the DOM click listeners (attached once)
  // always see the latest callback/selection without needing to re-attach.
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  useEffect(() => {
    selectedStateRef.current = selectedState;
  }, [selectedState]);

  // Observer do watermark: guardado para desligar ao desmontar.
  const watermarkObserver = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;
    const w = window as any;

    const boot = () => {
      if (mapInitialized.current) return;
      mapInitialized.current = true;

      // Voltando para a home (navegação interna): os scripts já estão na
      // página — só reconfigura e redesenha, sem baixar/executar 440 KB de novo.
      if (w.simplemaps_countrymap_mapdata && typeof w.simplemaps_countrymap?.load === 'function') {
        initializeMap();
        w.simplemaps_countrymap.load();
        return;
      }

      // Primeira vez: baixa os dois scripts EM PARALELO; async=false garante
      // que executam na ordem (mapdata antes do countrymap).
      const mapdataScript = document.createElement('script');
      mapdataScript.src = '/mapdata.js';
      mapdataScript.async = false;

      const countryScript = document.createElement('script');
      countryScript.src = '/countrymap.js';
      countryScript.async = false;
      countryScript.onload = () => {
        if (mapContainer.current) initializeMap();
      };

      document.body.append(mapdataScript, countryScript);
    };

    // Só carrega o mapa (countrymap.js tem ~440 KB) quando a seção estiver
    // chegando perto da tela — não compete com o preloader e a hero.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          boot();
        }
      },
      { rootMargin: '800px 0px' },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      watermarkObserver.current?.disconnect();
    };
  }, []);

  const initializeMap = () => {
    // Access the global map object
    if (typeof (window as any).simplemaps_countrymap_mapdata === 'undefined') {
      return;
    }

    const mapdata = (window as any).simplemaps_countrymap_mapdata;

    // Modify map settings to disable interactions
    mapdata.main_settings.zoom = 'no';
    mapdata.main_settings.manual_zoom = 'no';
    mapdata.main_settings.initial_back = 'no';
    mapdata.main_settings.div = 'map';
    mapdata.main_settings.auto_load = 'yes';
    mapdata.main_settings.popup_opacity = '0';
    mapdata.main_settings.background_color = '#021627'; // CCD navy-darker background
    
    // Hide the trial text and logos
    mapdata.main_settings.hide_logo = 'yes';
    mapdata.main_settings.no_logo = 'yes';
    mapdata.main_settings.show_logo = 'no';

    // O mapdata.js padrão do Simplemaps traz um marcador "Brasília" (quadrado
    // rosa #FF0067, 25px) bem em cima do DF. Como o DF é minúsculo, o marcador
    // cobre o estado inteiro e intercepta o clique. Não usamos marcadores.
    mapdata.locations = {};

    // Setup state colors - states with Masters get the full teal tone,
    // states without get a muted tint of the same hue
    const statesWithMasters = new Set(Object.keys(masters));

    Object.keys(mapdata.state_specific).forEach((stateCode) => {
      const stateData = mapdata.state_specific[stateCode];
      const hasMaster = statesWithMasters.has(stateCode);

      stateData.color = hasMaster ? MAP_COLORS.withMaster : MAP_COLORS.withoutMaster;
      stateData.hover_color = hasMaster ? MAP_COLORS.withMasterHover : MAP_COLORS.withoutMasterHover;
      stateData.url = '';
    });

    // O desenho em si é feito pelo próprio countrymap.js (auto_load) na
    // primeira vez, ou pelo .load() no boot quando os scripts já existiam.

    setIsLoading(false);

    // Remove Simplemaps Trial watermark
    const hideWatermark = () => {
      const mapInner = document.querySelector('#map_inner');
      if (mapInner) {
        // Find and remove the watermark div (contains "Simplemaps.com Trial")
        const divsInner = mapInner.querySelectorAll('div');
        divsInner.forEach((div) => {
          if (div.textContent === 'Simplemaps.com Trial') {
            (div as HTMLElement).style.display = 'none';
            (div as HTMLElement).remove();
          }
        });
      }
    };

    // Try multiple times with increasing delays
    setTimeout(hideWatermark, 500);
    setTimeout(hideWatermark, 1000);
    setTimeout(hideWatermark, 1800);
    
    // Use MutationObserver for elements added after initial render
    const observer = new MutationObserver(() => {
      hideWatermark();
    });
    watermarkObserver.current?.disconnect();
    watermarkObserver.current = observer;
    
    setTimeout(() => {
      const mapInner = document.querySelector('#map_inner');
      if (mapInner) {
        observer.observe(mapInner, { 
          childList: true, 
          subtree: true 
        });
      }
    }, 200);

    // Add event listeners to states
    setTimeout(() => {
      attachStateListeners();
    }, 500);
  };

  const attachStateListeners = () => {
    // Get the map holder - where Simplemaps renders
    const mapHolder = document.querySelector('#map_holder');

    if (!mapHolder) return;

    attachMapHandlers(mapHolder);
  };

  // Simplemaps tags each state's rendered element with a class like
  // "sm_state sm_state_BRSP" - the suffix is the exact state code used
  // throughout this app. Reading it directly is the reliable way to know
  // which state an element represents (DOM order between labels and paths
  // is not guaranteed to match, which was the source of the mismatch bug).
  const getStateCodeFromElement = (el: Element): string | null => {
    const match = el.getAttribute('class')?.match(/\bsm_state_(\w+)/);
    return match ? match[1] : null;
  };

  const attachMapHandlers = (mapHolder: Element) => {
    // Use a timeout to ensure the map is fully rendered
    let attempts = 0;
    const tryAttach = () => {
      const stateElements = Array.from(mapHolder.querySelectorAll('[class*="sm_state_"]'));

      if (stateElements.length > 10) {
        stateElements.forEach((el) => {
          const stateCode = getStateCodeFromElement(el);
          if (!stateCode) return;

          // Attach click listener - clicking the already-selected state deselects it
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            const next = selectedStateRef.current === stateCode ? null : (stateCode as StateCode);
            onStateChangeRef.current(next);
          });

          // Attach hover effects
          el.addEventListener('mouseenter', () => {
            (el as SVGElement).style.cursor = 'pointer';
          });

          el.addEventListener('mouseleave', () => {
            (el as SVGElement).style.cursor = 'default';
          });
        });
      } else if (attempts < 15) {
        attempts++;
        setTimeout(tryAttach, 300);
      }
    };

    tryAttach();
  };

  useEffect(() => {
    // Update state colors based on selection
    const mapHolder = document.querySelector('#map_holder');
    if (!mapHolder) return;

    const statesWithMasters = new Set(Object.keys(masters));
    const stateElements = Array.from(mapHolder.querySelectorAll('[class*="sm_state_"]'));

    stateElements.forEach((el) => {
      const stateCode = getStateCodeFromElement(el);
      if (!stateCode) return;

      if (selectedState === stateCode) {
        (el as SVGElement).style.fill = MAP_COLORS.selected;
      } else if (statesWithMasters.has(stateCode)) {
        (el as SVGElement).style.fill = MAP_COLORS.withMaster;
      } else {
        (el as SVGElement).style.fill = MAP_COLORS.withoutMaster;
      }
    });
  }, [selectedState]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center justify-center h-full bg-white p-4 md:p-8"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-white"
          >
            <Loader className="size-20 md:size-28" label="Carregando mapa" />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={mapContainer} id="map" className="w-full h-full" />
    </motion.div>
  );
}
