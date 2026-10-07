'use client';

import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import styles from './Sections.module.css';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="company" className={`day ${styles.about}`} data-nav="light" aria-labelledby="about-title">
      <div className={styles.aboutGrid}>
        <Reveal>
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2 id="about-title" className={styles.h2}>
            {t.about.title1}
            <br />
            <span className={styles.accent}>{t.about.title2}</span>
          </h2>
        </Reveal>
        <div>
          <Reveal delay={100}>
            <p className={styles.aboutBody}>{t.about.body}</p>
          </Reveal>
          <ol className={styles.pillars}>
            {t.about.pillars.map((p, i) => (
              <li key={p.k}>
                <Reveal delay={180 + i * 100} className={styles.pillar}>
                  <span>{p.k}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
