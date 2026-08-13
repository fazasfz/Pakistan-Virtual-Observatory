import React from 'react';
import styles from './SizeComparison.module.css';
import { references } from './comparisonReferences.data';

export default function SizeComparison({ diameterKm }) {
  if (diameterKm == null || diameterKm === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.heading}>Size Comparison</h3>
        <p className={styles.emptyText}>Size data unavailable for this feature.</p>
      </div>
    );
  }

  const closest = references.reduce((best, ref) =>
    Math.abs(ref.km - diameterKm) < Math.abs(best.km - diameterKm) ? ref : best
  );
  
  const ratio = (diameterKm / closest.km).toFixed(1);
  
  // Calculate visual scaling
  // We want the larger of the two to take up 100%, and the smaller to scale proportionally
  const maxKm = Math.max(diameterKm, closest.km);
  const featureWidthPct = (diameterKm / maxKm) * 100;
  const referenceWidthPct = (closest.km / maxKm) * 100;

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Size Comparison</h3>
      <p className={styles.result}>
        At <strong>{diameterKm} km</strong> across, this is roughly
        {ratio >= 0.9 && ratio <= 1.1 ? ' the same size as ' : ` ${ratio}× the size of `}
        <strong>{closest.name}</strong>.
      </p>
      
      <div className={styles.barContainer}>
        <div className={styles.barRow}>
          <div className={styles.barLabel}>{diameterKm} km (Feature)</div>
          <div className={styles.barTrack}>
            <div className={styles.barFeature} style={{ width: `${featureWidthPct}%` }} />
          </div>
        </div>
        <div className={styles.barRow}>
          <div className={styles.barLabel}>{closest.km} km ({closest.name})</div>
          <div className={styles.barTrack}>
            <div className={styles.barReference} style={{ width: `${referenceWidthPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
