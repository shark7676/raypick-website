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

        const speed = 1.45; // px per frame
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
            ctx.textBaseline = 'top';

            for (let i = 0; i < rows.length; i++) {
                const r = rows[i];
                if (!r.text) continue;
                const y = i * lineHeight - offset;
                // richer green; occasional brighter highlight line
                ctx.fillStyle = r.bright
                    ? `rgba(180, 255, 205, ${r.alpha})`
                    : `rgba(57, 220, 122, ${r.alpha})`;
                ctx.fillText(r.text, r.x, y);
            }

            offset += speed;
            if (offset >= lineHeight) {
                offset -= lineHeight;
                rows.shift();
                rows.push(makeRow());
            }

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
