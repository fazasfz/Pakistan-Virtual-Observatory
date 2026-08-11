import json
import math
import os

MODEL_RADIUS = 1.0  # placeholder — see calibration step below, this may need adjusting
ROTATION_OFFSET_DEG = 0  # placeholder — see calibration step below

def lat_long_to_xyz(lat_deg, long_deg, radius, rotation_offset_deg):
    lat = math.radians(lat_deg)
    lon = math.radians(long_deg + rotation_offset_deg)
    x = radius * math.cos(lat) * math.cos(lon)
    y = radius * math.sin(lat)
    z = radius * math.cos(lat) * math.sin(lon)
    return x, y, z

data_path = os.path.join("app", "modules", "lunar_observatory", "data", "lunar_features.json")

with open(data_path, "r") as f:
    features = json.load(f)

for feature in features:
    x, y, z = lat_long_to_xyz(feature["latitude"], feature["longitude"], MODEL_RADIUS, ROTATION_OFFSET_DEG)
    # normal = normalized position, since it's a sphere — same direction, unit length
    length = math.sqrt(x**2 + y**2 + z**2)
    nx, ny, nz = x / length, y / length, z / length

    feature["modelPosition"] = f"{x:.4f} {y:.4f} {z:.4f}"
    feature["modelNormal"] = f"{nx:.4f} {ny:.4f} {nz:.4f}"

with open(data_path, "w") as f:
    json.dump(features, f, indent=2)

print(f"Generated hotspot coordinates for {len(features)} features.")
