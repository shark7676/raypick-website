import type { MouseEvent } from 'react';
import { glideTo } from './smoothScroll';

/** On the home page the logo glides back to the top instead of doing nothing. */
export function scrollHome(e: MouseEvent<HTMLAnchorElement>, pathname: string) {
  if (pathname !== '/') return;
  e.preventDefault();
  window.history.replaceState(null, '', '/');
  requestAnimationFrame(() => glideTo(0));
}
