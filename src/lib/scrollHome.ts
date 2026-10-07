import type { MouseEvent } from 'react';

/** On the home page the logo glides back to the top instead of doing nothing. */
export function scrollHome(e: MouseEvent<HTMLAnchorElement>, pathname: string) {
  if (pathname !== '/') return;
  e.preventDefault();
  window.history.replaceState(null, '', '/');
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
