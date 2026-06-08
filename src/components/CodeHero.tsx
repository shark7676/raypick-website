'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type TokType = 'kw' | 'str' | 'cm' | 'fn' | 'num' | 'id' | 'pl';
type Token = { t: string; c: TokType };

// Universal code snippet (themed to Raypick). Comments stay short & language-neutral-ish.
const LINES: Token[][] = [
    [{ t: 'import', c: 'kw' }, { t: ' { createApp } ', c: 'pl' }, { t: 'from', c: 'kw' }, { t: " 'raypick'", c: 'str' }],
    [],
    [{ t: '// Raypick AI — building the future', c: 'cm' }],
    [{ t: 'const', c: 'kw' }, { t: ' app ', c: 'id' }, { t: '= ', c: 'pl' }, { t: 'createApp', c: 'fn' }, { t: '({', c: 'pl' }],
    [{ t: '  name: ', c: 'pl' }, { t: "'다광'", c: 'str' }, { t: ',', c: 'pl' }],
    [{ t: '  kind: ', c: 'pl' }, { t: "'media'", c: 'str' }, { t: ',', c: 'pl' }],
    [{ t: '  ai: ', c: 'pl' }, { t: 'true', c: 'num' }, { t: ',', c: 'pl' }],
    [{ t: '})', c: 'pl' }],
    [],
    [{ t: 'export default async', c: 'kw' }, { t: ' () => {', c: 'pl' }],
    [{ t: '  await', c: 'kw' }, { t: ' app.', c: 'pl' }, { t: 'render', c: 'fn' }, { t: '()', c: 'pl' }],
    [{ t: '  return', c: 'kw' }, { t: ' <', c: 'pl' }, { t: 'Future', c: 'fn' }, { t: ' />', c: 'pl' }],
    [{ t: '}', c: 'pl' }],
];

const LINE_STR = LINES.map((line) => line.map((t) => t.t).join(''));

const SPEED = 26;
const LINE_PAUSE = 300;
const LOOP_PAUSE = 2400;

function renderTokens(tokens: Token[], visible: number) {
    let remaining = visible;
    return tokens.map((tok, i) => {
        if (remaining <= 0) return null;
        const slice = tok.t.slice(0, remaining);
        remaining -= tok.t.length;
        return (
            <span key={i} className={tok.c}>
                {slice}
            </span>
        );
    });
}

