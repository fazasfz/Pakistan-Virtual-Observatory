import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

export const SolarFeatures = ({ solarImage = '' }) => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        Promise.all([
            fetch('https://services.swpc.noaa.gov/json/solar_regions.json').then((r) => (r.ok ? r.json() : [])),
            fetch('https://services.swpc.noaa.gov/json/edited_events.json').then((r) => (r.ok ? r.json() : [])),
        ])
            .then(([regionsData, eventsData]) => {
                const featureList = [];

                if (Array.isArray(regionsData)) {
                    regionsData.slice(-6).forEach((r) => {
                        featureList.push({
                            id: `AR-${r.region}-${r.location}`,
                            type: 'Active Region',
                            name: `AR ${r.region}`,
                            location: r.location || 'Disk Surface',
                            desc: `Area: ${r.area || 'N/A'} MSH | Spots: ${r.spot_count || 'N/A'} | Class: ${r.mag_type || 'Beta'}`,
                        });
                    });
                }

                if (Array.isArray(eventsData)) {
                    const dynamicEvents = eventsData.filter((e) => {
                        const t = (e.type || e.eventType || '').toUpperCase();
                        return t === 'CME' || t === 'DSF' || t === 'FIL';
                    });

                    dynamicEvents.slice(-6).forEach((e, idx) => {
                        const isEruption = (e.type || '').toUpperCase() === 'CME';
                        featureList.push({
                            id: `FEAT-${idx}-${e.beginTime || idx}`,
                            type: isEruption ? 'Coronal Eruption' : 'Filament',
                            name: e.region ? `AR ${e.region}` : 'Disk Event',
                            location: e.location || 'Limb / Disk',
                            desc: e.particulars || 'Dynamic magnetic structure observed',
                        });
                    });
                }

                setFeatures(featureList);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Strict Category Matching
    const filtered = features.filter((f) => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'ACTIVE REGION') return f.type === 'Active Region';
        if (activeFilter === 'FILAMENT') return f.type === 'Filament';
        if (activeFilter === 'CORONAL') return f.type === 'Coronal Eruption';
        return true;
    });

    return (
        <section className={styles.flaresSection}>
            <h2 className={styles.sectionTitle}>Solar Features & Active Disk Mapping</h2>
            <div className={styles.flareTelemetryCard}>
                <div className={styles.telemetryHeader}>
                    <span className={styles.telemetryBadge}>SURFACE FEATURES</span>
                    <div className={styles.filterGroup}>
                        {['ALL', 'ACTIVE REGION', 'FILAMENT', 'CORONAL'].map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.cardInnerLayout}>
                    <div className={styles.cardTextContent}>
                        <div className={styles.sunspotTableContainer}>
                            <table className={styles.sunspotTable}>
                                <thead>
                                    <tr>
                                        <th>Feature ID</th>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4">Scanning solar surface features...</td></tr>
                                    ) : filtered.length > 0 ? (
                                        filtered.map((f) => (
                                            <tr key={f.id}>
                                                <td className={styles.featureName}>{f.name}</td>
                                                <td>{f.type}</td>
                                                <td>{f.location}</td>
                                                <td className={styles.featureDesc}>{f.desc}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4">No active features in this category.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {solarImage && (
                        <div className={styles.embeddedRightImageWrapper}>
                            <img src={solarImage} alt="Annotated Solar Disk" className={styles.galleryStyleImage} />
                            <span className={styles.imageCaption}>SDO HMI / AIA Surface Map</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SolarFeatures;