import React from 'react';
import styles from '../SolarObservatory.module.css';

export const SolarWindTelemetry = ({ telemetry, loading }) => {
    return (
        <aside className={styles.unifiedGlassSidebar}>
            <h3 className={styles.sidebarHeader}>Space Weather Live</h3>

            <div className={styles.metricSection}>
                <div className={styles.sectionLabel}>SOLAR WIND TELEMETRY</div>
                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.solar_wind_speed ?? 'N/A')}{' '}
                    <span className={styles.metricUnit}>km/s</span>
                </div>
                <div className={styles.metricSubLabel}>Solar Wind Velocity (L1)</div>

                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.proton_density ?? 'N/A')}{' '}
                    <span className={styles.metricUnit}>p/cm³</span>
                </div>
                <div className={styles.metricSubLabel}>Proton Density</div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.metricSection}>
                <div className={styles.sectionLabel}>SOLAR ACTIVITY STATUS</div>
                <div className={styles.metricValueHighlight}>
                    {loading ? '...' : (telemetry?.xray_flux ?? 'N/A')}
                </div>
                <div className={styles.metricSubLabel}>X-Ray Flux Level</div>

                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.sunspot_count ?? 'N/A')}
                </div>
                <div className={styles.metricSubLabel}>Active Sunspot Count</div>
            </div>
        </aside>
    );
};

export default SolarWindTelemetry;