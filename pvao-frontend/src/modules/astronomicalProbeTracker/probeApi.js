/**
 * API client for the Astronomical Probe Tracker.
 * Fetches lists of active probes per target and retrieves live telemetry.
 */
import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const BASE_URL = `${API_ROOT}/astronomical-probe-tracker`;

export const getProbesByTarget = async (target) => {
    const response = await axios.get(`${BASE_URL}/probes/${target}`);
    return response.data;
};

export const getLiveTelemetry = async (target, probeId) => {
    const response = await axios.get(`${BASE_URL}/live/${target}/${probeId}`);
    const data = response.data || {};

    // Parse numeric velocity strictly from raw backend response
    let parsedVel = 0;
    if (data.velocity) {
        const match = String(data.velocity).match(/[-+]?[0-9]*\.?[0-9]+/);
        parsedVel = match ? parseFloat(match[0]) : 0;
    }

    return {
        ...data,
        x: Number(data.x ?? 0),
        y: Number(data.y ?? 0),
        z: Number(data.z ?? 0),
        velocity: parsedVel,
        raw_velocity: data.velocity,
        orbital_radius: Number(data.distance_km ?? data.orbital_radius ?? 0),
        earth_distance_km: Number(data.distance_km ?? data.earth_distance_km ?? 0),
        inclination: data.inclination
    };
};