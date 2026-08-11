import React, { useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LunarMap2D.module.css';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MOON_BOUNDS = [[-90, -180], [90, 180]];

// Component to handle flying to selected feature
function MapController({ selectedFeature }) {
  const map = useMap();
  useEffect(() => {
    if (selectedFeature && selectedFeature.latitude !== undefined && selectedFeature.longitude !== undefined) {
      map.flyTo([selectedFeature.latitude, selectedFeature.longitude], 6, {
        duration: 1.5,
      });
    }
  }, [selectedFeature, map]);
  return null;
}

export default function LunarMap2D({ viewMode, features, selectedFeature, onSelectFeature }) {
  
  // Custom marker icon to match our theme
  const customIcon = new L.DivIcon({
    className: styles.customMarker,
    html: `<div class="${styles.markerPulse}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className={styles.mapContainer}>
      <MapContainer 
        center={[0, 0]} 
        zoom={2} 
        minZoom={2}
        maxZoom={10}
        crs={L.CRS.EPSG4326}
        className={styles.leafletMap}
        zoomControl={false}
        worldCopyJump={true}
      >
        <ImageOverlay
          url={`/assets/maps/${viewMode}.jpg`}
          bounds={MOON_BOUNDS}
        />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {features.map((f) => (
            <Marker 
              key={f.id} 
              position={[f.latitude, f.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelectFeature(f.id)
              }}
            >
              <Popup className={styles.popup}>
                <strong>{f.name}</strong><br/>
                {f.type} ({f.diameter}km)
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <MapController selectedFeature={selectedFeature} />
      </MapContainer>
    </div>
  );
}
