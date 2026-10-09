'use client';

import Image from 'next/image';
import { useState } from 'react';
import { company } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import Phrases from './Phrases';
import Reveal from './Reveal';
import styles from './Sections.module.css';

export default function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(company.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${company.email}`;
    }
  };

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.contactGlow} aria-hidden="true" />
      <Image className={styles.contactMark} src="/brand/raypick-mark-light.svg" alt="" width={760} height={636} unoptimized aria-hidden="true" />
      <div className="grain" />
      <Reveal className={styles.contactInner}>
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2 id="contact-title" className={styles.contactTitle}>
          {t.contact.title1} <em>{t.contact.title2}</em>
        </h2>
        <p className={styles.contactSub}>
          <Phrases text={t.contact.sub} />
        </p>
        <a className={styles.mail} href={`mailto:${company.email}`}>
          {company.email}
        </a>
        <div className={styles.contactCta}>
          <a className="btn btn-light" href={`mailto:${company.email}`}>
            {t.contact.button} <span className="arr">→</span>
          </a>
          <button className="btn btn-ghost" onClick={copy} aria-live="polite">
            {copied ? t.contact.copied : t.contact.copy}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
