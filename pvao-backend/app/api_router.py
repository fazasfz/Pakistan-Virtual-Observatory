from fastapi import APIRouter
from app.modules.earth_atmosphere.sky_portal import router as sky_portal_router
from app.modules.intelligent_core.astro_copilot.router import router as astro_copilot_router
from app.modules.lunar_observatory.router import router as lunar_observatory_router

api_router = APIRouter()

# Mount all module sub-routers
api_router.include_router(
    sky_portal_router.router,
    prefix="/earth-atmosphere/sky-portal",
    tags=["Sky Portal"]
)
api_router.include_router(astro_copilot_router)
api_router.include_router(lunar_observatory_router)

# Add other routers here as they are developed
