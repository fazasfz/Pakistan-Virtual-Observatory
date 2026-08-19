import React from "react";
import styles from './astronomicalProbeTracker.module.css';

export const ProbeTelemetryCard = ({ telemetry, hoveredProbe, onClose }) => {
    const activeData = telemetry || hoveredProbe;

    if (!activeData) {
        return (
            <div className={styles.aptCardPlaceholder}>
                Select or hover over a probe to fetch live telemetry...
            </div>
        );
    }

    const x = Number(activeData.x ?? 0);
    const y = Number(activeData.y ?? 0);
    const z = Number(activeData.z ?? 0);

    const rawDist = activeData.distance_km ?? Math.sqrt(x * x + y * y + z * z);
    const rawVel = parseFloat(activeData.velocity) || 0;

    const lat = rawDist > 0 ? (Math.asin(z / rawDist) * (180 / Math.PI)).toFixed(2) : "0.00";
    const lon = rawDist > 0 ? (Math.atan2(y, x) * (180 / Math.PI)).toFixed(2) : "0.00";

    return (
        <div className={styles.aptTelemetryCard}>
            <div className={styles.aptCardHeader}>
                <h3 className={styles.aptCardTitle}>{activeData.name}</h3>
                {onClose && (
                    <button className={styles.aptCloseBtn} onClick={onClose}>
                        ×
                    </button>
                )}
            </div>

            <div className={styles.aptCardBody}>
                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Speed:</span>
                    <span className={styles.aptValue}>
                        {rawVel > 0 ? `${rawVel} km/s` : "N/A"}
                    </span>
                </div>
                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Height:</span>
                    <span className={styles.aptValue}>
                        {rawDist > 0 ? `${Math.round(rawDist).toLocaleString()} km` : "N/A"}
                    </span>
                </div>
                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Latitude:</span>
                    <span className={styles.aptValue}>{lat}°</span>
                </div>
                <div className={styles.aptStatRow}>
                    <span className={styles.aptLabel}>Longitude:</span>
                    <span className={styles.aptValue}>{lon}°</span>
                </div>
            </div>
        </div>
    );
};

export default ProbeTelemetryCard;