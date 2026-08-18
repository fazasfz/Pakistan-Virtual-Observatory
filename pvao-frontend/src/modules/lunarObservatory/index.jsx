/**
 * Root entry point for the Lunar Observatory module.
 * Composes panels, viewers, and global layout state based on screen breakpoints.
 */
import React, { useState } from 'react';
import styles from './LunarObservatory.module.css';
import mobileStyles from './LunarObservatoryMobile.module.css';

import { useLunarData } from './hooks/useLunarData';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFeatureCatalogue } from './hooks/useFeatureCatalogue';

// 1. Moon Now Panel (Time Slider + Snapshot)
import TimeSliderView from './components/TimeSliderView/TimeSliderView';
import MoonPhaseSnapshot from './components/MoonPhaseSnapshot/MoonPhaseSnapshot';
import MoonPhaseCard from './components/MoonPhaseCard/MoonPhaseCard';

// 2. Lunar Phase Panel
import LunarPhasePanel from './components/LunarPhasePanel/LunarPhasePanel';

// 3. Lunar Surface Explorer
import FeatureExploreSection from './components/FeatureExploreSection/FeatureExploreSection';
import LunarMapLeaflet from './components/LunarMapLeaflet/LunarMapLeaflet';
import FeatureDetailsSection from './components/FeatureDetailsSection/FeatureDetailsSection';

// 4. Lunar Events Panel
import LunarEventsPanel from './components/LunarEventsPanel/LunarEventsPanel';

// 5. Lunar View Panel (3D Viewer)
import LunarSurfaceViewer from './components/LunarSurfaceViewer/LunarSurfaceViewer';
import ViewModeSelector from './components/ViewModeSelector/ViewModeSelector';

import LunarFunFacts from './components/LunarFunFacts/LunarFunFacts';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import { lunarFunFacts } from './components/LunarFunFacts/funFacts.data';

const LunarObservatory = () => {
  const [targetDate, setTargetDate] = useState(null);
  const { liveData, loading: liveLoading, error } = useLunarData(targetDate);
  const { width } = useBreakpoint();
  const isMobile = width <= 1024;
  const [viewMode, setViewMode] = useState('3D');

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

  if (liveLoading && !liveData && !catalogLoading) {
    return <LoadingOverlay funFacts={lunarFunFacts.map(fact => fact.answer)} themeColor="var(--lunar-blue)" />;
  }
  if (catalogLoading) {
    return <LoadingOverlay funFacts={lunarFunFacts.map(fact => fact.answer)} themeColor="var(--lunar-blue)" />;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>Error loading lunar data</div>}

      <div className={styles.mainLayout}>
        <div className={styles.fullScreenHero}>
          {/* Main 3D Viewer in the Center */}
          <div className={`${styles.viewerSection} ${isMobile ? mobileStyles.viewerSectionMobile : ''}`} style={{ width: '100%', height: '80vh', minHeight: '500px' }}>
            <LunarSurfaceViewer 
              liveData={liveData} 
              features={features} 
              loading={liveLoading || catalogLoading} 
              onSelectFeature={setSelectedFeatureId}
            />
          </div>
          
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%', padding: '0 2rem', marginTop: '2rem' }}>
        
        {/* 1. Moon Now Panel */}
        <section style={{ position: 'relative' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'sans-serif', fontSize: '24px', fontWeight: 'bold', color: 'var(--starlight)', textAlign: 'center' }}>LIVE LUNAR TELEMETRY</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <TimeSliderView targetDate={targetDate} setTargetDate={setTargetDate} />
              <div>
                <MoonPhaseSnapshot liveData={liveData} loading={liveLoading} />
              </div>
            </div>
            <div>
              <MoonPhaseCard data={liveData} loading={liveLoading} />
            </div>
          </div>
        </section>
        
        {/* 2. Lunar Phase Panel */}
        <section>
          <LunarPhasePanel liveData={liveData} loading={liveLoading} />
        </section>

        {/* 3. Lunar Surface Explorer */}
        <section>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'sans-serif', fontSize: '24px', fontWeight: 'bold', color: 'var(--starlight)', textAlign: 'center' }}>LUNAR SURFACE EXPLORER</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Left Column: List & Filters */}
            <div>
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
            </div>

            {/* Center Column: 2D Moon Map */}
            <div style={{ height: '600px', background: 'var(--obsidian-1)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LunarMapLeaflet 
                features={features}
                selectedFeatureId={selectedFeature?.id}
                onSelectFeature={setSelectedFeatureId}
              />
            </div>

            {/* Right Column: Details & Minimap */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FeatureDetailsSection 
                selectedFeature={selectedFeature}
                nearbyFeatures={nearbyFeatures}
                onCloseFeature={handleCloseFeature}
                onSelectFeature={setSelectedFeatureId}
                liveData={liveData}
                liveLoading={liveLoading}
              />

            </div>
          </div>
        </section>

        {/* 4. Lunar Events Panel */}
        <section>
          <LunarEventsPanel liveData={liveData} />
        </section>

        {/* 5. Lunar Fun Facts */}
        <section>
          <LunarFunFacts />
        </section>
      </div>
    </div>
  );
};

export default LunarObservatory;
