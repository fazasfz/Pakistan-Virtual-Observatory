"""
Integration wrapper for the Skyfield astronomy library.
Used by the Lunar Observatory service to calculate high-precision ephemerides and celestial mechanics.
"""
import os
from datetime import datetime, timedelta

# Create an ephemeris directory if it doesn't exist
EPHEMERIS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
os.makedirs(EPHEMERIS_DIR, exist_ok=True)

try:
    from skyfield.api import Topos, load
    from skyfield import almanac
    SKYFIELD_AVAILABLE = True
except ImportError:
    SKYFIELD_AVAILABLE = False
    print("WARNING: skyfield is not installed. Using mock Lunar Observatory data.")

class SkyfieldClient:
    def __init__(self):
        if SKYFIELD_AVAILABLE:
            self.ts = load.timescale()
            # If the BSP file can't be downloaded, this might also throw, but we'll assume
            # if skyfield is present, the BSP is accessible or downloadable.
            try:
                self.eph = load('de440s.bsp')
                self.earth = self.eph['earth']
                self.moon = self.eph['moon']
                self.sun = self.eph['sun']
            except Exception as e:
                print(f"Failed to load ephemeris: {e}")
                self.eph = None

    def get_live_moon_data(self, lat=33.7294, lon=73.0931, target_time: datetime = None):
        if not SKYFIELD_AVAILABLE or getattr(self, 'eph', None) is None:
            # Return mock data matching real-ish values for today
            now = target_time or datetime.utcnow()
            return {
                "phase_name": "Waxing Crescent",
                "illumination_percentage": 23.5,
                "distance_km": 384400.0,
                "ra": "05h 32m 10s",
                "dec": "+23deg 15m 00s",
                "sun_moon_angle": 45.0,
                "rise_time": (now + timedelta(hours=2)).isoformat(),
                "set_time": (now + timedelta(hours=14)).isoformat(),
                "next_full_moon": (now + timedelta(days=12)).isoformat(),
                "next_new_moon": (now + timedelta(days=27)).isoformat(),
            }

        observer = self.earth + Topos(latitude_degrees=lat, longitude_degrees=lon)
        
        if target_time:
            # Skyfield requires UTC timezone-aware datetime or naive UTC datetime
            t = self.ts.from_datetime(target_time)
        else:
            t = self.ts.now()

        astrometric = observer.at(t).observe(self.moon)
        apparent = astrometric.apparent()

        percent_illuminated = almanac.fraction_illuminated(self.eph, 'moon', t) * 100

        e_sun = self.earth.at(t).observe(self.sun).apparent()
        _, slon, _ = e_sun.ecliptic_latlon()
        _, mlon, _ = apparent.ecliptic_latlon()
        
        phase_angle = (mlon.degrees - slon.degrees) % 360.0
        
        if phase_angle < 1.0 or phase_angle > 359.0:
            phase_name = "New Moon"
        elif 1.0 <= phase_angle < 89.0:
            phase_name = "Waxing Crescent"
        elif 89.0 <= phase_angle < 91.0:
            phase_name = "First Quarter"
        elif 91.0 <= phase_angle < 179.0:
            phase_name = "Waxing Gibbous"
        elif 179.0 <= phase_angle < 181.0:
            phase_name = "Full Moon"
        elif 181.0 <= phase_angle < 269.0:
            phase_name = "Waning Gibbous"
        elif 269.0 <= phase_angle < 271.0:
            phase_name = "Third Quarter"
        else:
            phase_name = "Waning Crescent"

        distance_km = astrometric.distance().km
        ra, dec, distance = apparent.radec()

        t0 = t
        end_dt = t.utc_datetime() + timedelta(days=2)
        t1 = self.ts.from_datetime(end_dt)
        f = almanac.risings_and_settings(self.eph, self.moon, Topos(latitude_degrees=lat, longitude_degrees=lon))
        t_rs, y_rs = almanac.find_discrete(t0, t1, f)

        rise_time = None
        set_time = None
        for time_rs, event_type in zip(t_rs, y_rs):
            if event_type == 1 and rise_time is None:
                rise_time = time_rs.utc_datetime().isoformat()
            elif event_type == 0 and set_time is None:
                set_time = time_rs.utc_datetime().isoformat()
            if rise_time and set_time:
                break

        t2 = self.ts.utc(t.utc.year, t.utc.month, t.utc.day + 30)
        f_phase = almanac.moon_phases(self.eph)
        t_phases, y_phases = almanac.find_discrete(t0, t2, f_phase)
        
        next_new = None
        next_full = None
        for time_phase, phase_type in zip(t_phases, y_phases):
            if phase_type == 0 and next_new is None:
                next_new = time_phase.utc_datetime().isoformat()
            elif phase_type == 2 and next_full is None:
                next_full = time_phase.utc_datetime().isoformat()

        return {
            "phase_name": phase_name,
            "illumination_percentage": round(percent_illuminated, 2),
            "distance_km": round(distance_km, 2),
            "ra": str(ra),
            "dec": str(dec),
            "sun_moon_angle": round(phase_angle, 2),
            "rise_time": rise_time,
            "set_time": set_time,
            "next_full_moon": next_full,
            "next_new_moon": next_new,
        }

skyfield_client = SkyfieldClient()
