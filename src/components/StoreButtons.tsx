'use client';

import { AppItem } from '../data/apps';
import { useLanguage } from '../context/LanguageContext';
import { AppleIcon, GooglePlayIcon } from './icons';
import styles from './StoreButtons.module.css';

/** Official store links for one app. Renders nothing for apps that are not out yet. */
export default function StoreButtons({ app, tone = 'dark' }: { app: AppItem; tone?: 'dark' | 'light' }) {
  const { t } = useLanguage();
  const { android, ios } = app.stores;
  if (!android && !ios) return null;

  return (
    <div className={`${styles.row} ${tone === 'light' ? styles.light : ''}`}>
      {android && (
        <a className={styles.btn} href={android} target="_blank" rel="noopener noreferrer">
          <GooglePlayIcon size={20} />
          <span>
            <small>GET IT ON</small>
            {t.store.googlePlay}
          </span>
        </a>
      )}
      {ios && (
        <a className={styles.btn} href={ios} target="_blank" rel="noopener noreferrer">
          <AppleIcon size={20} />
          <span>
            <small>Download on the</small>
            {t.store.appStore}
          </span>
        </a>
      )}
    </div>
  );
}
