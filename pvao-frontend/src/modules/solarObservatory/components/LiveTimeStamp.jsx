import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

export const LiveTimestamp = () => {
    const [time, setTime] = useState(new Date().toUTCString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toUTCString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div className={styles.cardTitle}>LIVE OBSERVED TIME (UTC)</div>
            <div className={styles.metricLabel} style={{ marginTop: '4px' }}>{time}</div>
        </div>
    );
};

export default LiveTimestamp;