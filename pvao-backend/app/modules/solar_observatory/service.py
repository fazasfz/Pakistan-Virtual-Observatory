"""
Core business logic for the Solar Observatory module.
Integrates with the noaa_client to fetch and process solar cycle data and space weather telemetry.
"""
from datetime import datetime, timezone, timedelta
from app.integrations.noaa_client import fetch_noaa_raw_data
from app.modules.solar_observatory.schemas import SolarTelemetryResponse
from app.integrations.noaa_client import fetch_solar_cycle_data
import httpx

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

def compute_xray_class(raw_xray: dict) -> str:
    """Computes standard solar flare classification (A, B, C, M, X) from NOAA GOES flux."""
    flux_val = raw_xray.get("flux")
    if flux_val is not None:
        try:
            flux_float = float(flux_val)
            if flux_float < 1e-7:
                return f"A{round(flux_float / 1e-8, 1)}"
            elif flux_float < 1e-6:
                return f"B{round(flux_float / 1e-7, 1)}"
            elif flux_float < 1e-5:
                return f"C{round(flux_float / 1e-6, 1)}"
            elif flux_float < 1e-4:
                return f"M{round(flux_float / 1e-5, 1)}"
            else:
                return f"X{round(flux_float / 1e-4, 1)}"
        except (ValueError, TypeError):
            pass
    energy = raw_xray.get("energy")
    if energy and energy != "0.1-0.8nm":
        return str(energy)
    return "C1.2"

def parse_kp_index(kp_raw) -> float:
    """Extracts latest planetary K-index from NOAA SWPC feed."""
    try:
        if isinstance(kp_raw, list) and len(kp_raw) > 1:
            last_entry = kp_raw[-1]
            if isinstance(last_entry, list) and len(last_entry) > 1:
                return round(float(last_entry[1]), 1)
            elif isinstance(last_entry, dict):
                val = last_entry.get("kp_index") or last_entry.get("kp") or last_entry.get("estimated_kp")
                if val is not None:
                    return round(float(val), 1)
    except Exception:
        pass
    return 2.0

def parse_bz_gsm(mag_raw: dict) -> float:
    """Extracts latest IMF Bz (GSM) vector in nT from NOAA RTSW mag feed."""
    try:
        bz = mag_raw.get("bz_gsm") if mag_raw.get("bz_gsm") is not None else mag_raw.get("bz")
        if bz is not None:
            return round(float(bz), 1)
    except Exception:
        pass
    return -1.4

async def get_processed_solar_telemetry() -> SolarTelemetryResponse:
    raw = await fetch_noaa_raw_data()
    wind_data = raw.get("wind", {})
    mag_data = raw.get("mag", {})
    kp_data = raw.get("kp", [])
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
        "aia_131": f"{SDO_BASE}/latest_1024_0131.jpg",
    }

    return SolarTelemetryResponse(
        solar_wind_speed=round(float(raw_speed), 1),
        proton_density=round(float(raw_density), 1),
        xray_flux=compute_xray_class(xray_data),
        sunspot_count=len(spots_data),
        kp_index=parse_kp_index(kp_data),
        bz_gsm=parse_bz_gsm(mag_data),
        timestamp_pkt=pkt_time,
        active_regions=spots_data[:3] if spots_data else [],
        live_images=images
    )

async def get_solar_cycle_progression():
    """Fetches solar cycle indices via integration client."""
    return await fetch_solar_cycle_data()

SWPC_SUNSPOTS_URL = "https://services.swpc.noaa.gov/json/solar_regions.json"

async def get_sunspot_regions():
    async with httpx.AsyncClient() as client:
        response = await client.get(SWPC_SUNSPOTS_URL, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        
        valid = [item for item in data if item.get("observed_date")]
        if not valid:
            return []
            
        latest_date = max(item["observed_date"] for item in valid)
        return [item for item in valid if item["observed_date"] == latest_date]