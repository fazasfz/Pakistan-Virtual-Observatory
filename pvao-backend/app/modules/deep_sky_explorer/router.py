"""
Defines the FastAPI route endpoints for the Deep Sky Explorer module.
Exposes /object/{name}, /images, and /coverage endpoints using the service layer.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .service import get_object_info, get_object_images, check_coverage
from .schemas import ObjectInfo, ObjectImagesResponse

router = APIRouter(tags=["Deep Sky Explorer"])


@router.get("/object/{object_name}", response_model=ObjectInfo)
def read_object_info(object_name: str):
    result = get_object_info(object_name)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.get("/object/{object_name}/images", response_model=ObjectImagesResponse)
def read_object_images(object_name: str):
    result = get_object_images(object_name)
    if isinstance(result, dict) and "error" in result:
        return {"results": [], "error": result["error"]}
    return {"results": result}
class CoverageRequest(BaseModel):
    hips_id: str
    ra: float
    dec: float

@router.post("/coverage")
async def coverage(req: CoverageRequest):
    return {"coverage": await check_coverage(req.hips_id, req.ra, req.dec)}