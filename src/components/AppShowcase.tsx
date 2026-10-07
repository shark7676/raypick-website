'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { liveApps } from '../data/apps';
import { useLanguage } from '../context/LanguageContext';
import type { PhoneScene } from '../lib/three/phoneScene';
import StoreButtons from './StoreButtons';
import styles from './AppShowcase.module.css';

export default function AppShowcase() {
  const { t, language } = useLanguage();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<PhoneScene | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [noGL, setNoGL] = useState(false);

  // create the 3D phones when the section gets close, pause when it leaves
  useEffect(() => {
    let disposed = false;
    let loading = false;
    let visible = false;
    // build the phones well before the section arrives (while the orbit is on screen) ...
    const prepare = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || scene.current || loading) return;
        loading = true;
        import('../lib/three/phoneScene')
          .then(({ PhoneScene }) => {
            if (disposed || !canvas.current) return;
            scene.current = new PhoneScene(canvas.current, liveApps.map((a) => ({ screens: a.screens, frame: a.frame })));
            scene.current.setActive(activeRef.current); // the visitor may already be past the first app
            scene.current.setRunning(visible);
          })
          .catch(() => setNoGL(true));
      },
      { rootMargin: '1800px 0px' },
    );
    // ... but only draw them while they can be seen
    const show = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        scene.current?.setRunning(visible);
      },
      { rootMargin: '200px 0px' },
    );
    if (section.current) {
      prepare.observe(section.current);
      show.observe(section.current);
    }
    return () => {
      disposed = true;
      prepare.disconnect();
      show.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  // which app panel is in the middle of the screen
  useEffect(() => {
    const panels = Array.from(section.current?.querySelectorAll<HTMLElement>('[data-index]') ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    activeRef.current = active;
    scene.current?.setActive(active);
  }, [active]);

  const app = liveApps[active];

  return (
    <section ref={section} id="apps" className={`day ${styles.section}`} data-nav="light" style={{ '--tint': app.color } as CSSProperties}>
      <div className={styles.bg} aria-hidden="true" />
      <header className={styles.head}>
        <p className="eyebrow">
          <i className={styles.live} />
          {t.showcase.eyebrow}
        </p>
        <h2 className={styles.title}>{t.showcase.title}</h2>
      </header>

      <div className={styles.body}>
        <div className={styles.stage} aria-hidden="true">
          <canvas ref={canvas} className={styles.canvas} />
          {noGL && <Image className={styles.still} src={app.screens[0]} alt="" width={600} height={1200} />}
          <div className={styles.dots}>
            {liveApps.map((a, i) => (
              <span key={a.slug} className={i === active ? styles.on : ''} />
            ))}
          </div>
        </div>

        <div className={styles.panels}>
          {liveApps.map((a, i) => (
            <article key={a.slug} id={`app-${a.slug}`} data-index={i} className={`${styles.panel} ${i === active ? styles.current : ''}`}>
              <div className={styles.card}>
                <p className={styles.meta}>
                  <span>
                    {String(i + 1).padStart(2, '0')} / {String(liveApps.length).padStart(2, '0')}
                  </span>
                  {a.genre[language]}
                </p>
                <div className={styles.nameRow}>
                  <Image className={styles.icon} src={a.icon} alt="" width={64} height={64} />
                  <h3 className={styles.name}>{a.name[language]}</h3>
                </div>
                <p className={styles.tagline}>{a.tagline[language]}</p>
                <p className={styles.desc}>{a.description[language]}</p>
                <StoreButtons app={a} />
                <div className={styles.links}>
                  <Link href={`/apps/${a.slug}`} className={styles.more}>
                    {t.showcase.more} <span>→</span>
                  </Link>
                  {a.site && (
                    <a href={a.site} target="_blank" rel="noopener noreferrer" className={styles.site}>
                      {t.showcase.site} ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
