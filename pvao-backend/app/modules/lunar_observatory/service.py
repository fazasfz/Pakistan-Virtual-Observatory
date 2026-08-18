"""
Core business logic for the Lunar Observatory module.
Integrates with the skyfield_client to compute live moon ephemerides and loads local feature datasets.
"""
import json
import os
import math
from app.integrations.skyfield_client import skyfield_client

current_dir = os.path.dirname(os.path.abspath(__file__))

def load_json(filename):
    path = os.path.join(current_dir, 'data', filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

LUNAR_FEATURES_FULL = load_json('lunar_features_full.json')
LUNAR_FEATURES_CURATED = load_json('lunar_features_curated.json')

# Fallback for when the new jsons are not yet generated
if not LUNAR_FEATURES_FULL or not LUNAR_FEATURES_CURATED:
    legacy_data = load_json('lunar_features.json')
    LUNAR_FEATURES_FULL = LUNAR_FEATURES_FULL or legacy_data
    LUNAR_FEATURES_CURATED = LUNAR_FEATURES_CURATED or legacy_data


MOON_RADIUS_KM = 1737.4

def haversine_moon(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    return 2 * MOON_RADIUS_KM * math.asin(math.sqrt(a))

def get_live_data(target_time=None):
    return skyfield_client.get_live_moon_data(target_time=target_time)

def get_features(category: str = None, dataset: str = "curated"):
    data = LUNAR_FEATURES_FULL if dataset == "full" else LUNAR_FEATURES_CURATED
    if category and category.lower() != "all":
        return [f for f in data if f.get('category', '').lower() == category.lower() or f.get('type', '').lower() == category.lower()]
    return data

def get_feature_by_id(feature_id: str):
    # Search in full dataset as it contains everything
    for f in LUNAR_FEATURES_FULL:
        if f.get('id') == feature_id:
            return f
    return None

def get_nearby_features(feature_id: str, limit: int = 5):
    feature = get_feature_by_id(feature_id)
    if not feature:
        return []
    
    lat = feature['latitude']
    lon = feature['longitude']
    
    nearby = []
    for f in LUNAR_FEATURES_FULL:
        if f['id'] == feature_id:
            continue
        dist = haversine_moon(lat, lon, f['latitude'], f['longitude'])
        nearby.append({**f, "distance_km": round(dist, 1)})
        
    nearby.sort(key=lambda x: x['distance_km'])
    return nearby[:limit]
