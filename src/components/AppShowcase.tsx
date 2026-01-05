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

                {/* App 1: Jikgwang */}
                <div className={styles.appCard}>
                    <div className={styles.appImageWrapper}>
                        <img src="/images/jikgwang/screenshot1.jpg" alt="Jikgwang Main" className={styles.appImage} />
                        <img src="/images/jikgwang/screenshot2.jpg" alt="Jikgwang Detail" className={`${styles.appImage} ${styles.appImageSecondary}`} />
                    </div>
                    <div className={styles.appInfo}>
                        <img src="/images/jikgwang/logo.png" alt="Jikgwang Logo" style={{ width: '80px', height: 'auto', marginBottom: '1rem' }} />
                        <h3 className={styles.appName}>직광 (Jikgwang)</h3>
                        <p className={styles.appDescription}>
                            소상공인, 중소기업 제품, 농어촌 직거래, 개인 행사 및 이벤트를 직접 등록하세요.<br />
                            크리에이터가 원하는 홍보를 직접 선택하여 지원하는<br />
                            <strong>광고/홍보 연결 플랫폼</strong>입니다.
                        </p>
                    </div>
                </div>

                {/* App 2: Coming Soon or Placeholder */}
                <div className={styles.appCard} style={{ opacity: 0.5 }}>
                    <div className={styles.appImageWrapper}>
                        <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                            Computing...
                        </div>
                    </div>
                    <div className={styles.appInfo}>
                        <div className={styles.appLogoPlaceholder}>?</div>
                        <h3 className={styles.appName}>Coming Soon</h3>
                        <p className={styles.appDescription}>
                            Next innovation loading...
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
