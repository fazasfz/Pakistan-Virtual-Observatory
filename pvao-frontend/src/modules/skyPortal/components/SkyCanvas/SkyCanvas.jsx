import React, { useEffect, useRef, useState } from 'react';
import styles from './SkyCanvas.module.css';

const SkyCanvas = () => {
  const canvasRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let stel = null;
    let isMounted = true;
    let mockAnimationId = null;

    const startMockEngine = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return; 

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();

      const stars = Array.from({ length: 400 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.05
      }));

      const animate = () => {
        if (!isMounted) return;
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
          star.opacity += star.speed;
          if (star.opacity > 1 || star.opacity < 0) star.speed *= -1;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.opacity))})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        mockAnimationId = requestAnimationFrame(animate);
      };
      animate();
    };

    const initEngine = () => {
      if (!canvasRef.current || !window.StelWebEngine) return;
      
      try {
        window.StelWebEngine({
          wasmFile: '/vendor/stellarium/stellarium-web-engine.wasm',
          canvas: canvasRef.current,
          translateFn: (domain, str) => str,
          onReady: (engine) => {
            if (!isMounted) return;
            stel = engine;
          }
        });
      } catch (e) {
        console.warn("Stellarium Engine failed to initialize, falling back to mock engine.");
        if (isMounted) {
          setLoadError(true);
          startMockEngine();
        }
      }
    };

    const loadEngine = () => {
      if (window.StelWebEngine) {
        initEngine();
        return;
      }
      
      const scriptId = 'stellarium-engine-script';
      const existingScript = document.getElementById(scriptId);
      
      if (existingScript) {
        if (existingScript.dataset.status === 'loaded') {
          initEngine();
        } else if (existingScript.dataset.status === 'error') {
          setLoadError(true);
          startMockEngine();
        } else {
          existingScript.addEventListener('load', () => {
            if (isMounted) initEngine();
          });
          existingScript.addEventListener('error', () => {
            if (isMounted) {
              setLoadError(true);
              startMockEngine();
            }
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '/vendor/stellarium/stellarium-web-engine.js';
      script.async = true;
      script.onload = () => {
        script.dataset.status = 'loaded';
        if (isMounted) initEngine();
      };
      script.onerror = () => {
        script.dataset.status = 'error';
        console.warn("Stellarium script not found. Using mock starfield fallback.");
        if (isMounted) {
          setLoadError(true);
          startMockEngine();
        }
      };
      document.body.appendChild(script);
    };

    loadEngine();

    return () => {
      isMounted = false;
      if (mockAnimationId) {
        cancelAnimationFrame(mockAnimationId);
      }
    };
  }, []);

  return (
    <div className={styles.canvasContainer}>
      {loadError && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent-gold, #cda434)', textAlign: 'center', zIndex: 20, backgroundColor: 'rgba(0,0,0,0.7)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--accent-gold, #cda434)' }}>
          <h3>Placeholder Engine Active</h3>
          <p>The Stellarium Web Engine files are missing.</p>
          <p>Displaying a mock starfield in the meantime.</p>
        </div>
      )}
      <canvas ref={canvasRef} id="stel-canvas" className={styles.canvas}></canvas>
    </div>
  );
};

export default SkyCanvas;
