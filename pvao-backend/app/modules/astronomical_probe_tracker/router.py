from fastapi import APIRouter, HTTPException
from typing import Dict

from .constants import PROBE_CATALOG
from .schemas import LiveProbeData, ProbeListResponse
from .service import get_live_probe_data

router = APIRouter()

@router.get("/targets")
def get_supported_targets():
    return {"targets": list(PROBE_CATALOG.keys())}

@router.get("/probes/{target}", response_model=ProbeListResponse)
def get_probes_for_target(target: str):
    target_key = target.lower().strip()
    if target_key not in PROBE_CATALOG:
        raise HTTPException(status_code=404, detail=f"Target body '{target_key}' not supported")
    return {"target": target_key, "probes": PROBE_CATALOG[target_key]}

@router.get("/live/{target}/{probe_id}", response_model=LiveProbeData)
async def get_live_probe_telemetry(target: str, probe_id: str):
    return await get_live_probe_data(target, probe_id)