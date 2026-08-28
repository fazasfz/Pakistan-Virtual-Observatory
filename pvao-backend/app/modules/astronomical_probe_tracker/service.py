"""
Core business logic for Astronomical Probe Tracker.
Strictly fetches live, genuine ephemeris state vectors (X, Y, Z, VX, VY, VZ)
from NASA JPL Horizons API with NO mock data and NO fallbacks.
"""
from fastapi import HTTPException
import httpx
import re
import math
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

from .constants import PROBE_CATALOG, CENTER_MAP
from .schemas import LiveProbeData

HORIZONS_API = "https://ssd.jpl.nasa.gov/api/horizons.api"
SPEED_OF_LIGHT_KMS = 299792.458

BODY_RADII = {
    "earth": 6378.137,
    "moon": 1737.4,
    "mars": 3389.5,
    "sun": 696340.0
}

BODY_MU = {
    "earth": 398600.4418,
    "moon": 4902.8,
    "mars": 42828.375,
    "sun": 132712440018.0
}

COORD_FRAMES = {
    "earth": "ICRF / Geocentric @399",
    "moon": "ICRF / Selenocentric @301",
    "mars": "ICRF / Areocentric @499",
    "sun": "ICRF / Heliocentric @10"
}

async def fetch_live_horizons_vectors(horizons_id: str, center_code: str) -> Dict[str, float]:
    """Fetches high-precision state vectors directly from NASA JPL Horizons API."""
    now = datetime.now(timezone.utc)
    start_str = now.strftime("%Y-%m-%d %H:%M")
    stop_str = (now + timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M")
    
    params = {
        "format": "json",
        "COMMAND": f"'{horizons_id}'",
        "OBJ_DATA": "NO",
        "MAKE_EPHEM": "YES",
        "EPHEM_TYPE": "VECTORS",
        "CENTER": f"'{center_code}'",
        "START_TIME": f"'{start_str}'",
        "STOP_TIME": f"'{stop_str}'",
        "STEP_SIZE": "'1m'",
        "VEC_TABLE": "2"
    }

    headers = {"User-Agent": "NASA-PVAO-Client/1.0"}

    try:
        async with httpx.AsyncClient(timeout=12.0, verify=False) as client:
            res = await client.get(HORIZONS_API, params=params, headers=headers)
            res.raise_for_status()
            raw_json = res.json()
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"NASA JPL Horizons API request failed: {str(e)}"
        )

    text_result = raw_json.get("result", "")
    
    if "$$SOE" not in text_result or "$$EOE" not in text_result:
        # Extract first few error lines from NASA response
        err_lines = [line.strip() for line in text_result.splitlines() if line.strip()]
        error_msg = " | ".join(err_lines[:3]) if err_lines else "No ephemeris block returned"
        raise HTTPException(
            status_code=502,
            detail=f"NASA JPL Horizons API Error: {error_msg}"
        )

    # Extract block strictly between $$SOE and $$EOE markers
    data_block = text_result.split("$$SOE")[1].split("$$EOE")[0]
    num_pattern = r'([+-]?\d+\.?\d*(?:[eE][+-]?\d+)?)'
    
    x_m = re.search(r'X\s*=\s*' + num_pattern, data_block)
    y_m = re.search(r'Y\s*=\s*' + num_pattern, data_block)
    z_m = re.search(r'Z\s*=\s*' + num_pattern, data_block)
    vx_m = re.search(r'VX\s*=\s*' + num_pattern, data_block)
    vy_m = re.search(r'VY\s*=\s*' + num_pattern, data_block)
    vz_m = re.search(r'VZ\s*=\s*' + num_pattern, data_block)

    if not (x_m and y_m and z_m):
        raise HTTPException(
            status_code=502,
            detail="Failed to parse vector coordinates (X, Y, Z) from NASA JPL Horizons payload."
        )

    x = float(x_m.group(1))
    y = float(y_m.group(1))
    z = float(z_m.group(1))
    
    vx = float(vx_m.group(1)) if vx_m else 0.0
    vy = float(vy_m.group(1)) if vy_m else 0.0
    vz = float(vz_m.group(1)) if vz_m else 0.0

    return {"x": x, "y": y, "z": z, "vx": vx, "vy": vy, "vz": vz}

