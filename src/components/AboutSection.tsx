'use client';

import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import styles from '../app/page.module.css';

export default function AboutSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.aboutSection}>
            <div className={styles.aboutContent}>
                <Reveal>
                    <p className={styles.eyebrow}>WHO WE ARE</p>
                    <h2 className={styles.sectionTitle}>
                        {t.about.title} <span className={styles.highlight}>{t.about.highlight}</span>
                    </h2>
                    <p className={styles.aboutIntro}>{t.about.intro}</p>
                </Reveal>

                <div className={styles.aboutGrid}>
                    <Reveal delay={80}>
                        <div className={styles.aboutCard}>
                            <span className={styles.aboutCardLabel}>01</span>
                            <h3 className={styles.aboutCardTitle}>{t.about.vision.title}</h3>
                            <p className={styles.aboutCardDesc}>{t.about.vision.desc}</p>
                        </div>
                    </Reveal>
                    <Reveal delay={200}>
                        <div className={styles.aboutCard}>
                            <span className={styles.aboutCardLabel}>02</span>
                            <h3 className={styles.aboutCardTitle}>{t.about.mission.title}</h3>
                            <p className={styles.aboutCardDesc}>{t.about.mission.desc}</p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
