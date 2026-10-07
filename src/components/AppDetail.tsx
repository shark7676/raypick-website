'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { apps, getApp } from '../data/apps';
import { useLanguage } from '../context/LanguageContext';
import type { PhoneScene } from '../lib/three/phoneScene';
import StoreButtons from './StoreButtons';
import styles from './AppDetail.module.css';

export default function AppDetail({ slug }: { slug: string }) {
  const app = getApp(slug)!;
  const { t, language } = useLanguage();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [noGL, setNoGL] = useState(false);
  const hasPhone = app.screens.length > 0;

  useEffect(() => {
    if (!hasPhone) return;
    let scene: PhoneScene | null = null;
    let disposed = false;
    import('../lib/three/phoneScene')
      .then(({ PhoneScene }) => {
        if (disposed || !canvas.current) return;
        scene = new PhoneScene(canvas.current, [{ screens: app.screens, frame: app.frame }], 'single');
      })
      .catch(() => setNoGL(true));
    return () => {
      disposed = true;
      scene?.dispose();
    };
  }, [app, hasPhone]);

  const live = app.status === 'live';
  const others = apps.filter((a) => a.slug !== app.slug);

  return (
    <main className={`day ${styles.page}`} data-nav="light" style={{ '--tint': app.color } as CSSProperties}>
      <div className={styles.bg} aria-hidden="true" />
      <section className={styles.hero}>
        <div className={styles.info}>
          <Link href="/#apps" className={styles.back}>
            ← {t.appPage.back}
          </Link>
          <div className={styles.nameRow}>
            <Image className={styles.icon} src={app.icon} alt="" width={84} height={84} priority />
            <div>
              <span className={`${styles.badge} ${live ? styles.live : styles.soon}`}>{live ? t.appPage.live : t.appPage.coming}</span>
              <h1 className={styles.name}>{app.name[language]}</h1>
              <p className={styles.genre}>{app.genre[language]}</p>
            </div>
          </div>
          <p className={styles.tagline}>{app.tagline[language]}</p>
          <p className={styles.desc}>{app.description[language]}</p>
          {live ? <StoreButtons app={app} /> : <p className={styles.note}>{t.appPage.comingNote}</p>}
          {app.site && (
            <a className={styles.site} href={app.site} target="_blank" rel="noopener noreferrer">
              {t.appPage.site} ↗
            </a>
          )}
        </div>

        <div className={styles.visual} aria-hidden="true">
          {hasPhone && <canvas ref={canvas} className={styles.canvas} />}
          {hasPhone && noGL && <Image className={styles.still} src={app.screens[0]} alt="" width={600} height={1200} />}
          {!hasPhone && (
            <div className={styles.artStack}>
              {app.art?.map((src, i) => (
                <Image key={src} src={src} alt="" width={360} height={340} sizes="(max-width: 900px) 40vw, 20vw" style={{ '--i': i } as CSSProperties} />
              ))}
            </div>
          )}
        </div>
      </section>

      {app.shots.length > 0 && (
        <section className={styles.shots} aria-label={t.appPage.screenshots}>
          <h2 className={styles.h2}>{t.appPage.screenshots}</h2>
          <div className={styles.strip}>
            {app.shots.map((src, i) => (
              <Image key={src} src={src} alt={`${app.name[language]} ${i + 1}`} width={720} height={app.slug === 'beatray' ? 1440 : 1280} sizes="280px" />
            ))}
          </div>
        </section>
      )}

      {app.slug === 'parrythm' && app.art && (
        <section className={styles.shots}>
          <div className={styles.strip}>
            {app.art.map((src) => (
              <Image key={src} className={styles.artShot} src={src} alt="" width={640} height={853} sizes="340px" />
            ))}
          </div>
        </section>
      )}

      <section className={styles.others}>
        <h2 className={styles.h2}>{t.appPage.others}</h2>
        <div className={styles.otherRow}>
          {others.map((a) => (
            <Link key={a.slug} href={`/apps/${a.slug}`} className={styles.other}>
              <Image src={a.icon} alt="" width={56} height={56} />
              <span>
                <b>{a.name[language]}</b>
                <small>{a.status === 'live' ? t.appPage.live : t.appPage.coming}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
