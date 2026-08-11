import React from 'react';
import { useAladin } from '../hooks/useAladin';
import { useObjectSearch } from '../hooks/useObjectSearch';

export default function SkyMapViewer({ objectName, onBack }) {
  const { containerRef, isReady } = useAladin({
    target: objectName || 'M31',
    fov: 3,
    survey: 'P/DSS2/color',
  });

  const { info, images, loading, error } = useObjectSearch();

  // Fetch info once on mount for this object
  const hasSearchedRef = React.useRef(false);
  const { search } = useObjectSearch();
  React.useEffect(() => {
    if (objectName && !hasSearchedRef.current) {
      hasSearchedRef.current = true;
      search(objectName);
    }
  }, [objectName]);

  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={onBack}
        style={{
          margin: '1rem',
          background: 'none',
          border: '1px solid #444',
          color: '#ccc',
          borderRadius: '6px',
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
        }}
      >
        ← Back to search
      </button>

      {!isReady && <div style={{ color: '#aaa', padding: '1rem' }}>Loading sky viewer...</div>}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '0 1rem' }}>
        <div
          ref={containerRef}
          style={{ flex: '2 1 500px', height: '600px', background: '#000', borderRadius: '8px' }}
        />

        <div style={{ flex: '1 1 250px', padding: '1rem', background: '#111', borderRadius: '8px', color: '#eee' }}>
          {loading && <p>Loading object data...</p>}
          {error && <p style={{ color: '#f88' }}>{error}</p>}

          {info && !error && (
            <div>
              <h3 style={{ marginTop: 0 }}>{info.name}</h3>
              <p><strong>Type:</strong> {info.type || 'Unknown'}</p>
              <p><strong>RA:</strong> {info.ra ?? 'N/A'}</p>
              <p><strong>Dec:</strong> {info.dec ?? 'N/A'}</p>
              <p><strong>Redshift:</strong> {info.redshift ?? 'N/A'}</p>
            </div>
          )}

          {images.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Available Observations</h4>
              <ul>
                {images.map((img, idx) => (
                  <li key={idx}>{img.mission} — {img.instrument} — target: {img.target}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
