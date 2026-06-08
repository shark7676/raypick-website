'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    /** Stagger delay in ms */
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Fade-up on scroll into view (IntersectionObserver).
 * Honors prefers-reduced-motion via the .reveal CSS rule in globals.css.
 */
export default function Reveal({
    children,
    delay = 0,
    className = '',
    style,
}: RevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
            style={{ transitionDelay: `${delay}ms`, ...style }}
        >
            {children}
        </div>
    );
}
