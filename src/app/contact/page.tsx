'use client';

import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/Reveal';
import styles from '../page.module.css';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <main className={styles.mainContainer}>
            <div className={styles.subPage} style={{ maxWidth: '760px' }}>
                <Reveal>
                    <p className={styles.eyebrow}>CONTACT</p>
                    <h1 className={styles.pageTitle}>
                        {t.contact.title} <span className={styles.highlight}>{t.contact.highlight}</span>
                    </h1>
                    <p className={styles.contactDesc}>{t.contact.desc}</p>
                </Reveal>

                <Reveal delay={100}>
                    <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>{t.contact.form.name}</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                placeholder={t.contact.form.placeholderName}
                            />
                        </div>

                        <div className={styles.formField}>
                            <label className={styles.formLabel}>{t.contact.form.email}</label>
                            <input
                                type="email"
                                className={styles.formInput}
                                placeholder={t.contact.form.placeholderEmail}
                            />
                        </div>

                        <div className={styles.formField}>
                            <label className={styles.formLabel}>{t.contact.form.message}</label>
                            <textarea
                                rows={6}
                                className={styles.formInput}
                                style={{ resize: 'vertical' }}
                                placeholder={t.contact.form.placeholderMessage}
                            />
                        </div>

                        <button type="submit" className={styles.ctaButton} style={{ width: '100%', justifyContent: 'center' }}>
                            {t.contact.form.submit}
                        </button>
                    </form>
                </Reveal>

                <Reveal delay={160}>
                    <div className={styles.contactInfo}>
                        <p>{t.contact.info.email}</p>
                        <p>{t.contact.info.address}</p>
                    </div>
                </Reveal>
            </div>
        </main>
    );
}
