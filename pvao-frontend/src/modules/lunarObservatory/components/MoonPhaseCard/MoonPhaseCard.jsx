import React from 'react';
import styles from './MoonPhaseCard.module.css';

const MoonPhaseCard = ({ data, loading }) => {
  if (loading || !data) {
    return <div className={`${styles.card} ${styles.loading}`}>Loading telemetry...</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>LUNAR PHASE</h3>
        <span className={styles.liveIndicator}>LIVE</span>
      </div>
      
      <div className={styles.primaryData}>
        <div className={styles.phaseName}>{data.phase_name}</div>
        <div className={styles.illumination}>
          <span className={styles.value}>{data.illumination_percentage}%</span>
          <span className={styles.label}>ILLUMINATED</span>
        </div>
      </div>

      <div className={styles.telemetryGrid}>
        <div className={styles.dataPoint}>
          <span className={styles.label}>DISTANCE</span>
          <span className={styles.value}>{data.distance_km.toLocaleString()} km</span>
        </div>
        <div className={styles.dataPoint}>
          <span className={styles.label}>SUN-MOON ANGLE</span>
          <span className={styles.value}>{data.sun_moon_angle.toFixed(1)}°</span>
        </div>
        <div className={styles.dataPoint}>
          <span className={styles.label}>RIGHT ASCENSION</span>
          <span className={styles.value}>{data.ra}</span>
        </div>
        <div className={styles.dataPoint}>
          <span className={styles.label}>DECLINATION</span>
          <span className={styles.value}>{data.dec}</span>
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseCard;
