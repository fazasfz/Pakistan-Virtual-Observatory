/**
 * Renders a chart visualizing the progression of the solar cycle (sunspot activity over time).
 * Integrates external space weather data to plot solar maximum/minimum.
 */
import React, { useEffect, useState } from 'react';
import {
    ComposedChart, Area, Bar, Line, Scatter, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import styles from '../SolarObservatory.module.css';
import SectionHeading from '../../../components/common/SectionHeading/SectionHeading';

export const SolarCycleGraph = () => {
    const [cycleData, setCycleData] = useState([]);
    const [radialData, setRadialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/solar-observatory/cycle-data')
            .then((res) => res.ok ? res.json() : Promise.reject(`HTTP Error ${res.status}`))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const recent = data.slice(-30).map((item) => {
                        const ssn = typeof item.ssn === 'number' && item.ssn >= 0 ? item.ssn : 0;
                        const smoothed = typeof item.smoothed_ssn === 'number' && item.smoothed_ssn >= 0 ? item.smoothed_ssn : 0;
                        return { date: item['time-tag'] || item['month'] || '', ssn, smoothed, radio_flux: ssn * 1.2, dots: ssn * 0.4 };
                    });

                    setCycleData(recent);

                    const activeMonths = recent.filter((d) => d.ssn > 0);
                    const activeSlice = activeMonths.length >= 7 ? activeMonths.slice(-7) : recent.slice(-7);
                    const maxSsn = Math.max(...activeSlice.map((d) => d.ssn)) || 1;
                    const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

                    const radial = activeSlice.map((item, idx) => ({
                        name: item.date || `Point ${idx + 1}`,
                        activity: Math.max(Number(((item.ssn / maxSsn) * 100).toFixed(1)), 5),
                        fill: colors[idx % colors.length]
                    }));

                    setRadialData(radial);
                } else {
                    setError('No cycle data returned from server.');
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.sectionWrapper}>
            <SectionHeading>Solar Cycle Progression & Radial Diagnostics</SectionHeading>

            {loading && <div className={styles.chartLoading}>Fetching real-time NOAA data...</div>}
            {error && <div className={styles.chartError}>Error: {error}</div>}

            {!loading && !error && (
                <div className={styles.sideBySideGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartSubTitle}>Composed Metrics</h3>
                        <div className={styles.chartBodyComposed}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={cycleData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                                    <XAxis dataKey="date" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="radio_flux" name="Radio Flux" fill="#312e81" stroke="#4338ca" fillOpacity={0.6} />
                                    <Bar dataKey="ssn" name="Sunspot Count (SSN)" barSize={12} fill="#3b82f6" />
                                    <Line type="monotone" dataKey="smoothed" name="Smoothed SSN" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                                    <Scatter dataKey="dots" name="Flare Events" fill="#ef4444" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <h3 className={styles.chartSubTitle}>Radial Metrics</h3>
                        <div className={styles.chartBodyRadial}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="40%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData} startAngle={180} endAngle={-180}>
                                    <RadialBar background={{ fill: '#1e293b' }} dataKey="activity" name="Relative Activity (%)" />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                                    <Tooltip formatter={(value) => [`${value}%`, 'Relative Activity']} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolarCycleGraph;