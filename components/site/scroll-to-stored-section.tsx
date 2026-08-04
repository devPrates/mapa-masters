'use client';

import { useEffect } from 'react';
import { SCROLL_TARGET_KEY } from '@/hooks/use-section-nav';

/**
 * Mounted once on the home page. Picks up a section id stashed by
 * `useSectionNav` before a cross-page navigation and scrolls to it - the URL
 * never carries a "#id" fragment at any point.
 */
export function ScrollToStoredSection() {
  useEffect(() => {
    const id = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (!id) return;

    sessionStorage.removeItem(SCROLL_TARGET_KEY);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return null;
}
