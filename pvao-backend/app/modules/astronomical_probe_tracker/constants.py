"""
Static configuration and constants for the Astronomical Probe Tracker.
Defines the PROBE_CATALOG categorizing known space probes by their celestial targets.
"""
# Celestial target and probe registry
PROBE_CATALOG = {
    "earth": [
        {"id": "aura", "name": "Aura Satellite", "horizons_id": "-84", "norad_id": "28376"},
        {"id": "iss", "name": "International Space Station (ISS)", "horizons_id": "-125544", "norad_id": "25544"},
        {"id": "hubble", "name": "Hubble Space Telescope", "horizons_id": "-48", "norad_id": "20580"},
        {"id": "tess", "name": "TESS Observatory", "horizons_id": "-95", "norad_id": "43435"},
        {"id": "chandra", "name": "Chandra X-ray Observatory", "horizons_id": "-123", "norad_id": "25867"},
    ],
    "sun": [
        {"id": "parker", "name": "Parker Solar Probe", "horizons_id": "-96"},
        {"id": "solar_orbiter", "name": "Solar Orbiter", "horizons_id": "-144"},
        {"id": "voyager1", "name": "Voyager 1", "horizons_id": "-31"},
        {"id": "voyager2", "name": "Voyager 2", "horizons_id": "-32"},
    ],
    "moon": [
        {"id": "lro", "name": "Lunar Reconnaissance Orbiter (LRO)", "horizons_id": "-85"},
        {"id": "artemis1", "name": "Artemis I (Orion)", "horizons_id": "-143522"},
        {"id": "artemis2", "name": "Artemis II Probe", "horizons_id": "-143523"},
    ],
    "mars": [
        {"id": "mro", "name": "Mars Reconnaissance Orbiter (MRO)", "horizons_id": "-74"},
        {"id": "mars_odyssey", "name": "2001 Mars Odyssey", "horizons_id": "-53"},
    ]
}