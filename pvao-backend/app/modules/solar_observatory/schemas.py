"""
Pydantic data models for the Solar Observatory module.
Defines schemas for solar telemetry, x-ray fluxes, and live image URLs.
"""
from pydantic import BaseModel
from typing import List, Dict, Any,  Optional

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
    kp_index: Optional[float] = None
    bz_gsm: Optional[float] = None
    timestamp_pkt: str
    active_regions: List[Dict[str, Any]]
    live_images: LiveImagesSchema

class SunspotRegionSchema(BaseModel):
    region: Optional[int] = None
    location: Optional[str] = "N/A"
    observed_date: Optional[str] = "N/A"
    stationary: bool = False
    extent: Optional[int] = None
    mag_class: Optional[str] = "N/A"
    spot_class: Optional[str] = "N/A"
    area: Optional[int] = None

    class Config:
        from_attributes = True