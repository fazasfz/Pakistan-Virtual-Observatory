import csv
import json
import math
import os

# Configuration for 3D model coordinates
MODEL_RADIUS = 1.0  
ROTATION_OFFSET_DEG = 0  

def lat_long_to_xyz(lat_deg, long_deg, radius, rotation_offset_deg):
    lat = math.radians(lat_deg)
    lon = math.radians(long_deg + rotation_offset_deg)
    x = radius * math.cos(lat) * math.cos(lon)
    y = radius * math.sin(lat)
    z = radius * math.cos(lat) * math.sin(lon)
    return x, y, z

import pandas as pd
import re

def parse_usgs_csv(csv_path):
    features = []
    
    df = pd.read_csv(csv_path)
    df.columns = [re.sub(r'\s+', ' ', col).strip() for col in df.columns]
    
    for _, row in df.iterrows():
        try:
            name = row.get('Feature Name')
            lat_str = row.get('Center Latitude')
            lon_str = row.get('Center Longitude')
            diam_str = row.get('Diameter')
            feature_type = row.get('Feature Type')
            origin = row.get('Origin', '')
            
            if pd.isna(name) or pd.isna(lat_str) or pd.isna(lon_str):
                continue
                
            lat = float(lat_str)
            lon = float(lon_str)
            diameter = float(diam_str) if pd.notna(diam_str) else 0.0
            
            # Clean up category (e.g. "Crater, craters" -> "Crater")
            category = str(feature_type).split(',')[0].strip() if pd.notna(feature_type) else "Unknown"
            origin_str = str(origin).strip('";“”\u201c\u201d').strip() if pd.notna(origin) else ""
            name_str = str(name)
            
            # Visibility logic
            naked_eye = diameter >= 100.0
            binoculars = diameter >= 20.0
            telescope = True
            
            # Hotspot logic (for 3D viewer)
            x, y, z = lat_long_to_xyz(lat, lon, MODEL_RADIUS, ROTATION_OFFSET_DEG)
            length = math.sqrt(x**2 + y**2 + z**2)
            nx, ny, nz = x / length, y / length, z / length
            
            feature = {
                "id": name_str.lower().replace(" ", "_"),
                "name": name_str,
                "category": category,
                "type": category,
                "description": origin_str,
                "latitude": lat,
                "longitude": lon,
                "diameter": diameter,
                "visibility": {
                    "naked_eye": naked_eye,
                    "binoculars": binoculars,
                    "telescope": telescope
                },
                "modelPosition": f"{x:.4f} {y:.4f} {z:.4f}",
                "modelNormal": f"{nx:.4f} {ny:.4f} {nz:.4f}"
            }
            features.append(feature)
        except Exception:
            continue
            
    return features

def main():
    base_dir = os.path.join("app", "modules", "lunar_observatory", "data")
    csv_path = os.path.join(base_dir, "moon_features.csv")
    full_json_path = os.path.join(base_dir, "lunar_features_full.json")
    curated_json_path = os.path.join(base_dir, "lunar_features_curated.json")
    
    if not os.path.exists(csv_path):
        print(f"Error: Could not find {csv_path}")
        print("Please download the CSV from USGS Advanced Search and place it there.")
        return
        
    print("Parsing USGS Gazetteer CSV...")
    features = parse_usgs_csv(csv_path)
    print(f"Successfully parsed {len(features)} features.")
    
    # Sort by diameter descending so we can easily pick the most prominent ones
    features.sort(key=lambda x: x["diameter"], reverse=True)
    
    # Save the full dataset
    with open(full_json_path, 'w', encoding='utf-8') as f:
        json.dump(features, f, indent=2)
    print(f"Saved {full_json_path}")
    
    # Create the curated dataset (top 100 largest features + specific famous ones)
    famous_names = {"Tycho", "Copernicus", "Plato", "Aristarchus", "Kepler", "Tranquillitatis", "Crisium", "Serenitatis"}
    curated_features = []
    
    # First add the famous ones
    for f in features:
        if any(name in f["name"] for name in famous_names):
            curated_features.append(f)
            
    # Then fill up to 100 with the largest features
    for f in features:
        if len(curated_features) >= 100:
            break
        if f not in curated_features:
            curated_features.append(f)
            
    with open(curated_json_path, 'w', encoding='utf-8') as f:
        json.dump(curated_features, f, indent=2)
    print(f"Saved {curated_json_path} ({len(curated_features)} features)")

if __name__ == "__main__":
    main()
