'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apps } from '../data/apps';
import { company } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { scrollHome } from '../lib/scrollHome';
import styles from './Sections.module.css';

export default function Footer() {
  const { t, language } = useLanguage();
  const f = t.footer;
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <Link href="/" className={styles.footBrand} onClick={(e) => scrollHome(e, pathname)} aria-label="Raypick">
          <Image src="/brand/raypick-mark-light.svg" alt="" width={29} height={24} unoptimized />
          <Image src="/brand/wordmark-light.png" alt="RAYPICK" width={93} height={12} unoptimized />
        </Link>
        <nav className={styles.footNav} aria-label="Apps">
          {apps.map((a) => (
            <Link key={a.slug} href={`/apps/${a.slug}`}>
              {a.name[language]}
            </Link>
          ))}
        </nav>
      </div>
      <dl className={styles.footInfo}>
        <div>
          <dt className="sr-only">{f.company}</dt>
          <dd>
            <b>{f.company}</b>
          </dd>
        </div>
        <div>
          <dt>{f.ceoLabel}</dt>
          <dd>{f.ceo}</dd>
        </div>
        <div>
          <dt>{f.bizLabel}</dt>
          <dd>{company.bizNumber}</dd>
        </div>
        <div>
          <dt>{f.addressLabel}</dt>
          <dd>{f.address}</dd>
        </div>
        <div>
          <dt>{f.emailLabel}</dt>
          <dd>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </dd>
        </div>
      </dl>
      <p className={styles.rights}>{f.rights}</p>
    </footer>
  );
}
