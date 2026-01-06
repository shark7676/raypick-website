'use client';

import { useState, useEffect, useRef } from 'react';

export default function SplineRobot() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load: only load iframe when component is near viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="spline-wrapper" ref={containerRef}>
      {isLoading && (
        <div className="spline-loader">
          <div className="spinner"></div>
          <p>Loading Robot...</p>
        </div>
      )}

      {shouldLoad && (
        <iframe
          src='https://my.spline.design/miniroom-2b10f0a1f7c1e345b533306637307047/'
          frameBorder='0'
          width='100%'
          height='100%'
          onLoad={() => setIsLoading(false)}
          title="Spline 3D Robot"
          loading="lazy"
        ></iframe>
      )}

      <style jsx>{`
        .spline-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          min-height: 500px;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .spline-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--background);
          z-index: 10;
          color: var(--foreground);
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
