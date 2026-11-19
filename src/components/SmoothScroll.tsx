'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { glideTo, setLenis } from '../lib/smoothScroll';

/**
 * Mouse-wheel / trackpad scrolling glides instead of jumping in steps.
 * Touch scrolling stays native (phones already scroll smoothly), and
 * prefers-reduced-motion turns the smoothing off (Lenis honors it).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, stopInertiaOnNavigate: true });
    setLenis(lenis);

    // same-page #links glide too (respecting each section's scroll-margin-top).
    // Capture phase: runs before next/link, which then sees the click handled and stays put.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', url.hash);
      glideTo(el);
    };
    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('click', onClick, true);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
