import React, { useEffect, useState } from 'react';
import styles from '../SolarObservatory.module.css';

const NASA_CONTINUUM_URL =
    'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_HMII.jpg';
const SWPC_SUNSPOTS_URL =
    'https://services.swpc.noaa.gov/json/solar_regions.json';

export default function SunspotRegions() {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        fetch(SWPC_SUNSPOTS_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch sunspot data');
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return;
                const validRegions = data.filter((item) => item.observed_date);
                const latestDate = validRegions.reduce(
                    (max, item) => (item.observed_date > max ? item.observed_date : max),
                    ''
                );
                const latestEntries = validRegions.filter(
                    (item) => item.observed_date === latestDate
                );
                setRegions(latestEntries);
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message);
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
        };
        if (isLightboxOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);

    return (
        <section className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>Sunspot Regions</h2>
            <div className={styles.singleContainerCard}>
                {/* Left Side: Table */}
                <div className={styles.tableSection}>
                    <h3 className={styles.chartSubTitle}>Active Sunspot Telemetry</h3>
                    <div className={styles.sunspotTableContainer}>
                        {loading && <p className={styles.chartLoading}>Loading live data...</p>}
                        {error && <p className={styles.chartError}>{error}</p>}
                        {!loading && !error && (
                            <table className={styles.sunspotTable}>
                                <thead>
                                    <tr>
                                        <th>Region</th>
                                        <th>Location</th>
                                        <th>Date</th>
                                        <th>Stationary</th>
                                        <th>Extent</th>
                                        <th>Mag Class</th>
                                        <th>Spot Class</th>
                                        <th>Area</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regions.map((spot, idx) => (
                                        <tr key={spot.region || idx}>
                                            <td>{spot.region || 'N/A'}</td>
                                            <td>{spot.location || 'N/A'}</td>
                                            <td>{spot.observed_date || 'N/A'}</td>
                                            <td>{spot.stationary ? 'Yes' : 'No'}</td>
                                            <td>{spot.extent ? `${spot.extent}°` : 'N/A'}</td>
                                            <td>{spot.mag_class || 'N/A'}</td>
                                            <td>{spot.spot_class || 'N/A'}</td>
                                            <td>{spot.area ? `${spot.area} MS` : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className={styles.imageSection}>
                    <div
                        className={styles.imageClickWrapper}
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        <img
                            src={NASA_CONTINUUM_URL}
                            alt="Live NASA SDO Sunspot Continuum"
                            className={styles.solarImage}
                        />
                    </div>
                    <p className={styles.imageCaption}>SDO HMI Continuum (Live Sunspots)</p>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div
                        className={styles.modalCard}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            &#10005;
                        </button>
                        <img
                            src={NASA_CONTINUUM_URL}
                            alt="SDO HMI Continuum Fullview"
                            className={styles.modalImage}
                        />
                        <p className={styles.modalCaption}>SDO HMI Continuum</p>
                        <span className={styles.modalSubtext}>
                            Press <kbd>ESC</kbd> or click outside to close
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}