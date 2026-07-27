from fastapi import APIRouter, HTTPException

# Use relative imports (..) to step up from api/ to app/
from ..models.astro_object import AstroObject
from ..services.visibility import compute_visibility

router = APIRouter(prefix="/api/night-sky", tags=["night-sky"])


@router.get("/objects")
async def get_objects():
    objects = await AstroObject.find_all().to_list()
    results = []
    for obj in objects:
        obj_dict = obj.model_dump()
        visibility = compute_visibility(obj_dict)
        results.append({**obj_dict, **visibility})
    return results


@router.get("/objects/{object_id}")
async def get_object(object_id: str):
    obj = await AstroObject.find_one(AstroObject.object_id == object_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Object not found")
    obj_dict = obj.model_dump()
    visibility = compute_visibility(obj_dict)
    return {**obj_dict, **visibility}