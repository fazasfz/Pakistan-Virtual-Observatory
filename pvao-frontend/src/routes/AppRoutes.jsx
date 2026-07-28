import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from './routePaths';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/landing/LandingPage';

// Module Landings
import EarthAtmosphereLanding from '../modules/earthAtmosphere/EarthAtmosphereLanding';
import HeliosPlanetsLanding from '../modules/heliosPlanets/HeliosPlanetsLanding';
import DeepCosmosLanding from '../modules/deepCosmosExoplanet/DeepCosmosLanding';
import IntelligentCoreLanding from '../modules/intelligentCore/IntelligentCoreLanding';

// Sub-pages
import NightSkyPortal from '../modules/earthAtmosphere/nightSkyPortal';
import EarthView from '../modules/earthAtmosphere/earthView';
import SatelliteTracker from '../modules/earthAtmosphere/satelliteTracker';

import SolarSystemSimulator from '../modules/heliosPlanets/solarSystemSimulator';
import SolarObservatory from '../modules/heliosPlanets/solarObservatory';

import ExoVista from '../modules/deepCosmosExoplanet/exoVista';
import DeepSkyExplorer from '../modules/deepCosmosExoplanet/deepSkyExplorer';

import AstroCopilot from '../modules/intelligentCore/astroCopilot';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={PATHS.LANDING} element={<LandingPage />} />
        
        {/* Earth & Atmosphere */}
        <Route path={PATHS.EARTH_ATMOSPHERE.ROOT} element={<EarthAtmosphereLanding />} />
        <Route path={PATHS.EARTH_ATMOSPHERE.NIGHT_SKY_PORTAL} element={<NightSkyPortal />} />
        <Route path={PATHS.EARTH_ATMOSPHERE.EARTH_VIEW} element={<EarthView />} />
        <Route path={PATHS.EARTH_ATMOSPHERE.SATELLITE_TRACKER} element={<SatelliteTracker />} />

        {/* Helios & Planets */}
        <Route path={PATHS.HELIOS_PLANETS.ROOT} element={<HeliosPlanetsLanding />} />
        <Route path={PATHS.HELIOS_PLANETS.SOLAR_SYSTEM_SIMULATOR} element={<SolarSystemSimulator />} />
        <Route path={PATHS.HELIOS_PLANETS.SOLAR_OBSERVATORY} element={<SolarObservatory />} />

        {/* Deep Cosmos */}
        <Route path={PATHS.DEEP_COSMOS.ROOT} element={<DeepCosmosLanding />} />
        <Route path={PATHS.DEEP_COSMOS.EXOVISTA} element={<ExoVista />} />
        <Route path={PATHS.DEEP_COSMOS.DEEP_SKY_EXPLORER} element={<DeepSkyExplorer />} />

        {/* Intelligent Core */}
        <Route path={PATHS.INTELLIGENT_CORE.ROOT} element={<IntelligentCoreLanding />} />
        <Route path={PATHS.INTELLIGENT_CORE.ASTRO_COPILOT} element={<AstroCopilot />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
