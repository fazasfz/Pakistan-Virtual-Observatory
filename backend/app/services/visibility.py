from datetime import datetime
from astropy.time import Time
from astropy.coordinates import EarthLocation, get_body, AltAz, SkyCoord
import astropy.units as u

# Islamabad coordinates
ISLAMABAD_LOC = EarthLocation(lat=33.6844, lon=73.0479, height=500)

STATIC_COORDS = {
    "perseids": {"ra": 46.0, "dec": 58.0, "mag": None},
    "geminids": {"ra": 112.0, "dec": 33.0, "mag": None},
    "orion": {"ra": 82.5, "dec": 0.0, "mag": None},
    "ursa_major": {"ra": 160.0, "dec": 55.0, "mag": None},
    "scorpius": {"ra": 252.5, "dec": -30.0, "mag": None},
    "milky_way_core": {"ra": 266.25, "dec": -29.0, "mag": None},
}

def compute_visibility(obj: dict) -> dict:
    rule = obj.get("timing_rule", {})
    r_type = rule.get("type")
    now = datetime.now()
    t = Time(now)
    
    result = {
        "visible_now": None,
        "alt": None,
        "az": None,
        "ra": None,
        "dec": None,
        "magnitude": None,
        "rise_set_time": None
    }
    
    body_name = obj.get("object_id", "").lower()

    if r_type == "ephemeris":
        try:
            body = get_body(body_name, t, ISLAMABAD_LOC)
            altaz = body.transform_to(AltAz(obstime=t, location=ISLAMABAD_LOC))
            
            result["alt"] = round(altaz.alt.value, 2)
            result["az"] = round(altaz.az.value, 2)
            result["ra"] = round(body.ra.value, 2)
            result["dec"] = round(body.dec.value, 2)
            result["visible_now"] = bool(altaz.alt.value > 0)
            
            # Simple mock magnitudes for planets/moon as get_body doesn't provide magnitude directly without more complex modules
            mags = {"moon": -12.6, "venus": -4.4, "mars": 0.5, "jupiter": -2.2, "saturn": 0.4, "mercury": 0.0}
            result["magnitude"] = mags.get(body_name, 0.0)
            
            return result
        except Exception:
            pass

    # For static/seasonal/date_range objects, we can still compute alt/az if we have RA/Dec
    if body_name in STATIC_COORDS:
        try:
            coords = STATIC_COORDS[body_name]
            sc = SkyCoord(ra=coords["ra"]*u.deg, dec=coords["dec"]*u.deg, frame='icrs')
            altaz = sc.transform_to(AltAz(obstime=t, location=ISLAMABAD_LOC))
            result["ra"] = coords["ra"]
            result["dec"] = coords["dec"]
            result["alt"] = round(altaz.alt.value, 2)
            result["az"] = round(altaz.az.value, 2)
            result["magnitude"] = coords["mag"]
            # visibility might be overridden by specific rules, but basic altitude visibility:
            result["visible_now"] = bool(altaz.alt.value > 0)
        except Exception:
            pass
            
    # Apply original visibility rules if they override the basic altitude check
    if r_type == "seasonal":
        result["visible_now"] = bool(now.month in rule.get("best_months", []))
    elif r_type == "date_range":
        start_m, start_d = map(int, rule.get("start", "01-01").split("-"))
        end_m, end_d = map(int, rule.get("end", "12-31").split("-"))
        start_date = now.replace(month=start_m, day=start_d, hour=0, minute=0, second=0)
        end_date = now.replace(month=end_m, day=end_d, hour=23, minute=59, second=59)
        if end_date < start_date:
            visible = now >= start_date or now <= end_date
        else:
            visible = start_date <= now <= end_date
        result["visible_now"] = bool(visible)
        
    return result
