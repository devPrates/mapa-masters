'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

export const SCROLL_TARGET_KEY = 'ccd-scroll-target';

/**
 * Navigates to an in-page section (`id`, without the leading "#") using
 * scrollIntoView instead of a native hash link, so the URL never picks up a
 * "#id" fragment. From another route, it stashes the target in
 * sessionStorage and does a clean `router.push('/')` - `ScrollToStoredSection`
 * picks it up once the home page mounts.
 */
export function useSectionNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const goToSection = (id: string) => (event: MouseEvent) => {
    event.preventDefault();

    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    sessionStorage.setItem(SCROLL_TARGET_KEY, id);
    router.push('/');
  };

  return { goToSection, isHome };
}
