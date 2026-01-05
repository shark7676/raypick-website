'use client';

import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import styles from '../app/page.module.css';

export default function ServiceSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.serviceSection}>
            <div className={styles.serviceContent}>
                <h2 className={styles.sectionTitle}>{t.serviceSection.title}<br /><span className={styles.highlight}>{t.serviceSection.highlight}</span></h2>
                <p className={styles.serviceDescription}>
                    {t.serviceSection.desc}
                </p>
                <ul className={styles.serviceList}>
                    {t.serviceSection.list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.serviceVisual}>
                <Image
                    src="/images/studio.png"
                    alt="Production Studio"
                    width={600}
                    height={400}
                    className={styles.serviceImage}
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
        </section>
    );
}
