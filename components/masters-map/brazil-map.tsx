'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StateCode } from './types';
import { stateNames, masters } from './data';
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

  useEffect(() => {
    // Load map scripts
    const script1 = document.createElement('script');
    script1.src = '/mapdata.js';
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = '/countrymap.js';
    script2.async = true;

    script1.onload = () => {
      script2.onload = () => {
        if (mapContainer.current && !mapInitialized.current) {
          initializeMap();
          mapInitialized.current = true;
        }
      };
      document.body.appendChild(script2);
    };

    document.body.appendChild(script1);

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
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

    // Load the map
    if (typeof (window as any).simplemaps_countrymap === 'function') {
      (window as any).simplemaps_countrymap(mapdata);
    }

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

    // Create a mapping of state code to data attributes or look for an alternate way to get state IDs
    // The Raphael-rendered SVG elements might have title or other attributes
    const allElements = mapHolder.querySelectorAll('svg, *');
    
    // We'll intercept state data to add our own hover and click handlers
    // Look for states in the SVG and attach listeners using data attributes or by index
    attachMapHandlers(mapHolder);
  };

  const attachMapHandlers = (mapHolder: Element) => {
    // Use a timeout to ensure the map is fully rendered
    let attempts = 0;
    const tryAttach = () => {
      // Look for text elements which contain state names
      const texts = mapHolder.querySelectorAll('text');
      const stateTexts = Array.from(texts).filter((t) =>
        Object.values(stateNames).includes(t.textContent || '')
      );

      if (stateTexts.length > 10) {
        // Found state text labels - create a mapping
        const stateIndexMap = new Map<number, string>();
        stateTexts.forEach((textElement, index) => {
          const stateName = textElement.textContent || '';
          const stateCode = Object.keys(stateNames).find(
            (code) => stateNames[code] === stateName
          );
          if (stateCode) {
            stateIndexMap.set(index, stateCode);
          }
        });

        // Get the main SVG with state paths (should be the 2nd or larger SVG)
        const svgs = Array.from(mapHolder.querySelectorAll('svg'));
        let mainSvg: SVGElement | null = null;

        // Find the SVG with the most paths (the one with the states)
        svgs.forEach((svg) => {
          const pathCount = svg.querySelectorAll('path').length;
          if (pathCount > 10 && !mainSvg) {
            mainSvg = svg as SVGElement;
          }
        });

        if (mainSvg) {
          const paths = Array.from(mainSvg.querySelectorAll('path'));
          let stateIndex = 0;

          // Attach listeners to each path in order
          paths.forEach((path) => {
            if (stateIndexMap.has(stateIndex)) {
              const stateCode = stateIndexMap.get(stateIndex)!;

              // Attach click listener - clicking the already-selected state deselects it
              path.addEventListener('click', (e) => {
                e.stopPropagation();
                const next = selectedStateRef.current === stateCode ? null : (stateCode as StateCode);
                onStateChangeRef.current(next);
              });

              // Attach hover effects
              path.addEventListener('mouseenter', () => {
                (path as SVGElement).style.cursor = 'pointer';
              });

              path.addEventListener('mouseleave', () => {
                (path as SVGElement).style.cursor = 'default';
              });

              stateIndex++;
            }
          });
        }
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

    const texts = mapHolder.querySelectorAll('text');
    const stateIndexMap = new Map<number, string>();
    
    // Build the state index map
    let indexCount = 0;
    texts.forEach((textElement) => {
      const stateName = textElement.textContent || '';
      const stateCode = Object.keys(stateNames).find(
        (code) => stateNames[code] === stateName
      );
      if (stateCode) {
        stateIndexMap.set(indexCount, stateCode);
        indexCount++;
      }
    });

    // Find the main SVG
    const svgs = Array.from(mapHolder.querySelectorAll('svg'));
    let mainSvg: SVGElement | null = null;

    svgs.forEach((svg) => {
      const pathCount = svg.querySelectorAll('path').length;
      if (pathCount > 10 && !mainSvg) {
        mainSvg = svg as SVGElement;
      }
    });

    const statesWithMasters = new Set(Object.keys(masters));

    if (mainSvg) {
      const paths = Array.from(mainSvg.querySelectorAll('path'));
      let stateIndex = 0;

      paths.forEach((path) => {
        if (stateIndexMap.has(stateIndex)) {
          const stateCode = stateIndexMap.get(stateIndex)!;

          if (selectedState === stateCode) {
            (path as SVGElement).style.fill = MAP_COLORS.selected;
          } else if (statesWithMasters.has(stateCode)) {
            (path as SVGElement).style.fill = MAP_COLORS.withMaster;
          } else {
            (path as SVGElement).style.fill = MAP_COLORS.withoutMaster;
          }
          stateIndex++;
        }
      });
    }
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