export default function CodeHero() {
    const { t } = useLanguage();
    const steps = t.hero.code.steps;

    const [line, setLine] = useState(0);
    const [char, setChar] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reduced =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (reduced) {
            // One-time sync to the user's motion preference (render full code, no typing)
            /* eslint-disable-next-line react-hooks/set-state-in-effect */
            setLine(LINES.length);
            return;
        }

        let l = 0;
        let c = 0;
        let timer: ReturnType<typeof setTimeout>;
        let running = false;

        const tick = () => {
            if (l >= LINES.length) {
                timer = setTimeout(() => {
                    l = 0;
                    c = 0;
                    setLine(0);
                    setChar(0);
                    timer = setTimeout(tick, 250);
                }, LOOP_PAUSE);
                return;
            }
            const len = LINE_STR[l].length;
            if (c < len) {
                c += 1;
                setChar(c);
                timer = setTimeout(tick, SPEED + Math.random() * 34);
            } else {
                l += 1;
                c = 0;
                setLine(l);
                setChar(0);
                timer = setTimeout(tick, len === 0 ? 70 : LINE_PAUSE);
            }
        };

        const start = () => {
            if (running) return;
            running = true;
            timer = setTimeout(tick, 450);
        };
        const stop = () => {
            running = false;
            clearTimeout(timer);
        };

        // Only type while the editor is on screen (saves CPU/battery on mobile)
        const el = wrapRef.current;
        let io: IntersectionObserver | null = null;
        if (el) {
            io = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !document.hidden) start();
                    else stop();
                },
                { threshold: 0 }
            );
            io.observe(el);
        } else {
            start();
        }

        const onVisibility = () => {
            if (document.hidden) stop();
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            stop();
            io?.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    // Keep newest line in view
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    });

    const done = line >= LINES.length;
    const progress = line / LINES.length;
    const activeStep = Math.min(steps.length - 1, Math.floor(progress * steps.length));

    const visibleLines = Math.min(line, LINES.length - 1);

    return (
        <div className="wrap" ref={wrapRef}>
            <div className="editor">
                <div className="titlebar">
                    <span className="dots">
                        <i style={{ background: '#e7cd97' }} />
                        <i style={{ background: '#c7ccd6' }} />
                        <i style={{ background: '#5a5e66' }} />
                    </span>
                    <span className="file">{t.hero.code.file}</span>
                    <span className="lang">TSX</span>
                </div>

                <div className="codeArea" ref={scrollRef}>
                    {LINES.map((tokens, i) => {
                        if (i > line) return null;
                        const isCurrent = i === line && !done;
                        const visible = isCurrent ? char : Infinity;
                        return (
                            <div className="row" key={i}>
                                <span className="ln">{i + 1}</span>
                                <code className="src">
                                    {renderTokens(tokens, visible)}
                                    {(isCurrent || (done && i === LINES.length - 1)) && (
                                        <span className="caret" />
                                    )}
                                </code>
                            </div>
                        );
                    })}
                </div>

                <div className="statusbar">
                    <span className="status">
                        <span className="pulse" />
                        RAYPICK AI · {t.hero.code.status}
                    </span>
                    <span className="loc">{visibleLines + 1} / {LINES.length}</span>
                </div>
            </div>

            {/* AI work panel */}
            <div className="ai">
                <p className="aiTitle">AI PIPELINE</p>
                <ul className="steps">
                    {steps.map((s, i) => {
                        const state = done || i < activeStep ? 'done' : i === activeStep ? 'active' : 'idle';
                        return (
                            <li key={i} className={`step ${state}`}>
                                <span className="ic">
                                    {state === 'done' ? '✓' : state === 'active' ? <span className="spin" /> : ''}
                                </span>
                                {s}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <style jsx>{`
                .wrap {
                    position: relative;
                    width: 100%;
                    max-width: 560px;
                    margin-left: auto;
                    perspective: 1400px;
                }

                .editor {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    background: rgba(18, 18, 22, 0.72);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--line-strong);
                    box-shadow:
                        0 40px 90px rgba(0, 0, 0, 0.55),
                        0 0 0 1px rgba(201, 168, 106, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
                    transform: rotateY(-7deg) rotateX(3deg);
                    transform-origin: center right;
                }

                .titlebar {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.85rem 1.1rem;
                    border-bottom: 1px solid var(--line);
                    background: rgba(255, 255, 255, 0.02);
                }
                .dots {
                    display: inline-flex;
                    gap: 0.4rem;
                }
                .dots i {
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    display: block;
                }
                .file {
                    font-family: var(--font-body);
                    font-size: 0.82rem;
                    color: var(--silver);
                    letter-spacing: 0.01em;
                }
                .lang {
                    margin-left: auto;
                    font-family: var(--font-display);
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    color: var(--gold);
                    border: 1px solid rgba(201, 168, 106, 0.35);
                    border-radius: 5px;
                    padding: 0.15rem 0.45rem;
                }

                .codeArea {
                    height: 300px;
                    overflow: hidden;
                    padding: 1.1rem 1.2rem;
                    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
                    font-size: 0.86rem;
                    line-height: 1.7;
                    scroll-behavior: smooth;
                }
                .row {
                    display: flex;
                    gap: 1rem;
                    white-space: pre;
                }
                .ln {
                    color: #4c4f57;
                    user-select: none;
                    width: 1.4rem;
                    text-align: right;
                    flex-shrink: 0;
                }
                .src {
                    font-family: inherit;
                    white-space: pre;
                }

                .kw { color: #e7cd97; }
                .fn { color: #f4f5f7; font-weight: 600; }
                .str { color: #c7ccd6; }
                .num { color: #d8b87a; }
                .cm { color: #5f636b; font-style: italic; }
                .id { color: #ededf0; }
                .pl { color: #9aa0aa; }

                .caret {
                    display: inline-block;
                    width: 8px;
                    height: 1.05em;
                    margin-left: 1px;
                    background: var(--gold-bright);
                    vertical-align: text-bottom;
                    animation: blink 1.05s step-end infinite;
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }

                .statusbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.6rem 1.1rem;
                    border-top: 1px solid var(--line);
                    background: rgba(201, 168, 106, 0.05);
                    font-size: 0.74rem;
                }
                .status {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--gold-bright);
                    font-family: var(--font-display);
                    font-weight: 700;
                    letter-spacing: 0.04em;
                }
                .pulse {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: var(--gold-bright);
                    box-shadow: 0 0 0 0 rgba(231, 205, 151, 0.6);
                    animation: pulse 1.6s ease-out infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(231, 205, 151, 0.55); }
                    70% { box-shadow: 0 0 0 7px rgba(231, 205, 151, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(231, 205, 151, 0); }
                }
                .loc {
                    color: var(--muted);
                    font-family: ui-monospace, monospace;
                }

                /* AI pipeline panel */
                .ai {
                    position: absolute;
                    left: -2.5rem;
                    bottom: -2rem;
                    width: 230px;
                    padding: 1.1rem 1.2rem;
                    border-radius: 14px;
                    background: rgba(14, 14, 17, 0.86);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid var(--line-strong);
                    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
                }
                .aiTitle {
                    font-family: var(--font-display);
                    font-size: 0.66rem;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    color: var(--gold);
                    margin-bottom: 0.85rem;
                }
                .steps {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .step {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-size: 0.82rem;
                    color: var(--muted);
                    transition: color 0.3s;
                }
                .step.active { color: var(--foreground); }
                .step.done { color: var(--silver); }
                .ic {
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    color: var(--gold-bright);
                }
                .step.idle .ic {
                    border: 1px solid var(--line-strong);
                    border-radius: 50%;
                }
                .spin {
                    width: 13px;
                    height: 13px;
                    border-radius: 50%;
                    border: 2px solid rgba(231, 205, 151, 0.25);
                    border-top-color: var(--gold-bright);
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 900px) {
                    .editor {
                        transform: none;
                    }
                    .wrap {
                        max-width: 100%;
                        margin-left: 0;
                    }
                    .ai {
                        position: static;
                        width: 100%;
                        margin-top: 1.25rem;
                    }
                    .steps {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.6rem 1rem;
                    }
                    .codeArea {
                        height: 240px;
                        font-size: 0.8rem;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .caret,
                    .pulse,
                    .spin {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}
