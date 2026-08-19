/**
 * UI card displaying real-time velocity, distance, and position metrics for a specific space probe.
 * Props: telemetry (object), hoveredProbe (object), onClose (function).
 */
import React from "react";

export const ProbeTelemetryCard = ({ telemetry, hoveredProbe, onClose }) => {
    const activeData = telemetry || hoveredProbe;

    if (!activeData) {
        return (
            <div className="apt-card-placeholder">
                Select or hover over a probe to fetch live telemetry...
            </div>
        );
    }

    const x = Number(activeData.x ?? 0);
    const y = Number(activeData.y ?? 0);
    const z = Number(activeData.z ?? 0);

    const rawDist = activeData.distance_km ?? Math.sqrt(x * x + y * y + z * z);
    const velocityKmH = activeData.velocity ?? 0;

    const lat = rawDist > 0 ? (Math.asin(z / rawDist) * (180 / Math.PI)).toFixed(2) : "0.00";
    const lon = rawDist > 0 ? (Math.atan2(y, x) * (180 / Math.PI)).toFixed(2) : "0.00";

    return (
        <div className="apt-telemetry-card">
            <div className="apt-card-header">
                <h3 className="apt-card-title">{activeData.name}</h3>
                {onClose && (
                    <button className="apt-close-btn" onClick={onClose}>
                        ×
                    </button>
                )}
            </div>

            <div className="apt-card-body">
                <div className="apt-stat-row">
                    <span className="apt-label">Speed:</span>
                    <span className="apt-value">
                        {velocityKmH ? `${velocityKmH.toLocaleString()} km/h` : "Live Orbiting"}
                    </span>
                </div>
                <div className="apt-stat-row">
                    <span className="apt-label">Height:</span>
                    <span className="apt-value">
                        {rawDist > 0 ? `${Math.round(rawDist).toLocaleString()} km` : "Fetching..."}
                    </span>
                </div>
                <div className="apt-stat-row">
                    <span className="apt-label">Latitude:</span>
                    <span className="apt-value">{lat}°</span>
                </div>
                <div className="apt-stat-row">
                    <span className="apt-label">Longitude:</span>
                    <span className="apt-value">{lon}°</span>
                </div>
            </div>
        </div>
    );
};