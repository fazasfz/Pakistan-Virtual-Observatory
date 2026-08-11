from pydantic import BaseModel
from typing import List, Dict, Any

class LiveImagesSchema(BaseModel):
    aia_171: str
    aia_304: str
    hmi_mag: str
    lasco_c3: str
    aia_131: str  # Add this field!

class SolarTelemetryResponse(BaseModel):
    solar_wind_speed: float
    proton_density: float
    xray_flux: str
    sunspot_count: int
    timestamp_pkt: str
    active_regions: List[Dict[str, Any]]
    live_images: LiveImagesSchema
