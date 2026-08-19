import React from 'react';
import styles from './astronomicalProbeTracker.module.css';

export const ProbeTrackerHeader = ({ activeBody, setActiveBody, searchQuery, setSearchQuery }) => {
    const bodies = ['earth', 'moon', 'mars', 'sun'];

    return (
        <div className={styles.aptHeaderContainer}>
            <div className={styles.aptTitleGroup}>
                <h1 className={styles.aptMainTitle}>Astronomical Probe Tracker</h1>
                <span className={styles.aptSubTitle}>Live NASA Horizons Telemetry</span>
            </div>

            <div className={styles.aptControlsGroup}>
                <input
                    type="text"
                    placeholder="Search probes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.aptSearchInput}
                />
                <div className={styles.aptButtonGroup}>
                    {bodies.map((body) => (
                        <button
                            key={body}
                            className={`${styles.aptBodyBtn} ${activeBody?.toLowerCase() === body ? styles.aptActiveBodyBtn : ''
                                }`}
                            onClick={() => setActiveBody(body)}
                        >
                            {body}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProbeTrackerHeader;