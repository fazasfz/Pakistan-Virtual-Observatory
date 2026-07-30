import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import GuideDrawer from './components/GuideDrawer/GuideDrawer';

const SkyPortal = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const toggleGuide = () => {
    setIsGuideOpen(!isGuideOpen);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 60px)', overflow: 'hidden', backgroundColor: '#000' }}>
      <iframe 
        src="https://stellarium-web.org/" 
        title="Stellarium Web" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      ></iframe>
      
      <button 
        onClick={toggleGuide}
        style={{
          position: 'absolute',
          top: '6rem',
          left: '1.5rem',
          backgroundColor: 'var(--bg-obsidian, rgba(20, 20, 20, 0.9))',
          border: '1px solid var(--accent-gold, #cda434)',
          color: 'var(--accent-gold, #cda434)',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-gold, #cda434)';
          e.currentTarget.style.color = '#000';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-obsidian, rgba(20, 20, 20, 0.9))';
          e.currentTarget.style.color = 'var(--accent-gold, #cda434)';
        }}
        title="Open Guide"
      >
        <BookOpen size={20} />
        <span>User Manual</span>
      </button>

      <GuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default SkyPortal;
