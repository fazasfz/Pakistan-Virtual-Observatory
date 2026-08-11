import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import styles from './FeatureLabel.module.css';
import { MapPin } from 'lucide-react';

const FeatureLabel = ({ feature, position, onSelectFeature }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div 
        className={`${styles.labelContainer} ${hovered ? styles.hovered : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectFeature(feature.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.pin}>
          <MapPin size={16} />
        </div>
        
        {hovered && (
          <div className={styles.popover}>
            <div className={styles.popoverHeader}>
              <h4>{feature.name}</h4>
              <span className={styles.type}>{feature.category || feature.type}</span>
            </div>
            <div className={styles.coords}>
              Click for details
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

export default FeatureLabel;
