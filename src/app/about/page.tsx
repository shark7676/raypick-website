'use client';

import AboutSection from '../../components/AboutSection';
import styles from '../page.module.css';

export default function About() {
    return (
        <main className={styles.mainContainer}>
            <div className={styles.pageTopPad}>
                <AboutSection />
            </div>
        </main>
    );
}
