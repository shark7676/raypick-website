'use client';

import CodeHero from '../components/CodeHero';
import MatrixRain from '../components/MatrixRain';
import AppShowcase from '../components/AppShowcase';
import AboutSection from '../components/AboutSection';
import ServiceSection from '../components/ServiceSection';
import { useLanguage } from '../context/LanguageContext';
import styles from './page.module.css';

export default function Home() {
  const { t, language } = useLanguage();

  const scrollToShowcase = () => {
    const element = document.getElementById('showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroMatrix} aria-hidden="true">
          <MatrixRain />
        </div>
        <div className={styles.heroVeil} aria-hidden="true" />
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroLayout}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>{t.hero.eyebrow}</p>
            <h1 className={`${styles.heroHeadline} ${language === 'en' ? styles.heroHeadlineEn : ''}`}>
              {t.hero.headline} <span className={styles.highlight}>{t.hero.headlineAccent}</span>
            </h1>
            <p className={styles.heroSub}>{t.hero.sub}</p>
            <button className={styles.ctaButton} onClick={scrollToShowcase}>
              {t.hero.cta}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </button>
          </div>
          <div className={styles.heroCode}>
            <CodeHero />
          </div>
        </div>
      </section>

      <div id="showcase">
        <AppShowcase />
      </div>
      <AboutSection />
      <ServiceSection />

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>RAYPICK</span>
            <p className={styles.footerTagline}>{t.footer.tagline}</p>
          </div>
          <div className={styles.footerMeta}>
            <p className={styles.footerDomain}>www.Raypick.co.kr</p>
            <p className={styles.footerText}>{t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
