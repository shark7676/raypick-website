'use client';

import { useLanguage } from '../../context/LanguageContext';
import styles from '../page.module.css';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <main className={styles.mainContainer}>
            <div style={{ padding: '8rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h1 className={styles.title} style={{ textAlign: 'center' }}>{t.contact.title} <span className={styles.highlight}>{t.contact.highlight}</span></h1>
                <p className={styles.description} style={{ textAlign: 'center', margin: '0 auto 4rem auto' }}>
                    {t.contact.desc}
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <label style={{ color: '#fff', fontWeight: 'bold' }}>{t.contact.form.name}</label>
                        <input type="text" placeholder={t.contact.form.placeholderName} style={{
                            padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)', color: 'white'
                        }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <label style={{ color: '#fff', fontWeight: 'bold' }}>{t.contact.form.email}</label>
                        <input type="email" placeholder={t.contact.form.placeholderEmail} style={{
                            padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)', color: 'white'
                        }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <label style={{ color: '#fff', fontWeight: 'bold' }}>{t.contact.form.message}</label>
                        <textarea rows={6} placeholder={t.contact.form.placeholderMessage} style={{
                            padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical'
                        }}></textarea>
                    </div>

                    <button type="button" className={styles.ctaButton} style={{ marginTop: '1rem', width: '100%' }}>
                        {t.contact.form.submit}
                    </button>
                </form>

                <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    <p style={{ color: '#888', marginBottom: '0.5rem' }}>{t.contact.info.email}</p>
                    <p style={{ color: '#888' }}>{t.contact.info.tel}</p>
                    <p style={{ color: '#888' }}>{t.contact.info.address}</p>
                </div>
            </div>
        </main>
    );
}
