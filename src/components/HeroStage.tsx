'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { apps, comingApps, liveApps } from '../data/apps';
import { company } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import type { HeroScene } from '../lib/three/heroScene';
import { AppleIcon, GooglePlayIcon } from './icons';
import styles from './HeroStage.module.css';

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Live apps scroll to their showcase panel, upcoming ones to their card. */
function goToApp(slug: string) {
  const live = liveApps.some((a) => a.slug === slug);
  document.getElementById(live ? `app-${slug}` : `soon-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export default function HeroStage() {
  const { t, language } = useLanguage();
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const scene = useRef<HeroScene | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [noGL, setNoGL] = useState(false);

  // 3D scene (loaded after first paint so text shows immediately)
  useEffect(() => {
    let disposed = false;
    const start = () =>
      import('../lib/three/heroScene')
        .then(({ HeroScene }) => {
          if (disposed || !canvas.current || !labels.current) return;
          scene.current = new HeroScene(
            canvas.current,
            labels.current,
            apps.map((a) => ({ slug: a.slug, color: a.color, icon: a.icon, soon: a.status === 'coming' })),
            goToApp,
          );
          setSceneReady(true);
          onScroll();
        })
        .catch(() => setNoGL(true));
    // let the text paint first, then build the 3D scene when the browser has a free moment
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 200);

    const io = new IntersectionObserver(([e]) => scene.current?.setActive(e.isIntersecting), { rootMargin: '100px' });
    if (wrap.current) io.observe(wrap.current);

    function onScroll() {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - window.innerHeight));
      scene.current?.setProgress(p);
      const a = 1 - smooth(0.08, 0.24, p);
      const b = smooth(0.46, 0.58, p) * (1 - smooth(0.84, 0.92, p));
      if (aRef.current) {
        aRef.current.style.opacity = String(a);
        aRef.current.style.transform = `translateY(${(-p * 120).toFixed(1)}px)`;
        aRef.current.style.visibility = a < 0.01 ? 'hidden' : 'visible';
      }
      if (bRef.current) {
        bRef.current.style.opacity = String(b);
        bRef.current.style.transform = `translateY(${((1 - smooth(0.46, 0.6, p)) * 40).toFixed(1)}px)`;
        bRef.current.style.visibility = b < 0.01 ? 'hidden' : 'visible';
      }
      if (flashRef.current) {
        // a disc of light grows out of the logo until it fills the screen
        flashRef.current.style.opacity = String(smooth(0.84, 0.9, p));
        flashRef.current.style.setProperty('--f', smooth(0.84, 0.99, p).toFixed(4));
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      disposed = true;
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  // orbit labels follow the language
  useEffect(() => {
    if (!sceneReady) return;
    scene.current?.setLabels(
      apps.map((a) => {
        const stores = [a.stores.android && 'Google Play', a.stores.ios && 'App Store'].filter(Boolean).join(' · ');
        const narrow = window.innerWidth < 760; // short labels on phones
        return { name: a.name[language], note: a.status === 'live' ? (narrow ? t.orbit.live : `${t.orbit.live} · ${stores}`) : t.orbit.coming };
      }),
    );
  }, [sceneReady, language, t]);

  return (
    <section ref={wrap} className={styles.stage} id="top">
      <div className={styles.sticky}>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        {noGL && (
          <div className={styles.fallback} aria-hidden="true">
            <Image src="/brand/raypick-mark-light.svg" alt="" width={420} height={351} unoptimized />
          </div>
        )}
        <div className={styles.vignette} />
        <div className="grain" />
        <div ref={labels} className={styles.labels} aria-hidden="true" />

        {/* scene A — the brand */}
        <div ref={aRef} className={styles.a}>
          <p className={`eyebrow ${styles.fade}`}>
            <i className={styles.dot} />
            {t.hero.eyebrow}
          </p>
          <h1 className={styles.h1}>
            <span className={styles.ln}>
              <span>{t.hero.line1}</span>
            </span>
            <span className={styles.ln}>
              <span className={styles.glow}>{t.hero.line2}</span>
            </span>
          </h1>
          <p className={`${styles.sub} ${styles.fade} ${styles.d1}`}>{t.hero.sub}</p>
          <div className={`${styles.cta} ${styles.fade} ${styles.d2}`}>
            <a className="btn btn-light" href="#apps">
              {t.hero.ctaApps} <span className="arr">→</span>
            </a>
            <a className="btn btn-ghost" href={`mailto:${company.email}`}>
              {t.hero.ctaContact}
            </a>
          </div>
          <div className={`${styles.proof} ${styles.fade} ${styles.d3}`}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <b>{String(liveApps.length).padStart(2, '0')}</b>
                <span>{t.hero.statLive}</span>
              </div>
              <div className={styles.stat}>
                <b>{String(comingApps.length).padStart(2, '0')}</b>
                <span>{t.hero.statComing}</span>
              </div>
              <div className={styles.stat}>
                <b>{t.hero.statInhouseValue}</b>
                <span>{t.hero.statInhouse}</span>
              </div>
            </div>
            <div className={styles.stores}>
              <span className={styles.chip}>
                <GooglePlayIcon size={14} />
                Google Play
              </span>
              <span className={styles.chip}>
                <AppleIcon size={14} />
                App Store
              </span>
            </div>
          </div>
          <div className={styles.cue} aria-hidden="true">
            <i />
            {t.hero.scroll}
          </div>
        </div>

        {/* scene B — the apps in orbit */}
        <div ref={bRef} className={styles.b}>
          {noGL && (
            <div className={styles.iconRow}>
              {apps.map((a) => (
                <button key={a.slug} onClick={() => goToApp(a.slug)} aria-label={a.name[language]}>
                  <Image src={a.icon} alt="" width={72} height={72} />
                  <span>{a.name[language]}</span>
                </button>
              ))}
            </div>
          )}
          <p className="eyebrow">{t.orbit.eyebrow}</p>
          <h2 className={styles.h2}>
            {t.orbit.title1} <em>{t.orbit.title2}</em>
          </h2>
          <p className={styles.subB}>{t.orbit.sub}</p>
          {!noGL && <p className={styles.hint}>{t.orbit.hint}</p>}
        </div>

        <div ref={flashRef} className={styles.flash} aria-hidden="true" />
      </div>
    </section>
  );
}
