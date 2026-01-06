'use client';

import Image from 'next/image';
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
                        <Image src="/images/jikgwang/screenshot1.jpg" alt="Jikgwang Main" className={styles.appImage} width={300} height={600} quality={90} />
                        <Image src="/images/jikgwang/screenshot2.jpg" alt="Jikgwang Detail" className={`${styles.appImage} ${styles.appImageSecondary}`} width={300} height={600} quality={90} />
                    </div>
                    <div className={styles.appInfo}>
                        <Image src="/images/jikgwang/logo.png" alt="Jikgwang Logo" width={80} height={80} style={{ height: 'auto', marginBottom: '1rem' }} quality={90} />
                        <h3 className={styles.appName}>직광 (Jikgwang)</h3>
                        <p className={styles.appDescription}>
                            소상공인, 중소기업 제품, 농어촌 직거래, 개인 행사 및 이벤트를 직접 등록하세요.<br />
                            크리에이터가 원하는 홍보를 직접 선택하여 지원하는<br />
                            <strong>광고/홍보 연결 플랫폼</strong>입니다.
                        </p>
                    </div>
                </div>

                {/* App 2: Cosync */}
                <div className={styles.appCard}>
                    <div className={styles.appImageWrapper}>
                        <Image src="/images/cosync/screenshot1.jpg" alt="Cosync Main" className={styles.appImage} width={300} height={600} quality={90} />
                        <Image src="/images/cosync/screenshot2.jpg" alt="Cosync Detail" className={styles.appImage} width={300} height={600} quality={90} />
                    </div>
                    <div className={styles.appInfo}>
                        <Image src="/images/cosync/logo.png" alt="Cosync Logo" width={80} height={80} style={{ height: 'auto', marginBottom: '1rem', borderRadius: '20px' }} quality={90} />
                        <h3 className={styles.appName}>Cosync</h3>
                        <p className={styles.appDescription}>
                            NASA의 실시간 우주 데이터를 기반으로 점성술과<br />
                            동양의 명리학, 오행을 융합하여 분석합니다.<br />
                            당신의 <strong>출생 기운과 현재의 기운</strong>을 설명해주는 앱입니다.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
