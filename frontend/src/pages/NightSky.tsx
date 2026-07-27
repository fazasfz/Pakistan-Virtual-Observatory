// src/pages/NightSky.tsx
import React, { useEffect, useState } from 'react';
import FullScreenCanvas from '../components/night-sky/FullScreenCanvas';
import SidePanel from '../components/night-sky/SidePanel';
import ControlPanel from '../components/night-sky/ControlPanel';
import { ObjectDetailModal } from '../components/night-sky/ObjectDetailModal';
import { fetchJson } from '../utils/api';
import type { NightSkyObject } from '../components/night-sky/ObjectCard';
import './nightSkyPage.css';

export const NightSky: React.FC = () => {
  const [selectedObj, setSelectedObj] = useState<NightSkyObject | null>(null);
  const [hoveredObj, setHoveredObj] = useState<NightSkyObject | null>(null);
  const [objects, setObjects] = useState<NightSkyObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(10);
  const [telescopeMode, setTelescopeMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(true);

  useEffect(() => {
    const loadObjects = async () => {
      try {
        const data = await fetchJson('/api/night-sky/objects');
        setObjects(data);
      } catch (err) {
        console.error('Failed to fetch night‑sky objects', err);
      } finally {
        setLoading(false);
      }
    };
    loadObjects();
  }, []);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#070913' }}>
      
      {/* Top Navbar / Toolbar */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 200, display: 'flex', gap: '8px' }}>
        {!showControls && (
          <button 
            onClick={() => setShowControls(true)}
            style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
          >
            Show Controls
          </button>
        )}
        {!showSidePanel && (
          <button 
            onClick={() => setShowSidePanel(true)}
            style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
          >
            Show Panel
          </button>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <FullScreenCanvas
          objects={objects}
          onSelectObject={setSelectedObj}
          hoveredObj={hoveredObj}
          onHoverObject={setHoveredObj}
          selectedObj={selectedObj}
          zoom={zoom}
          telescopeMode={telescopeMode}
        />
        {showControls && (
          <ControlPanel
            zoom={zoom}
            onZoomChange={setZoom}
            telescopeMode={telescopeMode}
            onToggleTelescope={setTelescopeMode}
            onClose={() => setShowControls(false)}
          />
        )}
      </div>
      {showSidePanel && (
        <SidePanel 
          objects={objects} 
          loading={loading} 
          selectedObj={selectedObj}
          hoveredObj={hoveredObj}
          onSelect={setSelectedObj}
          onHover={setHoveredObj}
          onClose={() => setShowSidePanel(false)}
        />
      )}

      <ObjectDetailModal open={!!selectedObj} onClose={() => setSelectedObj(null)} data={selectedObj} />
    </div>
  );
};

export default NightSky;
