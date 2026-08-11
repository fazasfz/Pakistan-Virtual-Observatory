from pydantic import BaseModel
from typing import Optional, List


class ObjectInfo(BaseModel):
    name: str
    type: Optional[str] = None
    ra: Optional[float] = None
    dec: Optional[float] = None
    redshift: Optional[float] = None
    error: Optional[str] = None


class ObjectImage(BaseModel):
    mission: str
    instrument: str
    target: str


class ObjectImagesResponse(BaseModel):
    results: List[ObjectImage] = []
    error: Optional[str] = None