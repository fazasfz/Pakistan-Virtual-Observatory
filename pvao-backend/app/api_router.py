"""
Central routing configuration for the backend API.
Aggregates and registers routers from all individual modules into a single v1 API router.
"""
from fastapi import APIRouter
from app.modules.deep_sky_explorer import router as deep_sky_explorer_router
from app.modules.lunar_observatory.router import router as lunar_observatory_router
from app.modules.solar_observatory.router import router as solar_observatory_router
from app.modules.astronomical_probe_tracker.router import router as probe_tracker_router
from app.modules.astro_copilot.router import router as astro_copilot_router
from app.integrations.nasa_client import nasa_client

api_router = APIRouter()

api_router.include_router(
    solar_observatory_router,
    prefix="/solar-observatory",
    tags=["Solar Observatory"]
)
api_router.include_router(lunar_observatory_router)

api_router.include_router(
    deep_sky_explorer_router.router,
    prefix="/deep-sky-explorer",
    tags=["Deep Sky Explorer"]
)

api_router.include_router(
    probe_tracker_router,
    prefix="/astronomical-probe-tracker",
    tags=["Astronomical Probe Tracker"]
)

api_router.include_router(
    astro_copilot_router,
    prefix="/astrocopilot",
    tags=["AstroCopilot"]
)

@api_router.get("/apod", tags=["APOD"])
async def get_apod():
    return await nasa_client.get_apod()