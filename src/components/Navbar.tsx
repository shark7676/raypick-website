'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          RAYPICK
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
        </button>

        {/* Menu */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>{t.nav.home}</Link>
          <Link href="/about" className="nav-link" onClick={() => setIsOpen(false)}>{t.nav.about}</Link>
          <Link href="/services" className="nav-link" onClick={() => setIsOpen(false)}>{t.nav.services}</Link>
          <Link href="/contact" className="nav-link" onClick={() => setIsOpen(false)}>{t.nav.contact}</Link>

          <button className="lang-btn" onClick={toggleLanguage}>
            {language === 'ko' ? 'EN' : 'KR'}
          </button>
        </div>
      </div>
    </nav>
  );
}
