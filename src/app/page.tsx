'use client';

import ThreeRobot from '../components/ThreeRobot';
import AppShowcase from '../components/AppShowcase';
import AboutSection from '../components/AboutSection';
import ServiceSection from '../components/ServiceSection';
import { useLanguage } from '../context/LanguageContext';
import styles from './page.module.css';

export default function Home() {
  const { t } = useLanguage();

  const scrollToShowcase = () => {
    const element = document.getElementById('showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t.hero.title} <br /> <span className={styles.highlight}>{t.hero.subtitle}</span></h1>
          <p className={styles.description}>
            {t.hero.description}
          </p>
          <button className={styles.ctaButton} onClick={scrollToShowcase}>{t.hero.cta}</button>
        </div>
        <div className={styles.heroVisual}>
          <ThreeRobot />
        </div>
      </section>

      <div id="showcase">
        <AppShowcase />
      </div>
      <AboutSection />
      <ServiceSection />

      <footer className={styles.footer}>
        <p className={styles.footerText}>{t.footer.rights}</p>
        <p className={styles.footerDomain}>www.Raypick.co.kr</p>
      </footer>
    </main>
  );
}
