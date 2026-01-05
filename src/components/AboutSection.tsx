'use client';

import { useLanguage } from '../context/LanguageContext';
import styles from '../app/page.module.css';

export default function AboutSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.aboutSection}>
            <div className={styles.aboutContent}>
                <h2 className={styles.sectionTitle}>
                    {t.about.title} <span className={styles.highlight}>{t.about.highlight}</span>
                </h2>
                <p className={styles.aboutIntro}>
                    {t.about.intro}
                </p>

                <div className={styles.aboutGrid}>
                    <div className={styles.aboutCard}>
                        <h3 className={styles.aboutCardTitle}>{t.about.vision.title}</h3>
                        <p className={styles.aboutCardDesc}>{t.about.vision.desc}</p>
                    </div>
                    <div className={styles.aboutCard}>
                        <h3 className={styles.aboutCardTitle}>{t.about.mission.title}</h3>
                        <p className={styles.aboutCardDesc}>{t.about.mission.desc}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
