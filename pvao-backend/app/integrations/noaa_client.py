"""
Integration client for NOAA Space Weather Prediction Center (SWPC) APIs.
Used by the Solar Observatory service to fetch live solar wind, x-ray flux, and solar cycle data.
"""
import httpx
from typing import Dict, Any, List

NOAA_SOLAR_WIND_URL = "https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json"
NOAA_XRAY_FLUX_URL = "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json"
NOAA_SUNSPOTS_URL = "https://services.swpc.noaa.gov/json/solar_regions.json"
NOAA_SOLAR_CYCLE_URL = "https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json"

async def fetch_noaa_raw_data() -> Dict[str, Any]:
    """Fetches raw telemetry data from NOAA SWPC endpoints."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            wind_res = await client.get(NOAA_SOLAR_WIND_URL)
            wind_data = wind_res.json()[-1] if wind_res.status_code == 200 else {}

            xray_res = await client.get(NOAA_XRAY_FLUX_URL)
            xray_data = xray_res.json()[-1] if xray_res.status_code == 200 else {}

            spots_res = await client.get(NOAA_SUNSPOTS_URL)
            spots_data = spots_res.json() if spots_res.status_code == 200 else []

            return {
                "wind": wind_data,
                "xray": xray_data,
                "sunspots": spots_data
            }
        except Exception:
            return {"wind": {}, "xray": {}, "sunspots": []}

async def fetch_solar_cycle_data() -> List[Dict[str, Any]]:
    """Fetches live observed solar cycle progression indices from NOAA."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(NOAA_SOLAR_CYCLE_URL)
            return response.json() if response.status_code == 200 else []
        except Exception:
            return []