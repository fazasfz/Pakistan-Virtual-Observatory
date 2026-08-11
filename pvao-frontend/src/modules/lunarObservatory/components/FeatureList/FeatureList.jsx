import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './FeatureList.module.css';

const FeatureList = ({ features, loading, selectedFeatureId, onSelectFeature }) => {
  if (loading) {
    return <div className={styles.emptyState}>Loading features...</div>;
  }

  if (features.length === 0) {
    return <div className={styles.emptyState}>No features found.</div>;
  }

  return (
    <div className={styles.listContainer}>
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`${styles.featureItem} ${selectedFeatureId === feature.id ? styles.featureItemActive : ''}`}
          onClick={() => onSelectFeature(feature.id)}
        >
          <div className={styles.featureInfo}>
            <span className={styles.featureName}>{feature.name}</span>
            <span className={styles.featureCategory}>{feature.category}</span>
          </div>
          <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
        </div>
      ))}
    </div>
  );
};

export default FeatureList;
