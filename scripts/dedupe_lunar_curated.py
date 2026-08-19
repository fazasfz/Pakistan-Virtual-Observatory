import json
import math
import os

def haversine_degrees(lat1, lon1, lat2, lon2):
    # Quick approximation for degrees distance (spherical distance)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return math.degrees(c)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'pvao-backend', 'app', 'modules', 'lunar_observatory', 'data', 'lunar_features_curated.json')
    
    with open(data_path, 'r', encoding='utf-8') as f:
        features = json.load(f)
        
    # Sort by diameter descending to prioritize larger features
    features.sort(key=lambda x: x.get('diameter', 0) or 0, reverse=True)
    
    min_distance = 12.0 # Minimum distance in degrees
    
    deduped = []
    
    for f in features:
        lat = f.get('latitude')
        lon = f.get('longitude')
        if lat is None or lon is None:
            continue
            
        # Check against already added features
        too_close = False
        for d in deduped:
            if haversine_degrees(lat, lon, d['latitude'], d['longitude']) < min_distance:
                too_close = True
                break
                
        if not too_close:
            deduped.append(f)
            
    print(f"Original curated count: {len(features)}")
    print(f"Deduped curated count: {len(deduped)}")
    
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(deduped, f, indent=2)

if __name__ == '__main__':
    main()
