import React from 'react';
import { X } from 'lucide-react';
import VisibilityWidget from '../VisibilityWidget/VisibilityWidget';
import styles from './FeatureDetailPanel.module.css';

const FeatureDetailPanel = ({ feature, nearbyFeatures, onClose, onSelectFeature }) => {
  const isOpen = !!feature;

  return (
    <div className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOpen : ''}`}>
      {feature ? (
        <>
          <div className={styles.drawerHeader}>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>{feature.name}</h2>
              <span className={styles.categoryTag}>{feature.category}</span>
            </div>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close panel">
              <X size={20} />
            </button>
          </div>

          <div className={styles.drawerContent}>
            <p className={styles.description}>{feature.description}</p>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Coordinates & Size</h3>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Latitude</span>
                <span className={styles.dataValue}>{feature.latitude.toFixed(2)}°</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Longitude</span>
                <span className={styles.dataValue}>{feature.longitude.toFixed(2)}°</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Diameter</span>
                <span className={styles.dataValue}>{feature.diameter.toFixed(1)} km</span>
              </div>
            </div>

            {feature.visibility && (
              <VisibilityWidget visibility={feature.visibility} />
            )}

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Nearby Features</h3>
              {nearbyFeatures && nearbyFeatures.length > 0 ? (
                <div className={styles.nearbyList}>
                  {nearbyFeatures.map(nearby => (
                    <div 
                      key={nearby.id} 
                      className={styles.nearbyItem}
                      onClick={() => onSelectFeature(nearby.id)}
                    >
                      <span className={styles.nearbyName}>{nearby.name}</span>
                      <span className={styles.nearbyDist}>{nearby.distance_km} km</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.dataLabel}>No nearby features found.</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>Select a feature to view details</div>
      )}
    </div>
  );
};

export default FeatureDetailPanel;
