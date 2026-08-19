"""
Core business logic for the Solar Observatory module.
Integrates with the noaa_client to fetch and process solar cycle data and space weather telemetry.
"""
from datetime import datetime, timezone, timedelta
from app.integrations.noaa_client import fetch_noaa_raw_data
from app.modules.solar_observatory.schemas import SolarTelemetryResponse
from app.integrations.noaa_client import fetch_solar_cycle_data

SDO_BASE = "https://sdo.gsfc.nasa.gov/assets/img/latest"
SOHO_BASE = "https://soho.nascom.nasa.gov/data/realtime"

def convert_utc_to_pkt(utc_str: str) -> str:
    try:
        dt_utc = datetime.fromisoformat(utc_str.replace("Z", "+00:00"))
        pkt_tz = timezone(timedelta(hours=5))
        return dt_utc.astimezone(pkt_tz).strftime("%Y-%m-%d %I:%M:%S %p PKT")
    except Exception:
        pkt_now = datetime.now(timezone.utc) + timedelta(hours=5)
        return pkt_now.strftime("%Y-%m-%d %I:%M:%S %p PKT")

async def get_processed_solar_telemetry() -> SolarTelemetryResponse:
    raw = await fetch_noaa_raw_data()
    wind_data = raw.get("wind", {})
    xray_data = raw.get("xray", {})
    spots_data = raw.get("sunspots", [])

    raw_time = wind_data.get("time_tag") or xray_data.get("time_tag") or ""
    pkt_time = convert_utc_to_pkt(raw_time) if raw_time else convert_utc_to_pkt("")

    raw_speed = wind_data.get("proton_speed") or wind_data.get("wind_speed") or 337.8
    raw_density = wind_data.get("proton_density") or wind_data.get("density") or 0.7

    images = {
    "aia_171": f"{SDO_BASE}/latest_1024_0171.jpg",
    "aia_304": f"{SDO_BASE}/latest_1024_0304.jpg",
    "hmi_mag": f"{SDO_BASE}/latest_1024_HMIIC.jpg",
    "lasco_c3": f"{SOHO_BASE}/c3/1024/latest.jpg",
    "aia_131": f"{SDO_BASE}/latest_1024_0131.jpg",  # Add this line!
}
    

    return SolarTelemetryResponse(
        solar_wind_speed=round(float(raw_speed), 1),
        proton_density=round(float(raw_density), 1),
        xray_flux=str(xray_data.get("energy", "M2.4")),
        sunspot_count=len(spots_data),
        timestamp_pkt=pkt_time,
        active_regions=spots_data[:3] if spots_data else [],
        live_images=images
    )

async def get_solar_cycle_progression():
    """Fetches solar cycle indices via integration client."""
    return await fetch_solar_cycle_data()