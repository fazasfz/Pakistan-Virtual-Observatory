from fastapi import APIRouter
from app.modules.earth_atmosphere.night_sky_portal import router as night_sky_portal_router

api_router = APIRouter()

# Mount all module sub-routers
api_router.include_router(
    night_sky_portal_router.router,
    prefix="/earth-atmosphere/night-sky-portal",
    tags=["Night Sky Portal"]
)
# Add other routers here as they are developed
