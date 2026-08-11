from fastapi import APIRouter
from app.modules.intelligent_core.astro_copilot.router import router as astro_copilot_router
from app.modules.lunar_observatory.router import router as lunar_observatory_router
from app.modules.solar_observatory.router import router as solar_observatory_router

api_router = APIRouter()

api_router.include_router(
    solar_observatory_router,
    prefix="/solar-observatory",
    tags=["Solar Observatory"]
)
api_router.include_router(astro_copilot_router)
api_router.include_router(lunar_observatory_router)

# Add other routers here as they are developed
