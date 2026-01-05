'use client';

import { useLanguage } from '../../context/LanguageContext';
import styles from '../page.module.css';

export default function Services() {
    const { t } = useLanguage();

    return (
        <main className={styles.mainContainer}>
            <div style={{ padding: '8rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 className={styles.title} style={{ textAlign: 'center' }}>{t.services.title} <span className={styles.highlight}>{t.services.highlight}</span></h1>

                {/* App Development */}
                <section style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', display: 'inline-block' }}>{t.services.appDev.title}</h2>
                    <p className={styles.description}>
                        {t.services.appDev.desc}
                    </p>
                    <ul className={styles.serviceList} style={{ marginTop: '2rem' }}>
                        {t.services.appDev.list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                {/* YouTube Production */}
                <section>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', display: 'inline-block' }}>{t.services.youtube.title}</h2>
                    <p className={styles.description}>
                        {t.services.youtube.desc}
                    </p>
                    <ul className={styles.serviceList} style={{ marginTop: '2rem' }}>
                        {t.services.youtube.list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
