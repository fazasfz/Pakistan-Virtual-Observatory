from fastapi import APIRouter
from .service import get_object_info, get_object_images
from .schemas import ObjectInfo, ObjectImagesResponse

router = APIRouter(prefix="/api/deep-sky-explorer", tags=["Deep Sky Explorer"])


@router.get("/object/{object_name}", response_model=ObjectInfo)
def read_object_info(object_name: str):
    return get_object_info(object_name)


@router.get("/object/{object_name}/images", response_model=ObjectImagesResponse)
def read_object_images(object_name: str):
    result = get_object_images(object_name)
    if isinstance(result, dict) and "error" in result:
        return {"results": [], "error": result["error"]}
    return {"results": result}