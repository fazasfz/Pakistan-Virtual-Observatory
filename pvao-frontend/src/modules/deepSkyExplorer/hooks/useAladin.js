import { useEffect, useRef, useState } from 'react';
import A from 'aladin-lite';

/**
 * useAladin
 * Initializes an Aladin Lite sky viewer inside a given DOM element.
 *
 * @param {Object} options - optional Aladin config (target, fov, survey, etc.)
 * @returns {Object} { containerRef, aladin, isReady }
 */
export function useAladin(options = {}) {
  const containerRef = useRef(null);
  const [aladin, setAladin] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Aladin Lite needs a unique DOM id to attach to
    const instance = A.aladin(containerRef.current, {
      survey: options.survey || 'P/DSS2/color',
      fov: options.fov || 60,
      target: options.target || '0 0',
      cooFrame: options.cooFrame || 'ICRS',
      showReticle: true,
      showZoomControl: true,
      showFullscreenControl: true,
      ...options,
    });

    setAladin(instance);
    setIsReady(true);

    // Cleanup on unmount
    return () => {
      setIsReady(false);
      setAladin(null);
    };
  }, []); // run once on mount

  return { containerRef, aladin, isReady };
}