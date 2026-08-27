from fastapi import APIRouter, HTTPException
import httpx
import re
import math
from datetime import datetime, timezone, timedelta
from .constants import PROBE_CATALOG
from .schemas import LiveProbeData

router = APIRouter()

HORIZONS_API = "https://ssd.jpl.nasa.gov/api/horizons.api"

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
    target_key = target.lower().strip()
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
    
    center_code = CENTER_MAP.get(target_key, "500@10" if target_key == "sun" else "500@399")
    horizons_id = found.get("horizons_id", found["id"])

    # Construct precise URL parameters expected by NASA JPL Horizons
    now = datetime.now(timezone.utc)
    start_str = now.strftime("%Y-%m-%d %H:%M")
    stop_str = (now + timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M")
    
    url = (
        f"{HORIZONS_API}?format=json"
        f"&COMMAND=%27{horizons_id}%27"
        f"&OBJ_DATA=NO"
        f"&MAKE_EPHEM=YES"
        f"&EPHEM_TYPE=VECTORS"
        f"&CENTER=%27{center_code}%27"
        f"&START_TIME=%27{start_str}%27"
        f"&STOP_TIME=%27{stop_str}%27"
        f"&STEP_SIZE=%271m%27"
        f"&VEC_TABLE=%272%27"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url)
            res.raise_for_status()
            raw_json = res.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA Horizons API unreachable: {str(e)}")

    text_result = raw_json.get("result", "")
    
    if "$$SOE" not in text_result or "$$EOE" not in text_result:
        raise HTTPException(
            status_code=502, 
            detail="NASA JPL Horizons API Error: Output payload missing $$SOE vector block."
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
            detail="Failed to parse live position vectors (X, Y, Z) from NASA JPL response."
        )

    x = float(x_m.group(1))
    y = float(y_m.group(1))
    z = float(z_m.group(1))
    distance = math.sqrt(x**2 + y**2 + z**2)

    # Compute magnitude velocity vector if components are returned
    if vx_m and vy_m and vz_m:
        vx, vy, vz = float(vx_m.group(1)), float(vy_m.group(1)), float(vz_m.group(1))
        vel_val = math.sqrt(vx**2 + vy**2 + vz**2)
        vel_str = f"{vel_val:.2f} km/s"
    else:
        vel_str = "N/A"

    current_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    return LiveProbeData(
        probe_id=found["id"],
        satId=found["id"],
        name=found["name"],
        target_body=target_key,
        timestamp=current_utc,
        x=round(x, 2),
        y=round(y, 2),
        z=round(z, 2),
        velocity=vel_str,
        distance_km=round(distance, 2),
        inclination=found.get("inclination", "N/A"),
        period=found.get("period", "N/A"),
        raw_status="Active (NASA JPL Horizons Live)"
    )