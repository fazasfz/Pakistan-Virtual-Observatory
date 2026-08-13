from pydantic import BaseModel
from typing import List, Optional

class ProbeBasicInfo(BaseModel):
    id: str
    name: str
    horizons_id: str

class LiveProbeData(BaseModel):
    probe_id: str
    name: str
    target_body: str
    timestamp: str
    x: float
    y: float
    z: float
    velocity: Optional[float] = 0.0
    distance_km: Optional[float] = 0.0
    raw_status: str

class ProbeListResponse(BaseModel):
    target: str
    probes: List[ProbeBasicInfo]