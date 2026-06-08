'use client';

import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import styles from '../app/page.module.css';

export default function ServiceSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.serviceSection}>
            <Reveal className={styles.serviceContent}>
                <p className={styles.eyebrow}>MEDIA</p>
                <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    {t.serviceSection.title}<br />
                    <span className={styles.highlight}>{t.serviceSection.highlight}</span>
                </h2>
                <p className={styles.serviceDescription}>{t.serviceSection.desc}</p>
                <ul className={styles.serviceList}>
                    {t.serviceSection.list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </Reveal>

            <Reveal className={styles.serviceVisual} delay={120}>
                <div className={styles.serviceImageFrame}>
                    <Image
                        src="/images/studio.png"
                        alt="Production Studio"
                        width={600}
                        height={400}
                        className={styles.serviceImage}
                        quality={90}
                    />
                </div>
            </Reveal>
        </section>
    );
}
