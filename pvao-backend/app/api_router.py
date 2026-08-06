from fastapi import APIRouter
<<<<<<< HEAD
from app.modules.earth_atmosphere.sky_portal import router as sky_portal_router
from app.modules.intelligent_core.astro_copilot.router import router as astro_copilot_router
=======
from app.modules.solar_observatory.router import router as solar_observatory_router
>>>>>>> 06ce9c4 (Refactor solar observatory module structure and update frontend components)

api_router = APIRouter()

api_router.include_router(
    solar_observatory_router,
    prefix="/solar-observatory",
    tags=["Solar Observatory"]
)
api_router.include_router(astro_copilot_router)

# Add other routers here as they are developed
