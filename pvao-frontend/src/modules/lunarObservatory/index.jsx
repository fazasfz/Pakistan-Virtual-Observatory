import React, { useState } from 'react';
import styles from './LunarObservatory.module.css';
import mobileStyles from './LunarObservatoryMobile.module.css';
import LunarSurfaceViewer from './components/LunarSurfaceViewer/LunarSurfaceViewer';
import MoonPhaseCard from './components/MoonPhaseCard/MoonPhaseCard';
import MoonVisibilityCard from './components/MoonVisibilityCard/MoonVisibilityCard';
import { useLunarData } from './hooks/useLunarData';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFeatureCatalogue } from './hooks/useFeatureCatalogue';
import FeatureSearch from './components/FeatureSearch/FeatureSearch';
import CategoryFilters from './components/CategoryFilters/CategoryFilters';
import FeatureList from './components/FeatureList/FeatureList';
import FeatureDetailPanel from './components/FeatureDetailPanel/FeatureDetailPanel';
import MoonWeight from './components/MoonWeight/MoonWeight';

const LunarObservatory = () => {
  const { liveData, loading: liveLoading, error } = useLunarData();
  const { width } = useBreakpoint();
  const isMobile = width <= 1024;
  const [activeTab, setActiveTab] = useState('TELEMETRY');

  const {
    features,
    loading: catalogLoading,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    selectedFeature,
    setSelectedFeatureId,
    nearbyFeatures,
  } = useFeatureCatalogue();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.modNumber}>MOD.09</span>
          <h1>LUNAR OBSERVATORY</h1>
        </div>
        <div className={styles.statusGroup}>
          <span className={styles.statusDot}></span>
          <span>LIVE TELEMETRY (JPL DE440)</span>
        </div>
      </header>

      <div className={`${styles.mainLayout} ${isMobile ? mobileStyles.mainLayoutMobile : ''}`}>
        <div className={`${styles.viewerSection} ${isMobile ? mobileStyles.viewerSectionMobile : ''}`}>
          <LunarSurfaceViewer 
            liveData={liveData} 
            features={features} 
            loading={liveLoading || catalogLoading} 
            onSelectFeature={setSelectedFeatureId}
          />
          
          <FeatureDetailPanel 
            feature={selectedFeature} 
            nearbyFeatures={nearbyFeatures} 
            onClose={() => setSelectedFeatureId(null)}
            onSelectFeature={setSelectedFeatureId}
          />

          <div className={styles.attribution}>
            <span>NASA Goddard SVS (3D model, ID:14959)</span>
            <span className={styles.separator}>·</span>
            <span>USGS Gazetteer of Planetary Nomenclature</span>
          </div>
        </div>

        <aside className={`${styles.hudSidebar} ${isMobile ? mobileStyles.hudSidebarMobile : ''}`}>
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tab} ${activeTab === 'TELEMETRY' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('TELEMETRY')}
            >
              TELEMETRY
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'EXPLORE' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('EXPLORE')}
            >
              EXPLORE
            </button>
          </div>

          {error && <div className={styles.error}>Error loading lunar data</div>}
          
          {activeTab === 'TELEMETRY' && (
            <div className={styles.tabContent}>
              <MoonPhaseCard data={liveData} loading={liveLoading} />
              <MoonVisibilityCard data={liveData} loading={liveLoading} />
            </div>
          )}

          {activeTab === 'EXPLORE' && (
            <div className={styles.tabContent}>
              <FeatureSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <CategoryFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              <FeatureList 
                features={features} 
                loading={catalogLoading} 
                selectedFeatureId={selectedFeature?.id}
                onSelectFeature={setSelectedFeatureId} 
              />
              <MoonWeight />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default LunarObservatory;
