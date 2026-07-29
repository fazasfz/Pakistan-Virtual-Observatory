from fastapi import APIRouter
from app.modules.earth_atmosphere.sky_portal import router as sky_portal_router

api_router = APIRouter()

# Mount all module sub-routers
api_router.include_router(
    sky_portal_router.router,
    prefix="/earth-atmosphere/sky-portal",
    tags=["Sky Portal"]
)
# Add other routers here as they are developed
