'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from '../app/page.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          Raypick
        </Link>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
        </button>

        {/* Desktop Menu */}
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

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          text-decoration: none;
          background: linear-gradient(to right, #fff, #aaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #ccc;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .lang-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: bold;
          transition: all 0.2s;
        }

        .lang-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
          position: relative;
          transition: all 0.3s;
        }

        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background: white;
          transition: all 0.3s;
        }

        .hamburger::before { top: -8px; }
        .hamburger::after { top: 8px; }

        .hamburger.open { background: transparent; }
        .hamburger.open::before { top: 0; transform: rotate(45deg); }
        .hamburger.open::after { top: 0; transform: rotate(-45deg); }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: rgba(0, 0, 0, 0.95);
            padding: 2rem;
            gap: 1.5rem;
            text-align: center;
            clip-path: circle(0% at 100% 0);
            transition: clip-path 0.4s ease-in-out;
          }

          .nav-links.active {
            clip-path: circle(150% at 100% 0);
          }
        }
      `}</style>
    </nav>
  );
}
