import React, { useState } from 'react';
import styles from './LunarObservatory.module.css';
import mobileStyles from './LunarObservatoryMobile.module.css';
import LunarSurfaceViewer from './components/LunarSurfaceViewer/LunarSurfaceViewer';
import MoonPhaseCard from './components/MoonPhaseCard/MoonPhaseCard';
import MoonVisibilityCard from './components/MoonVisibilityCard/MoonVisibilityCard';
import { useLunarData } from './hooks/useLunarData';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFeatureCatalogue } from './hooks/useFeatureCatalogue';
import LunarMap2D from './components/LunarMap2D/LunarMap2D';
import ViewModeSelector from './components/ViewModeSelector/ViewModeSelector';
import MoonPhaseSnapshot from './components/MoonPhaseSnapshot/MoonPhaseSnapshot';
import LunarFunFacts from './components/LunarFunFacts/LunarFunFacts';
import MoonRightNowGrid from './components/MoonRightNowGrid/MoonRightNowGrid';
import FeatureExploreSection from './components/FeatureExploreSection/FeatureExploreSection';
import FeatureDetailsSection from './components/FeatureDetailsSection/FeatureDetailsSection';

import { lunarFunFacts } from './components/LunarFunFacts/funFacts.data';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';

const LunarObservatory = () => {
  const { liveData, loading: liveLoading, error } = useLunarData();
  const { width } = useBreakpoint();
  const isMobile = width <= 1024;
  const [viewMode, setViewMode] = useState('Snapshot');

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
  } = useFeatureCatalogue(viewMode);

  const handleCloseFeature = React.useCallback(() => setSelectedFeatureId(null), [setSelectedFeatureId]);

  if (liveLoading || catalogLoading) {
    return <LoadingOverlay funFacts={lunarFunFacts.map(fact => fact.answer)} />;
  }

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
        <div className={styles.fullScreenHero}>
          {/* Main Viewer on the Left */}
          <div className={`${styles.viewerSection} ${isMobile ? mobileStyles.viewerSectionMobile : ''}`}>
            <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />
            
            {viewMode === 'Snapshot' && (
              <MoonPhaseSnapshot liveData={liveData} loading={liveLoading} />
            )}

            {viewMode === '3D' && (
              <LunarSurfaceViewer 
                liveData={liveData} 
                features={features} 
                loading={liveLoading || catalogLoading} 
                onSelectFeature={setSelectedFeatureId}
              />
            )}
            
            {['Terrain', 'Geographic', 'Shade'].includes(viewMode) && (
              <LunarMap2D
                viewMode={viewMode}
                features={features}
                selectedFeature={selectedFeature}
                onSelectFeature={setSelectedFeatureId}
              />
            )}
            
            <div className={styles.viewerFooter}>
              {viewMode === 'Snapshot' ? (
                <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--obsidian-light, #8a8a9a)', letterSpacing: '0.1em' }}>
                  2D SNAPSHOT (LIVE)
                </div>
              ) : <div />}
              <div className={styles.attribution}>
                <span>NASA Goddard SVS (3D model, ID:14959)</span>
                <span className={styles.separator}>·</span>
                <span>USGS Gazetteer of Planetary Nomenclature</span>
              </div>
            </div>
          </div>

          {/* Persistent Sidebar Card on the Right */}
          <aside className={`${styles.hudSidebar} ${isMobile ? mobileStyles.hudSidebarMobile : ''}`}>
            {error && <div className={styles.error}>Error loading lunar data</div>}
            <MoonPhaseCard data={liveData} loading={liveLoading} />
            <MoonVisibilityCard data={liveData} loading={liveLoading} />
          </aside>
        </div>
      </div>

      <MoonRightNowGrid setViewMode={setViewMode} />
      
      <FeatureExploreSection 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        features={features}
        catalogLoading={catalogLoading}
        selectedFeatureId={selectedFeature?.id}
        onSelectFeature={setSelectedFeatureId}
      />
      
      <FeatureDetailsSection 
        selectedFeature={selectedFeature}
        nearbyFeatures={nearbyFeatures}
        onCloseFeature={handleCloseFeature}
        onSelectFeature={setSelectedFeatureId}
        liveData={liveData}
        liveLoading={liveLoading}
      />

      <div className={styles.funFactsContainer}>
        <LunarFunFacts />
      </div>
    </div>
  );
};

export default LunarObservatory;
