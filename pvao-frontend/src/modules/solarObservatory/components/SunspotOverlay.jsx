import React from 'react';
import styles from '../SolarObservatory.module.css';

const DEFAULT_SUNSPOTS = [
    { region: 'AR3575', top: '35%', left: '40%', area: '420', class: 'Beta-Gamma' },
    { region: 'AR3578', top: '55%', left: '60%', area: '180', class: 'Alpha' },
    { region: 'AR3581', top: '65%', left: '30%', area: '510', class: 'Beta-Delta' },
];

export const SunspotOverlay = ({ activeRegions = [], onHoverSpot }) => {
    // Use telemetry data if available, otherwise fall back to initial mock regions
    const spotsToRender = activeRegions.length > 0 ? activeRegions : DEFAULT_SUNSPOTS;

    return (
        <div className={styles.hotspotOverlayLayer}>
            {spotsToRender.map((spot, idx) => {
                // Calculate position percentage safely for both live API and fallback data
                const topVal = spot.lat_percent !== undefined ? `${spot.lat_percent}%` : (spot.top || '50%');
                const leftVal = spot.long_percent !== undefined ? `${spot.long_percent}%` : (spot.left || '50%');

                return (
                    <div
                        key={spot.region || spot.id || idx}
                        className={styles.organicSunspot}
                        style={{ top: topVal, left: leftVal }}
                        onMouseEnter={() => onHoverSpot && onHoverSpot(spot)}
                        onMouseLeave={() => onHoverSpot && onHoverSpot(null)}
                    >
                        {/* Outer penumbra plasma border */}
                        <div className={styles.penumbraRing} />
                        {/* Inner dark umbra core */}
                        <div className={styles.umbraCore} />
                        {/* Glowing target pulse ring for high visibility */}
                        <div className={styles.spotPulseRing} />
                    </div>
                );
            })}
        </div>
    );
};

export default SunspotOverlay;