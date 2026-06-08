'use client';

import { useEffect, useRef } from 'react';

/**
 * Background of horizontal code lines scrolling UPWARD in rich green.
 * Kept subtle (low opacity + veil over it) so it reads as ambient texture.
 */
const SNIPPETS = [
    "import { createApp } from 'raypick'",
    'const app = createApp({ ai: true })',
    'export async function render(scene) {',
    "  const model = await ai.load('raypick-1')",
    '  return model.generate(scene)',
    '}',
    '',
    '// Raypick AI · building the future',
    'const [data, setData] = useState(null)',
    'await pipeline.run({ input, model })',
    'if (app.ready) await app.deploy()',
    'return <Future state={data} />',
    "stream.on('token', (t) => render(t))",
    'npm run build && next start',
    'app.use(media.pipeline())',
    "const apps = ['다광', 'pixory', '다보자']",
    'for (const a of apps) registry.add(a)',
    'export default function App() {',
    '  return <Raypick />',
    '}',
    '',
];

// Glyphs used for the subtle "glitch" flicker
const GLYPHS = 'アイウエオカキクケコサシスセソタチツ0123456789{}[]<>/=;+*$'.split('');

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        let w = 0;
        let h = 0;
        let fontSize = 15;
        let lineHeight = 26;
        let raf = 0;
        let running = false;

        type Row = { text: string; x: number; alpha: number; bright: boolean };
        let rows: Row[] = [];
        let offset = 0;

        const makeRow = (): Row => {
            const text = SNIPPETS[(Math.random() * SNIPPETS.length) | 0];
            const mobile = w < 768;
            return {
                text,
                // Desktop: right half (code-editor side). Mobile: spread across full width.
                x: mobile
                    ? Math.round(Math.random() * w * 0.7)
                    : Math.round(w * 0.5 + Math.random() * w * 0.42),
                alpha: 0.78 + Math.random() * 0.22,
                bright: Math.random() > 0.82,
            };
        };

        const setup = () => {
            const parent = canvas.parentElement;
            w = parent?.clientWidth ?? window.innerWidth;
            h = parent?.clientHeight ?? window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            fontSize = w < 768 ? 13 : 15;
            lineHeight = fontSize * 1.75;
            const count = Math.ceil(h / lineHeight) + 2;
            rows = new Array(count).fill(0).map(makeRow);
            offset = 0;
        };

        setup();

        const speed = 1.5; // px per frame
        let frame = 0;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
            ctx.textBaseline = 'top';

            const glow = w < 768 ? 4 : 7;

            // Subtle cinematic glitch: swap a couple of glyphs occasionally
            if (frame % 5 === 0) {
                for (let k = 0; k < 2; k++) {
                    const r = rows[(Math.random() * rows.length) | 0];
                    if (r && r.text.length > 2) {
                        const ci = (Math.random() * r.text.length) | 0;
                        const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
                        r.text = r.text.slice(0, ci) + g + r.text.slice(ci + 1);
                    }
                }
            }

            for (let i = 0; i < rows.length; i++) {
                const r = rows[i];
                if (!r.text) continue;
                const y = i * lineHeight - offset;
                if (y < -lineHeight || y > h) continue;

                // Bright as it enters at the bottom, fading as it rises (trail)
                const p = Math.max(0, Math.min(1, y / h));
                const fade = p * p * (3 - 2 * p); // smoothstep
                const flick = 0.88 + Math.random() * 0.12;
                const a = r.alpha * fade * flick;
                if (a <= 0.02) continue;

                // Subtle neon glow (kept low so it doesn't blow out)
                ctx.shadowColor = r.bright ? 'rgba(150, 255, 190, 0.45)' : 'rgba(50, 210, 120, 0.4)';
                ctx.shadowBlur = glow;
                ctx.fillStyle = r.bright
                    ? `rgba(205, 255, 222, ${a})`
                    : `rgba(70, 226, 132, ${a})`;
                ctx.fillText(r.text, r.x, y);
            }
            ctx.shadowBlur = 0;

            offset += speed;
            if (offset >= lineHeight) {
                offset -= lineHeight;
                rows.shift();
                rows.push(makeRow());
            }

            frame++;
            raf = requestAnimationFrame(draw);
        };

        const start = () => {
            if (running) return;
            running = true;
            raf = requestAnimationFrame(draw);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !document.hidden) start();
                else stop();
            },
            { threshold: 0 }
        );
        io.observe(canvas);

        const onVisibility = () => {
            if (document.hidden) stop();
        };
        document.addEventListener('visibilitychange', onVisibility);

        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setup, 200);
        };
        window.addEventListener('resize', onResize);

        return () => {
            stop();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('resize', onResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
