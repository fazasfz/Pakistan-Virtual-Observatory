import React from 'react';
import styles from './FeatureDetailsSection.module.css';
import SectionHeading from '../../../../components/common/SectionHeading/SectionHeading';
import FeatureDetailPanel from '../FeatureDetailPanel/FeatureDetailPanel';
import MoonWeight from '../MoonWeight/MoonWeight';
import SizeComparison from '../SizeComparison/SizeComparison';

const FeatureDetailsSection = ({ 
    selectedFeature, 
    nearbyFeatures, 
    onCloseFeature, 
    onSelectFeature,
    liveData,
    liveLoading
}) => {
    return (
        <section className={styles.detailsSection}>
            <SectionHeading>Feature Details & Visibility</SectionHeading>
            
            <div className={styles.twoColumnLayout}>
                <div className={styles.leftColumn}>
                    {selectedFeature ? (
                        <div className={styles.featurePanelWrapper}>
                            {/* FeatureDetailPanel is currently designed as a floating panel, we might need to override it to be static */}
                            <FeatureDetailPanel 
                                feature={selectedFeature} 
                                nearbyFeatures={nearbyFeatures} 
                                onClose={onCloseFeature}
                                onSelectFeature={onSelectFeature}
                            />
                        </div>
                    ) : (
                        <div className={styles.emptyStateCard}>
                            <p>Select a feature from the Explore section or map to see details.</p>
                        </div>
                    )}
                </div>
                
                <div className={styles.rightColumn}>
                    <SizeComparison diameterKm={selectedFeature?.diameter} />
                    <MoonWeight />
                </div>
            </div>
        </section>
    );
};

export default FeatureDetailsSection;
