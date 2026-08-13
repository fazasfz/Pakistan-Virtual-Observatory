from fastapi import APIRouter
from app.modules.intelligent_core.astro_copilot.router import router as astro_copilot_router
from app.modules.deep_sky_explorer import router as deep_sky_explorer_router
from app.modules.lunar_observatory.router import router as lunar_observatory_router
from app.modules.solar_observatory.router import router as solar_observatory_router
from app.modules.astronomical_probe_tracker.router import router as probe_tracker_router


api_router = APIRouter()

api_router.include_router(
    solar_observatory_router,
    prefix="/solar-observatory",
    tags=["Solar Observatory"]
)
api_router.include_router(astro_copilot_router)
api_router.include_router(lunar_observatory_router)

api_router.include_router(
    deep_sky_explorer_router.router,
    prefix="/deep-sky-explorer",
    tags=["Deep Sky Explorer"]
)

# Add other routers here as they are developed
api_router.include_router(
    probe_tracker_router,
    prefix="/astronomical-probe-tracker",
    tags=["Astronomical Probe Tracker"]
)