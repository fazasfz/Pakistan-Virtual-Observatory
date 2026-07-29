import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from './routePaths';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/landing/LandingPage';
import CreditsPage from '../pages/credits/CreditsPage';

// Sub-pages
import SkyPortal from '../modules/earthAtmosphere/skyPortal';
import EarthView from '../modules/earthAtmosphere/earthView';
import SatelliteTracker from '../modules/earthAtmosphere/satelliteTracker';

import SolarSystemSimulator from '../modules/heliosPlanets/solarSystemSimulator';
import SolarObservatory from '../modules/heliosPlanets/solarObservatory';

import ExoVista from '../modules/deepCosmosExoplanet/exoVista';
import DeepSkyExplorer from '../modules/deepCosmosExoplanet/deepSkyExplorer';

const UnderConstruction = ({ moduleName }) => (
  <div style={{ padding: '100px', textAlign: 'center', color: 'var(--starlight)' }}>
    <h2>{moduleName}</h2>
    <p>This module is under construction.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={PATHS.LANDING} element={<LandingPage />} />
        
        <Route path={PATHS.SKY_PORTAL} element={<SkyPortal />} />
        <Route path={PATHS.EARTH_VIEW} element={<EarthView />} />
        <Route path={PATHS.SATELLITE_TRACKER} element={<SatelliteTracker />} />

        <Route path={PATHS.SOLAR_SYSTEM_SIMULATOR} element={<SolarSystemSimulator />} />
        <Route path={PATHS.SOLAR_OBSERVATORY} element={<SolarObservatory />} />

        <Route path={PATHS.EXOVISTA} element={<ExoVista />} />
        <Route path={PATHS.DEEP_SKY_EXPLORER} element={<DeepSkyExplorer />} />

        <Route path={PATHS.OBSERVATION_PLANNER} element={<UnderConstruction moduleName="Observation Planner" />} />

        <Route path={PATHS.CREDITS} element={<CreditsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
