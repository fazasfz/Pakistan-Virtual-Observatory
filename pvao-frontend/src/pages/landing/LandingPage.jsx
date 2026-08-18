/**
 * Landing page component for the Pakistan Virtual Astronomical Observatory.
 * Composes the Hero, Modules Overview, and Data Sources sections.
 */
import React from 'react';
import HeroSection from './sections/HeroSection';
import ModulesOverviewSection from './sections/ModulesOverviewSection';
import DataSourcesSection from './sections/DataSourcesSection';

const LandingPage = () => {
  return (
    <div style={{ width: '100%' }}>
      <HeroSection />
      <ModulesOverviewSection />
      <DataSourcesSection />
    </div>
  );
};

export default LandingPage;
