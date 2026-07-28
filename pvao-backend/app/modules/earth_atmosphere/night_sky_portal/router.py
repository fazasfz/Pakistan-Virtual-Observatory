from fastapi import APIRouter, HTTPException
from app.modules.earth_atmosphere.night_sky_portal.service import night_sky_service

router = APIRouter()

@router.get("/today")
async def get_today_sky():
    """
    Returns today's sky image/data (APOD).
    """
    try:
        data = await night_sky_service.get_todays_sky_image()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
