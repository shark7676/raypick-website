'use client';
'use client';

import { useLanguage } from '../context/LanguageContext';
import styles from '../app/page.module.css';

export default function AppShowcase() {
    const { t } = useLanguage();

    return (
        <section className={styles.showcaseSection}>
            <h2 className={styles.sectionTitle}>{t.appShowcase.title} <span className={styles.highlight}>{t.appShowcase.highlight}</span></h2>
            <div className={styles.appGrid}>

                {/* App 1 */}
                <div className={styles.appCard}>
                    <div className={styles.appImageWrapper}>
                        <img src="/images/app1.png" alt="App 1 Interface" className={styles.appImage} />
                        <img src="/images/app1.png" alt="App 1 Detail" className={`${styles.appImage} ${styles.appImageSecondary}`} />
                    </div>
                    <div className={styles.appInfo}>
                        <div className={styles.appLogoPlaceholder}>App A</div>
                        <h3 className={styles.appName}>{t.appShowcase.app1.name}</h3>
                        <p className={styles.appDescription}>
                            {t.appShowcase.app1.desc}
                        </p>
                    </div>
                </div>

                {/* App 2 */}
                <div className={styles.appCard}>
                    <div className={styles.appImageWrapper}>
                        <img src="/images/app2.png" alt="App 2 Interface" className={styles.appImage} />
                        <img src="/images/app2.png" alt="App 2 Detail" className={`${styles.appImage} ${styles.appImageSecondary}`} />
                    </div>
                    <div className={styles.appInfo}>
                        <div className={styles.appLogoPlaceholder}>App B</div>
                        <h3 className={styles.appName}>{t.appShowcase.app2.name}</h3>
                        <p className={styles.appDescription}>
                            {t.appShowcase.app2.desc}
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
