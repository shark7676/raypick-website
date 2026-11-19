import type Lenis from 'lenis';

/** The page-wide smooth scroller (set by <SmoothScroll>); null on reduced motion or before it starts. */
let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

/** Freeze page scrolling (open menu) or release it. */
export function lockScroll(on: boolean) {
  document.body.style.overflow = on ? 'hidden' : '';
  if (on) lenis?.stop();
  else lenis?.start();
}

/** Glide to a y position or an element (offset in px), falling back to the browser's own smooth scroll. */
export function glideTo(target: number | Element, offset = 0) {
  if (lenis) {
    if (lenis.isStopped) lenis.start(); // e.g. a link in the open mobile menu
    lenis.scrollTo(target as number | HTMLElement, { offset, duration: 1.4 });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + offset, behavior: 'smooth' });
}
