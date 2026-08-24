"""
Integration client for NOAA Space Weather Prediction Center (SWPC) APIs.
Used by the Solar Observatory service to fetch live solar wind, x-ray flux, and solar cycle data.
"""
import httpx
from typing import Dict, Any, List

NOAA_SOLAR_WIND_URL = "https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json"
NOAA_MAG_URL = "https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json"
NOAA_KP_URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
NOAA_XRAY_FLUX_URL = "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json"
NOAA_SUNSPOTS_URL = "https://services.swpc.noaa.gov/json/solar_regions.json"
NOAA_SOLAR_CYCLE_URL = "https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json"

import asyncio

async def fetch_noaa_raw_data() -> Dict[str, Any]:
    """Fetches raw telemetry data concurrently from NOAA SWPC endpoints."""
    async with httpx.AsyncClient(timeout=6.0) as client:
        async def _safe_get(url):
            try:
                res = await client.get(url)
                if res.status_code == 200:
                    return res.json()
            except Exception:
                pass
            return None

        wind_raw, mag_raw, kp_raw, xray_raw, spots_raw = await asyncio.gather(
            _safe_get(NOAA_SOLAR_WIND_URL),
            _safe_get(NOAA_MAG_URL),
            _safe_get(NOAA_KP_URL),
            _safe_get(NOAA_XRAY_FLUX_URL),
            _safe_get(NOAA_SUNSPOTS_URL),
        )

        wind_data = wind_raw[-1] if isinstance(wind_raw, list) and wind_raw else (wind_raw or {})
        mag_data = mag_raw[-1] if isinstance(mag_raw, list) and mag_raw else (mag_raw or {})
        kp_data = kp_raw if isinstance(kp_raw, list) else []
        xray_data = xray_raw[-1] if isinstance(xray_raw, list) and xray_raw else (xray_raw or {})
        spots_data = spots_raw if isinstance(spots_raw, list) else []

        return {
            "wind": wind_data,
            "mag": mag_data,
            "kp": kp_data,
            "xray": xray_data,
            "sunspots": spots_data
        }

async def fetch_solar_cycle_data() -> List[Dict[str, Any]]:
    """Fetches live observed solar cycle progression indices from NOAA."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(NOAA_SOLAR_CYCLE_URL)
            return response.json() if response.status_code == 200 else []
        except Exception:
            return []