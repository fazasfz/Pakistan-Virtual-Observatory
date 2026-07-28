import React from 'react';
import HeroSection from './sections/HeroSection';
import MissionSection from './sections/MissionSection';
import ModulesOverviewSection from './sections/ModulesOverviewSection';
import DataSourcesSection from './sections/DataSourcesSection';
import ClosingSection from './sections/ClosingSection';

const LandingPage = () => {
  return (
    <div style={{ width: '100%' }}>
      <HeroSection />
      <MissionSection />
      <ModulesOverviewSection />
      <DataSourcesSection />
      <ClosingSection />
    </div>
  );
};

export default LandingPage;
