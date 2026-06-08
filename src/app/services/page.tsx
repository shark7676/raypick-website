'use client';

import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/Reveal';
import styles from '../page.module.css';

export default function Services() {
    const { t } = useLanguage();

    const pillars = [
        { num: '01', data: t.services.appDev },
        { num: '02', data: t.services.youtube },
    ];

    return (
        <main className={styles.mainContainer}>
            <div className={styles.subPage}>
                <Reveal>
                    <p className={styles.eyebrow}>SERVICES</p>
                    <h1 className={styles.pageTitle}>
                        {t.services.title} <span className={styles.highlight}>{t.services.highlight}</span>
                    </h1>
                </Reveal>

                <div className={styles.pillarGrid}>
                    {pillars.map((pillar, i) => (
                        <Reveal key={pillar.num} delay={i * 120}>
                            <section className={styles.pillarCard}>
                                <span className={styles.pillarNum}>{pillar.num}</span>
                                <h2 className={styles.pillarTitle}>{pillar.data.title}</h2>
                                <p className={styles.pillarDesc}>{pillar.data.desc}</p>
                                <ul className={styles.serviceList}>
                                    {pillar.data.list.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </section>
                        </Reveal>
                    ))}
                </div>
            </div>
        </main>
    );
}
