import json
import os
import math
from app.integrations.skyfield_client import skyfield_client

# Load features from JSON
current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, 'data', 'lunar_features.json')
with open(json_path, 'r', encoding='utf-8') as f:
    LUNAR_FEATURES_DATA = json.load(f)

MOON_RADIUS_KM = 1737.4

def haversine_moon(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    return 2 * MOON_RADIUS_KM * math.asin(math.sqrt(a))

def get_live_data():
    return skyfield_client.get_live_moon_data()

def get_features(category: str = None):
    if category and category.lower() != "all":
        return [f for f in LUNAR_FEATURES_DATA if f.get('category', '').lower() == category.lower()]
    return LUNAR_FEATURES_DATA

def get_feature_by_id(feature_id: str):
    for f in LUNAR_FEATURES_DATA:
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
    for f in LUNAR_FEATURES_DATA:
        if f['id'] == feature_id:
            continue
        dist = haversine_moon(lat, lon, f['latitude'], f['longitude'])
        nearby.append({**f, "distance_km": round(dist, 1)})
        
    nearby.sort(key=lambda x: x['distance_km'])
    return nearby[:limit]
