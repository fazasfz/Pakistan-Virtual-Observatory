"""
Core business logic for the Deep Sky Explorer module.
Integrates with astroquery (SIMBAD and MAST) and CDS MocServer for object metadata, imagery, and HiPS coverage.
"""
import time
import re
import httpx
from astroquery.mast import Observations
from astroquery.simbad import Simbad

# =============================================================================
# SIMBAD object lookup
# =============================================================================
# NED is the NASA/IPAC *Extragalactic* Database — the Orion Nebula, Ring Nebula,
# Crab and Eagle are all inside the Milky Way, so they aren't in NED under any
# name. SIMBAD covers galactic and extragalactic objects alike, so one lookup
# serves all three categories.
#
# SIMBAD's votable field names changed substantially around astroquery 0.4.8, so
# each field is requested individually and failures are ignored. You get
# whatever your installed version supports rather than an all-or-nothing error.
# The startup print shows which ones registered.

_simbad = Simbad()
_simbad.TIMEOUT = 20

_WANTED_FIELDS = [
    "otype",          # object classification
    "otypes",         # all classifications
    "ids",            # every catalogue designation (M 42 / NGC 1976 / ...)
    "sp_type",        # spectral type, for stars
    "morphtype",      # morphological type, for galaxies
    "dimensions",     # angular size
    "dim",            # older name for the same
    "rvz_redshift",   # redshift
    "z_value",        # older name
    "rvz_radvel",     # radial velocity km/s
    "distance",       # distance with unit
    "mesdistance",    # newer name
    "flux(V)",        # visual magnitude, older syntax
    "V",              # visual magnitude, newer syntax
    "flux(B)",
    "B",
]

_REGISTERED = []
for _field in _WANTED_FIELDS:
    try:
        _simbad.add_votable_fields(_field)
        _REGISTERED.append(_field)
    except Exception:
        pass
print(f"[deep_sky] SIMBAD fields available: {_REGISTERED}")


def _col(row, *candidates):
    """First present, non-empty column from the candidates.

    Column names changed around astroquery 0.4.8 (lowercase 'main_id' instead of
    'MAIN_ID'), so accept either rather than pinning to one version.
    """
    for name in candidates:
        if name in row.colnames:
            value = row[name]
            if value is None:
                continue
            text = str(value).strip()
            if text and text not in ("--", "nan", "masked", "None"):
                return value
    return None


def _to_float(value):
    if value is None:
        return None
    try:
        f = float(value)
        return None if f != f else f      # drop NaN
    except (TypeError, ValueError):
        return None                       # sexagesimal string from older astroquery


def _to_str(value):
    return None if value is None else str(value).strip()

def _normalise(name: str) -> str:
    """SIMBAD wants 'M 16', not 'M16'. Insert a space between a catalogue
    prefix and its number so either spelling resolves."""
    m = re.fullmatch(r"\s*(M|NGC|IC|Mel|Cr)\s*(\d+)\s*", name, re.IGNORECASE)
    return f"{m.group(1).upper()} {m.group(2)}" if m else name.strip()

def get_object_info(object_name: str):
    """Classification, position and physical properties, via SIMBAD."""
    try:
        table = _simbad.query_object(_normalise(object_name))
    except Exception as e:
        return {"error": f"SIMBAD lookup failed for '{object_name}': {e}"}

    if table is None or len(table) == 0:
        return {"error": f"'{object_name}' was not found in SIMBAD."}

    row = table[0]

    # SIMBAD returns every designation in one pipe-separated string.
    raw_ids = _to_str(_col(row, "ids", "IDS"))
    aliases = [i.strip() for i in raw_ids.split("|")][:8] if raw_ids else []

    return {
        "name": _to_str(_col(row, "main_id", "MAIN_ID")) or object_name,
        "type": _to_str(_col(row, "otype", "OTYPE")) or "Unknown",
        "all_types": _to_str(_col(row, "otypes", "OTYPES")),
        "aliases": aliases,
        "ra": _to_float(_col(row, "ra", "RA")),
        "dec": _to_float(_col(row, "dec", "DEC")),
        "magnitude": _to_float(_col(row, "V", "FLUX_V", "flux(V)")),
        "magnitude_b": _to_float(_col(row, "B", "FLUX_B", "flux(B)")),
        "spectral_type": _to_str(_col(row, "sp_type", "SP_TYPE")),
        "morphology": _to_str(_col(row, "morphtype", "MORPH_TYPE")),
        "size_arcmin": _to_float(
            _col(row, "galdim_majaxis", "GALDIM_MAJAXIS", "dim_majaxis", "DIM_MAJAXIS")
        ),
        "redshift": _to_float(_col(row, "rvz_redshift", "Z_VALUE", "z_value")),
        "radial_velocity": _to_float(_col(row, "rvz_radvel", "RVZ_RADVEL")),
        "distance": _to_float(_col(row, "mesdistance.dist", "Distance_distance")),
        "distance_unit": _to_str(_col(row, "mesdistance.unit", "Distance_unit")),
    }


# =============================================================================
# MAST observations
# =============================================================================

def get_object_images(object_name: str, limit: int = 3):
    """Available observations of an object, via MAST."""
    try:
        obs_table = Observations.query_object(object_name)
        results = []
        for row in obs_table[:limit]:
            results.append({
                "mission": row["obs_collection"],
                "instrument": row["instrument_name"],
                "target": row["target_name"],
            })
        return results
    except Exception as e:
        return {"error": f"Could not find MAST data for '{object_name}': {str(e)}"}


# =============================================================================
# HiPS survey coverage
# =============================================================================
# Several surveys are not all-sky. GALEX in particular is a mosaic of circular
# 1.2-degree pointings with real gaps: it skips the Galactic plane and anything
# near a bright star, because the detector would be damaged. An uncovered field
# renders as an empty frame that looks like a rendering bug but is really
# "no data here".

_COVERAGE_CACHE: dict[tuple, tuple[str, float]] = {}
ALL_SKY = {"CDS/P/DSS2/color", "CDS/P/2MASS/K", "CDS/P/RASS"}


async def _mocserver_ids(client: httpx.AsyncClient, **params) -> list:
    resp = await client.get(
        "https://alasky.cds.unistra.fr/MocServer/query",
        params={"get": "id", "fmt": "json", **params},
    )
    resp.raise_for_status()
    data = resp.json()
    return data if isinstance(data, list) else []


async def check_coverage(hips_id: str, ra: float, dec: float) -> str:
    """Return 'covered', 'empty', or 'unknown'.

    'unknown' means the check itself failed or the survey id wasn't recognised.
    Callers should fail open and render the layer anyway — never hide real data
    because a third-party service blinked.
    """
    if hips_id in ALL_SKY:
        return "covered"

    key = (hips_id, round(ra, 1), round(dec, 1))
    hit = _COVERAGE_CACHE.get(key)
    if hit and time.monotonic() - hit[1] < 86400:
        return hit[0]

    full_id = hips_id if hips_id.startswith("CDS/") else f"CDS/{hips_id}"
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            # Does this collection exist at all?
            if not await _mocserver_ids(client, ID=full_id):
                return "unknown"

            # It exists. Does it overlap this position?
            overlap = await _mocserver_ids(
                client, ID=full_id, RA=f"{ra:.6f}", DEC=f"{dec:.6f}", SR="0.15"
            )
            result = "covered" if overlap else "empty"
    except Exception:
        return "unknown"

    _COVERAGE_CACHE[key] = (result, time.monotonic())
    return result