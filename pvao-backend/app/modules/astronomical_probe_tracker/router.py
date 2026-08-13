from fastapi import APIRouter, HTTPException
from typing import Dict, List
from .constants import PROBE_CATALOG
from .schemas import ProbeBasicInfo, LiveProbeData
from .service import fetch_horizons_ephemeris, parse_vector_data

router = APIRouter()

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
        raise HTTPException(status_code=404, detail="Target body not supported")
    return {"target": target_key, "probes": PROBE_CATALOG[target_key]}

@router.get("/live/{target}/{probe_id}", response_model=LiveProbeData)
async def get_live_probe_telemetry(target: str, probe_id: str):
    target_key = target.lower()
    probes = PROBE_CATALOG.get(target_key, [])
    found = next((p for p in probes if p["id"] == probe_id or p["horizons_id"] == probe_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Probe not found")
    
    center_code = CENTER_MAP.get(target_key, "500@399")
    horizons_raw = await fetch_horizons_ephemeris(found["horizons_id"], center_code)
    coords = parse_vector_data(horizons_raw, found["id"])
    return LiveProbeData(
        probe_id=found["id"],
        name=found["name"],
        target_body=target_key,
        timestamp="LIVE",
        x=coords["x"],
        y=coords["y"],
        z=coords["z"],
        velocity=0.0,
        distance_km=(coords["x"]**2 + coords["y"]**2 + coords["z"]**2)**0.5,
        raw_status="Active"
    )