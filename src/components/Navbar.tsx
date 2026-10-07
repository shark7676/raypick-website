'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { scrollHome } from '../lib/scrollHome';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // switch to dark text while a light section sits under the bar
      const y = 36;
      const onLight = Array.from(document.querySelectorAll<HTMLElement>('[data-nav="light"]')).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setLight(onLight);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const close = () => setOpen(false);
  const toggleLang = () => setLanguage(language === 'ko' ? 'en' : 'ko');
  const links = [
    { href: '/#apps', label: t.nav.apps },
    { href: '/#company', label: t.nav.company },
    { href: '/#contact', label: t.nav.contact },
  ];

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${light && !open ? styles.light : ''} ${open ? styles.isOpen : ''}`}>
      <Link
        href="/"
        className={styles.brand}
        onClick={(e) => {
          close();
          scrollHome(e, pathname);
        }}
        aria-label="Raypick"
      >
        <Image className={styles.mark} src={light && !open ? '/brand/raypick-mark.svg' : '/brand/raypick-mark-light.svg'} alt="" width={31} height={26} unoptimized priority />
        <Image className={styles.word} src={light && !open ? '/brand/wordmark-navy.png' : '/brand/wordmark-light.png'} alt="RAYPICK" width={100} height={13} unoptimized priority />
      </Link>

      <nav className={`${styles.menu} ${open ? styles.open : ''}`} aria-label="Main">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={styles.link} onClick={close}>
            {l.label}
          </Link>
        ))}
        <button className={styles.lang} onClick={toggleLang} aria-label={`KO / EN — ${t.nav.lang}`}>
          <span className={language === 'ko' ? styles.on : ''}>KO</span>
          <i>/</i>
          <span className={language === 'en' ? styles.on : ''}>EN</span>
        </button>
      </nav>

      <button className={`${styles.burger} ${open ? styles.x : ''}`} onClick={() => setOpen(!open)} aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open}>
        <span />
        <span />
      </button>
    </header>
  );
}
