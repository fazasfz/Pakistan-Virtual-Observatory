import React, { useState } from 'react';
import SkyCanvas from './components/SkyCanvas/SkyCanvas';
import GuideButton from './components/GuideButton/GuideButton';
import GuideDrawer from './components/GuideDrawer/GuideDrawer';

const SkyPortal = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const toggleGuide = () => {
    setIsGuideOpen(!isGuideOpen);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <SkyCanvas />
      <GuideButton onClick={toggleGuide} />
      <GuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default SkyPortal;
