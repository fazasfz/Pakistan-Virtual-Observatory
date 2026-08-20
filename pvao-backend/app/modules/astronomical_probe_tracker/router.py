"""
Defines the FastAPI route endpoints for the Astronomical Probe Tracker.
Exposes /probes and /live endpoints by relying on the service layer.
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List
import logging

from .constants import PROBE_CATALOG
from .schemas import ProbeBasicInfo, LiveProbeData
from .service import fetch_horizons_ephemeris, parse_vector_data, calculate_fallback_orbit

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

CENTER_MAP = {
    "earth": "500@399",
    "moon": "500@301",
    "mars": "500@499",
    "sun": "500@10"
}

@router.get("/targets")
def get_supported_targets():
    return {"targets": list(PROBE_CATALOG.keys())}

@router.get("/probes/{target}")
def get_probes_for_target(target: str):
    target_key = target.lower()
    if target_key not in PROBE_CATALOG:
        raise HTTPException(status_code=404, detail=f"Target body '{target_key}' not supported")
    return {"target": target_key, "probes": PROBE_CATALOG[target_key]}

@router.get("/live/{target}/{probe_id}", response_model=LiveProbeData)
async def get_live_probe_telemetry(target: str, probe_id: str):
    target_key = target.lower().strip()
    probe_id_key = probe_id.lower().strip()
    
    probes = PROBE_CATALOG.get(target_key, [])
    found = next((p for p in probes if p["id"] == probe_id_key or p.get("horizons_id") == probe_id_key), None)
    
    if not found:
        raise HTTPException(status_code=404, detail=f"Probe '{probe_id}' not found under '{target_key}'")
    
    center_code = CENTER_MAP.get(target_key, "500@399")
    horizons_id = found.get("horizons_id", found["id"])

    try:
        horizons_raw = await fetch_horizons_ephemeris(horizons_id, center_code)
        coords = parse_vector_data(horizons_raw, found["id"])
    except Exception as e:
        logger.warning(f"Horizons API failed for {probe_id_key}, generating calculated orbit: {e}")
        coords = calculate_fallback_orbit(found["id"])

    x, y, z = coords.get("x", 0.0), coords.get("y", 0.0), coords.get("z", 0.0)
    distance = (x**2 + y**2 + z**2) ** 0.5
    raw_vel = coords.get("velocity", 0.0)

    return LiveProbeData(
        probe_id=found["id"],
        satId=found["id"],
        name=found["name"],
        target_body=target_key,
        timestamp="LIVE",
        x=float(x),
        y=float(y),
        z=float(z),
        velocity=f"{raw_vel:.2f} km/s" if isinstance(raw_vel, (int, float)) else str(raw_vel),
        distance_km=round(distance, 2),
        inclination=found.get("inclination", "51.64°"),
        period=found.get("period", "92.68 min"),
        raw_status="Active"
    )