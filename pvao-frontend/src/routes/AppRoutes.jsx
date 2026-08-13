import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from './routePaths';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/landing/LandingPage';
import CreditsPage from '../pages/credits/CreditsPage';

// Sub-pages
import SkyPortal from '../modules/skyPortal';
import EarthView from '../modules/earthView';
import AstronomicalProbeTracker from '../modules/astronomicalProbeTracker';

import SolarSystemSimulator from '../modules/solarSystemSimulator';
import Exora from '../modules/exora';
import DeepSkyExplorer from '../modules/deepSkyExplorer';
import ObservationPlanner from '../modules/observationPlanner';

const SolarObservatory = React.lazy(() => import('../modules/solarObservatory'));
const LunarObservatory = React.lazy(() => import('../modules/lunarObservatory'));

import LoadingOverlay from '../components/common/LoadingOverlay/LoadingOverlay';

const UnderConstruction = ({ moduleName }) => (
  <div style={{ padding: '100px', textAlign: 'center', color: 'var(--starlight)' }}>
    <h2>{moduleName}</h2>
    <p>This module is under construction.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<LoadingOverlay />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={PATHS.LANDING} element={<LandingPage />} />
          
          <Route path={PATHS.SKY_PORTAL} element={<SkyPortal />} />
          <Route path={PATHS.EARTH_VIEW} element={<EarthView />} />
          <Route path={PATHS.ASTRONOMICAL_PROBE_TRACKER} element={<AstronomicalProbeTracker />} />

          <Route path={PATHS.SOLAR_SYSTEM_SIMULATOR} element={<SolarSystemSimulator />} />
          <Route path={PATHS.SOLAR_OBSERVATORY} element={<SolarObservatory />} />

          <Route path={PATHS.EXORA} element={<Exora />} />
          <Route path={PATHS.DEEP_SKY_EXPLORER} element={<DeepSkyExplorer />} />

          <Route path={PATHS.OBSERVATION_PLANNER} element={<ObservationPlanner />} />
          <Route path={PATHS.LUNAR_OBSERVATORY} element={<LunarObservatory />} />

          <Route path={PATHS.CREDITS} element={<CreditsPage />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
