'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from 'react';
import { translations, Language } from '../data/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['ko'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// The visitor's choice is remembered in localStorage (memory only if storage is blocked).
let chosen: Language | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
    listeners.add(onChange);
    window.addEventListener('storage', onChange);
    return () => {
        listeners.delete(onChange);
        window.removeEventListener('storage', onChange);
    };
}

function getSnapshot(): Language {
    if (chosen) return chosen;
    try {
        return localStorage.getItem('lang') === 'en' ? 'en' : 'ko';
    } catch {
        return 'ko';
    }
}

const getServerSnapshot = (): Language => 'ko';

function setLanguage(lang: Language) {
    chosen = lang;
    try {
        localStorage.setItem('lang', lang);
    } catch {}
    listeners.forEach((fn) => fn());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = {
        language,
        setLanguage,
        t: translations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
