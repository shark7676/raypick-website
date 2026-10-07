'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PointerEvent } from 'react';
import { comingApps } from '../data/apps';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import styles from './Sections.module.css';

/** tilt a card toward the pointer */
function tilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height) - 0.5) * -8}deg`);
  el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 10}deg`);
  el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}
function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

export default function Upcoming() {
  const { t, language } = useLanguage();

  return (
    <section className={`day ${styles.upcoming}`} data-nav="light" aria-labelledby="upcoming-title">
      <Reveal className={styles.head}>
        <p className="eyebrow">
          <i className={styles.soonDot} />
          {t.upcoming.eyebrow}
        </p>
        <h2 id="upcoming-title" className={styles.h2}>
          {t.upcoming.title}
        </h2>
        <p className={styles.lead}>{t.upcoming.sub}</p>
      </Reveal>

      <div className={styles.soonGrid}>
        {comingApps.map((a, i) => (
          <Reveal key={a.slug} delay={i * 120}>
            <article id={`soon-${a.slug}`} className={`${styles.soon} ${styles[`soon_${a.slug}`] ?? ''}`} onPointerMove={tilt} onPointerLeave={untilt}>
              <div className={styles.soonArt} aria-hidden="true">
                {a.slug === 'parrythm' && (
                  <>
                    <Image className={styles.pStage} src="/apps/parrythm/art-stage.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
                    <Image className={styles.pChar} src="/apps/parrythm/art-riff.webp" alt="" width={640} height={853} sizes="(max-width: 900px) 60vw, 30vw" />
                  </>
                )}
                {a.slug === 'haruyo' &&
                  a.art?.map((src, k) => <Image key={src} className={`${styles.hArt} ${styles[`hA${k}`]}`} src={src} alt="" width={360} height={340} sizes="(max-width: 900px) 26vw, 13vw" />)}
              </div>
              <div className={styles.soonBody}>
                <span className={styles.badge}>{t.upcoming.badge}</span>
                <div className={styles.soonName}>
                  <Image src={a.icon} alt="" width={56} height={56} />
                  <div>
                    <h3>{a.name[language]}</h3>
                    <p>{a.genre[language]}</p>
                  </div>
                </div>
                <p className={styles.soonTag}>{a.tagline[language]}</p>
                <p className={styles.soonDesc}>{a.description[language]}</p>
                <div className={styles.soonLinks}>
                  <Link href={`/apps/${a.slug}`}>
                    {t.showcase.more} <span>→</span>
                  </Link>
                  {a.site && (
                    <a href={a.site} target="_blank" rel="noopener noreferrer">
                      {t.upcoming.site} ↗
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.shine} aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
