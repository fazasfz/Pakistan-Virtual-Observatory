"""
Defines the FastAPI route endpoints for the Solar Observatory module.
Exposes /telemetry and /cycle endpoints using the underlying service layer.
"""
# app/modules/solar_observatory/router.py

from fastapi import APIRouter
from app.modules.solar_observatory.schemas import SolarTelemetryResponse
from app.modules.solar_observatory.service import (
    get_processed_solar_telemetry,
    get_solar_cycle_progression,
)

router = APIRouter()

@router.get("/telemetry", response_model=SolarTelemetryResponse)
async def get_solar_telemetry():
    """Fetch live solar wind, x-ray flux, and sunspots in PKT."""
    return await get_processed_solar_telemetry()

@router.get("/cycle-data")
async def get_solar_cycle():
    """Fetch monthly solar cycle progression data from NOAA SWPC."""
    return await get_solar_cycle_progression()