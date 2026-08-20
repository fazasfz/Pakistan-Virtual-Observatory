from typing import List, Optional

from pydantic import BaseModel


class ObjectInfo(BaseModel):
    """Every field except `name` is optional on purpose.

    Different object classes populate different fields: a nebula has no
    redshift, a galaxy has no spectral type, and older astroquery versions
    don't expose some of these at all. Missing values are normal here, not
    errors — making any of them required would 500 on valid objects.
    """

    name: str
    type: Optional[str] = None
    all_types: Optional[str] = None
    aliases: List[str] = []
    ra: Optional[float] = None
    dec: Optional[float] = None
    magnitude: Optional[float] = None
    magnitude_b: Optional[float] = None
    spectral_type: Optional[str] = None
    morphology: Optional[str] = None
    size_arcmin: Optional[float] = None
    redshift: Optional[float] = None
    radial_velocity: Optional[float] = None
    distance: Optional[float] = None
    distance_unit: Optional[str] = None


class ObjectImage(BaseModel):
    mission: Optional[str] = None
    instrument: Optional[str] = None
    target: Optional[str] = None


class ObjectImagesResponse(BaseModel):
    results: List[ObjectImage] = []
    error: Optional[str] = None


class CoverageRequest(BaseModel):
    hips_id: str
    ra: float
    dec: float


class CoverageResponse(BaseModel):
    coverage: str
    