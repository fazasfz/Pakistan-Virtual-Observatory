import React from 'react';
import { useAladin } from '../hooks/useAladin';
import { objectCatalog } from '../api/objectCatalog';

export default function DeepSkyViewer() {
  const { containerRef, aladin, isReady } = useAladin({
    target: 'M31',
    fov: 3,
    survey: 'P/DSS2/color',
  });

  const goTo = (id) => {
    if (aladin) {
      aladin.gotoObject(id);
    }
  };

  const renderButtons = (label, items) => (
    <div style={{ marginBottom: '1rem' }}>
      <h4 style={{ margin: '0.5rem 0', color: '#ccc' }}>{label}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {items.map((obj) => (
          <button
            key={obj.id}
            onClick={() => goTo(obj.id)}
            style={{
              padding: '0.4rem 0.8rem',
              background: '#1a1a1a',
              color: '#eee',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {obj.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {!isReady && (
        <div style={{ color: '#aaa', padding: '1rem' }}>
          Loading sky viewer...
        </div>
      )}

      {isReady && (
        <div style={{ marginBottom: '1rem' }}>
          {renderButtons('Galaxies', objectCatalog.galaxies)}
          {renderButtons('Nebulas', objectCatalog.nebulas)}
          {renderButtons('Star Clusters', objectCatalog.starClusters)}
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '600px',
          background: '#000',
        }}
      />
    </div>
  );
}