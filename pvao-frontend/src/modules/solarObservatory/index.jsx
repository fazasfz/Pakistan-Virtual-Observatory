import React, { useState, useEffect } from 'react';
import styles from './SolarObservatory.module.css';
import InteractiveSun from './components/InteractiveSun';
import SolarWindTelemetry from './components/SolarWindTelemetry';
import LiveSunGallery from './components/LiveSunGallery';
import SolarFlares from './components/SolarFlares';
import { SolarCycleGraph } from './components/SolarCycleGraph';
import { SolarFunFacts } from './components/SolarFunFacts';
import { solarFunFacts } from './data/solarFunFacts';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';

export const SolarObservatory = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:8000/api/v1/solar-observatory/telemetry')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setTelemetry(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch live solar telemetry:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <LoadingOverlay funFacts={solarFunFacts.map(fact => fact.answer)} />;
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.fullScreenHero}>
        <div className={styles.denseStarsLayer1} />
        <div className={styles.denseStarsLayer2} />
        <div className={styles.nebulaGlow} />

        <SolarWindTelemetry telemetry={telemetry} loading={loading} />
        <InteractiveSun telemetry={telemetry} loading={loading} />
      </div>

      <LiveSunGallery images={telemetry?.live_images} loading={loading} />
      <SolarFlares flareImage={telemetry?.live_images?.aia_131} loading={loading} />
      <SolarCycleGraph />
      <SolarFunFacts />
    </div>
  );
};

export default SolarObservatory;