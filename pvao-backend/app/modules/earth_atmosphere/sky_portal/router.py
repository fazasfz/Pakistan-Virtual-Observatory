from fastapi import APIRouter, HTTPException
from app.modules.earth_atmosphere.sky_portal.service import sky_portal_service

router = APIRouter()

@router.get("/today")
async def get_today_sky():
    """
    Returns today's sky image/data (APOD).
    """
    try:
        data = await sky_portal_service.get_todays_sky_image()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
