import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';
import SectionHeading from '../../../components/common/SectionHeading/SectionHeading';

export const SolarFlares = ({ flareImage = '', loading = false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [telemetry, setTelemetry] = useState({ current: '...', peak: '...', loading: true, error: null });

    useEffect(() => {
        fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json')
            .then((res) => (res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`)))
            .then((data) => {
                if (!Array.isArray(data) || !data.length) throw new Error('No telemetry');

                const getClass = (flux) => {
                    if (!flux || flux <= 0) return 'N/A';
                    if (flux < 1e-7) return `A${(flux / 1e-8).toFixed(1)}`;
                    if (flux < 1e-6) return `B${(flux / 1e-7).toFixed(1)}`;
                    if (flux < 1e-5) return `C${(flux / 1e-6).toFixed(1)}`;
                    if (flux < 1e-4) return `M${(flux / 1e-5).toFixed(1)}`;
                    return `X${(flux / 1e-4).toFixed(1)}`;
                };

                const latest = data[data.length - 1];
                const maxFlux = Math.max(...data.map((d) => d.flux || 0));

                setTelemetry({ current: getClass(latest.flux), peak: getClass(maxFlux), loading: false, error: null });
            })
            .catch(() => setTelemetry({ current: 'N/A', peak: 'N/A', loading: false, error: 'Telemetry Feed Unavailable' }));
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => e.key === 'Escape' && setSelectedImage(null);
        if (selectedImage) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    return (
        <section className={styles.flaresSection}>
            <SectionHeading>Solar Flare Activity & High-Energy EUV</SectionHeading>

            {/* Main Single Card Container */}
            <div className={styles.flareTelemetryCard}>
                <div className={styles.telemetryHeader}>
                    <span className={styles.telemetryBadge}>GOES X-RAY MONITOR</span>
                    <span className={styles.liveIndicator}>● LIVE NOAA FEED</span>
                </div>

                {/* Inner Flex Wrapper: Left Text Content + Right Image */}
                <div className={styles.cardInnerLayout}>
                    <div className={styles.cardTextContent}>
                        {telemetry.loading ? (
                            <div className={styles.telemetryStatus}>Fetching real-time satellite telemetry...</div>
                        ) : telemetry.error ? (
                            <div className={styles.telemetryError}>{telemetry.error}</div>
                        ) : (
                            <div className={styles.flareClassContainer}>
                                <div className={styles.flareMetric}>
                                    <span className={styles.metricLabel}>Current X-Ray Flare Level</span>
                                    <span className={styles.metricValueNormal}>{telemetry.current}</span>
                                </div>
                                <div className={styles.flareMetric}>
                                    <span className={styles.metricLabel}>24h Peak Flare Activity</span>
                                    <span className={styles.metricValuePeak}>{telemetry.peak}</span>
                                </div>
                            </div>
                        )}

                        <p className={styles.telemetryDescription}>
                            Extreme High-Energy EUV (131 Å / 94 Å) channels observe super-heated coronal plasma exceeding 10,000,000 K, specifically capturing M-class and X-class solar flares in real-time.
                        </p>
                    </div>

                    {/* Right-Aligned Image inside the card */}
                    <div
                        className={styles.embeddedRightImageWrapper}
                        onClick={() => flareImage && setSelectedImage({ title: 'SDO AIA 131 Å (Solar Flares)', src: flareImage })}
                    >
                        {loading || !flareImage ? (
                            <div className={styles.imagePlaceholder}>Loading Live Flare Channel Feed...</div>
                        ) : (
                            <img src={flareImage} alt="SDO AIA 131 Live Flare Channel" className={styles.galleryStyleImage} />
                        )}
                        <span className={styles.imageCaption}>SDO AIA 131 Å (Solar Flares)</span>
                    </div>
                </div>
            </div>

            {/* Modal Lightbox */}
            {selectedImage && (
                <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>&times;</button>
                        <img src={selectedImage.src} alt={selectedImage.title} className={styles.fullSolarImage} />
                        <div className={styles.modalCaption}>
                            <h3>{selectedImage.title}</h3>
                            <p>Press <kbd>ESC</kbd> or click outside to close</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SolarFlares;