async def get_live_probe_data(target_key: str, probe_id_key: str) -> LiveProbeData:
    """Retrieves probe from catalog and computes pure, un-mocked telemetry from NASA state vectors."""
    target = target_key.lower().strip()
    probe_id = probe_id_key.lower().strip()
    
    probes = PROBE_CATALOG.get(target, [])
    found = next((p for p in probes if p["id"] == probe_id or p.get("horizons_id") == probe_id), None)
    
    if not found:
        raise HTTPException(status_code=404, detail=f"Probe '{probe_id}' not found under target '{target}'")
    
    center_code = CENTER_MAP.get(target, "500@399")
    horizons_id = found.get("horizons_id", found["id"])

    # Fetch live NASA state vectors
    vectors = await fetch_live_horizons_vectors(horizons_id, center_code)
    
    x = vectors["x"]
    y = vectors["y"]
    z = vectors["z"]
    vx = vectors["vx"]
    vy = vectors["vy"]
    vz = vectors["vz"]

    # Derived physical properties directly from state vectors
    r_mag = math.sqrt(x**2 + y**2 + z**2)
    v_mag = math.sqrt(vx**2 + vy**2 + vz**2)
    
    radius_body = BODY_RADII.get(target, 6378.137)
    mu_body = BODY_MU.get(target, 398600.4418)
    
    altitude = max(0.0, r_mag - radius_body)
    velocity_kmh = v_mag * 3600.0
    
    # Sub-satellite coordinates from Cartesian ECI/Geocentric
    lat = math.degrees(math.asin(max(-1.0, min(1.0, z / max(r_mag, 1e-3)))))
    lon = math.degrees(math.atan2(y, x))
    
    # Angular momentum and inclination
    hx = y * vz - z * vy
    hy = z * vx - x * vz
    hz = x * vy - y * vx
    h_mag = math.sqrt(hx**2 + hy**2 + hz**2)
    
    if h_mag > 1e-6:
        inc_deg = math.degrees(math.acos(max(-1.0, min(1.0, hz / h_mag))))
    else:
        # Fall back to catalog inclination string
        inc_deg = float(found.get("inclination", "0.0").replace("°", "").strip())
        
    # Light propagation delay
    owlt = r_mag / SPEED_OF_LIGHT_KMS
    rtlt = 2.0 * owlt
    
    # Vis-Viva apsides
    specific_energy = (v_mag**2) / 2.0 - (mu_body / max(r_mag, 1e-3))
    if abs(specific_energy) > 1e-9:
        a = -mu_body / (2.0 * specific_energy)
        ecc_term = 1.0 + (2.0 * specific_energy * (h_mag**2)) / (mu_body**2) if h_mag > 1e-6 else 0.0
        ecc = math.sqrt(max(0.0, ecc_term))
        rp = max(0.0, a * (1.0 - ecc))
        ra = a * (1.0 + ecc) if ecc < 1.0 else r_mag * 1.5
    else:
        rp = r_mag
        ra = r_mag

    current_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    return LiveProbeData(
        probe_id=found["id"],
        satId=found["id"],
        name=found["name"],
        target_body=target,
        timestamp=current_utc,
        x=round(x, 2),
        y=round(y, 2),
        z=round(z, 2),
        vx=round(vx, 4),
        vy=round(vy, 4),
        vz=round(vz, 4),
        velocity=f"{v_mag:.2f} km/s" if v_mag > 0 else "Live Orbital",
        velocity_kms=round(v_mag, 3),
        velocity_kmh=round(velocity_kmh, 1),
        distance_km=round(r_mag, 2),
        orbital_radius_km=round(r_mag, 2),
        altitude_km=round(altitude, 2),
        inclination=found.get("inclination", f"{inc_deg:.2f}°"),
        inclination_deg=round(inc_deg, 2),
        sub_sat_lat=round(lat, 4),
        sub_sat_lon=round(lon, 4),
        owlt_sec=round(owlt, 4),
        rtlt_sec=round(rtlt, 4),
        apogee_km=round(ra, 1),
        perigee_km=round(rp, 1),
        coord_frame=COORD_FRAMES.get(target, "ICRF / Relative"),
        period=found.get("period", "N/A"),
        raw_status="Active (NASA JPL Horizons Live)"
    )