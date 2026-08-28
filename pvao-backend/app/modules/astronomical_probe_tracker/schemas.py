from pydantic import BaseModel
from typing import List, Optional, Union

class ProbeBasicInfo(BaseModel):
    id: str
    name: str
    horizons_id: str
    norad_id: Optional[str] = None
    inclination: Optional[str] = "N/A"
    period: Optional[str] = "N/A"

class LiveProbeData(BaseModel):
    probe_id: str
    satId: Optional[str] = None
    name: str
    target_body: str
    timestamp: str
    x: float
    y: float
    z: float
    vx: Optional[float] = 0.0
    vy: Optional[float] = 0.0
    vz: Optional[float] = 0.0
    velocity: Union[float, str] = "0.00 km/s"
    velocity_kms: Optional[float] = 0.0
    velocity_kmh: Optional[float] = 0.0
    distance_km: Optional[float] = 0.0
    orbital_radius_km: Optional[float] = 0.0
    altitude_km: Optional[float] = 0.0
    inclination: Optional[str] = "N/A"
    inclination_deg: Optional[float] = 0.0
    sub_sat_lat: Optional[float] = 0.0
    sub_sat_lon: Optional[float] = 0.0
    owlt_sec: Optional[float] = 0.0
    rtlt_sec: Optional[float] = 0.0
    apogee_km: Optional[float] = 0.0
    perigee_km: Optional[float] = 0.0
    coord_frame: Optional[str] = "ICRF / Relative"
    mission_age: Optional[str] = "N/A"
    launch_date: Optional[str] = "N/A"
    period: Optional[str] = "N/A"
    raw_status: str

class ProbeListResponse(BaseModel):
    target: str
    probes: List[ProbeBasicInfo]