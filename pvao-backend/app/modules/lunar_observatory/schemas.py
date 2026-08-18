"""
Pydantic data models for the Lunar Observatory module.
Defines the schema for LiveMoonData and LunarFeature API responses.
"""
from pydantic import BaseModel
from typing import List, Optional

class LiveMoonData(BaseModel):
    phase_name: str
    illumination_percentage: float
    distance_km: float
    ra: str
    dec: str
    sun_moon_angle: float
    rise_time: Optional[str]
    set_time: Optional[str]
    next_full_moon: Optional[str]
    next_new_moon: Optional[str]

class FeatureVisibility(BaseModel):
    naked_eye: bool
    binoculars: bool
    telescope: bool

class LunarFeature(BaseModel):
    id: str
    name: str
    category: str
    latitude: float
    longitude: float
    diameter: float
    description: str
    visibility: FeatureVisibility
    distance_km: Optional[float] = None
    modelPosition: Optional[str] = None
    modelNormal: Optional[str] = None
