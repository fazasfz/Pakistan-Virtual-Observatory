"""
Defines the FastAPI route endpoints for the Lunar Observatory module.
Provides /live-data and /features endpoints by depending on the service layer.
"""
from fastapi import APIRouter, Query, HTTPException
from datetime import datetime
from .schemas import LiveMoonData, LunarFeature
from .service import get_live_data, get_features, get_feature_by_id, get_nearby_features
from typing import List, Optional

router = APIRouter(prefix="/lunar-observatory", tags=["Lunar Observatory"])

@router.get("/live-data", response_model=LiveMoonData)
async def fetch_live_data(datetime_str: Optional[str] = Query(None, alias="datetime")):
    target_time = None
    if datetime_str:
        try:
            # Parse ISO 8601 string to aware datetime, then convert to UTC if needed
            # Remove 'Z' if present and replace with +00:00 for fromisoformat compatibility in older python
            dt_str = datetime_str.replace("Z", "+00:00")
            target_time = datetime.fromisoformat(dt_str)
            
            # Ensure it is tz aware
            if target_time.tzinfo is None:
                from datetime import timezone
                target_time = target_time.replace(tzinfo=timezone.utc)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid datetime format")
    return get_live_data(target_time=target_time)

@router.get("/features", response_model=List[LunarFeature])
async def fetch_features(category: Optional[str] = Query(None), dataset: str = Query("curated")):
    return get_features(category, dataset)

@router.get("/features/{feature_id}", response_model=LunarFeature)
async def fetch_feature(feature_id: str):
    feature = get_feature_by_id(feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return feature

@router.get("/features/{feature_id}/nearby", response_model=List[LunarFeature])
async def fetch_nearby_features(feature_id: str, limit: int = Query(5)):
    nearby = get_nearby_features(feature_id, limit)
    # Even if empty list, it's fine unless feature doesn't exist
    feature = get_feature_by_id(feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    return nearby
