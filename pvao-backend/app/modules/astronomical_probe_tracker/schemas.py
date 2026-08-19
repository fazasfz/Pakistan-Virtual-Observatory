from pydantic import BaseModel
from typing import List, Optional, Union

class ProbeBasicInfo(BaseModel):
    id: str
    name: str
    horizons_id: str

class LiveProbeData(BaseModel):
    probe_id: str
    satId: Optional[str] = None
    name: str
    target_body: str
    timestamp: str
    x: float
    y: float
    z: float
    velocity: Union[float, str] = "0.00 km/s"
    distance_km: Optional[float] = 0.0
    inclination: Optional[str] = "N/A"
    period: Optional[str] = "N/A"
    raw_status: str

class ProbeListResponse(BaseModel):
    target: str
    probes: List[ProbeBasicInfo]