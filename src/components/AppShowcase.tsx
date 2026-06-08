'use client';

import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { apps } from '../data/apps';
import Reveal from './Reveal';
import styles from '../app/page.module.css';

export default function AppShowcase() {
    const { t, language } = useLanguage();

    return (
        <section className={styles.showcaseSection}>
            <Reveal>
                <p className={styles.eyebrow}>PORTFOLIO</p>
                <h2 className={styles.sectionTitle}>
                    {t.appShowcase.title} <span className={styles.highlight}>{t.appShowcase.highlight}</span>
                </h2>
                <p className={styles.sectionSubtitle}>{t.appShowcase.subtitle}</p>
            </Reveal>

            <div className={styles.appGrid}>
                {apps.map((app, index) => (
                    <Reveal key={app.slug} delay={index * 120}>
                        <article className={styles.appCard}>
                            <div className={styles.appImageWrapper}>
                                <span
                                    className={`${styles.statusBadge} ${app.status === 'live' ? styles.badgeLive : styles.badgeComing}`}
                                >
                                    {app.status === 'live' ? t.appShowcase.live : t.appShowcase.comingSoon}
                                </span>
                                <Image
                                    src={app.images[0]}
                                    alt={`${app.name[language]} screen 1`}
                                    className={styles.appImage}
                                    width={300}
                                    height={600}
                                    quality={90}
                                    unoptimized={app.demo}
                                />
                                <Image
                                    src={app.images[1]}
                                    alt={`${app.name[language]} screen 2`}
                                    className={`${styles.appImage} ${styles.appImageSecondary}`}
                                    width={300}
                                    height={600}
                                    quality={90}
                                    unoptimized={app.demo}
                                />
                            </div>
                            <div className={styles.appInfo}>
                                <Image
                                    src={app.logo}
                                    alt={`${app.name[language]} logo`}
                                    width={56}
                                    height={56}
                                    className={styles.appLogo}
                                    style={app.roundedLogo ? { borderRadius: '14px' } : undefined}
                                    quality={90}
                                    unoptimized={app.demo}
                                />
                                <h3 className={styles.appName}>{app.name[language]}</h3>
                                <p className={styles.appTagline}>{app.tagline[language]}</p>
                                <p className={styles.appDescription}>{app.description[language]}</p>
                            </div>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
