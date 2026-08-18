/**
 * Integrates the Aladin Lite sky viewer for a specific celestial category.
 * Provides interactive panning, zooming, and fetching imagery for deep sky objects.
 * Props: category (string), onBack (function).
 */
import React, { useState } from 'react';
import { useAladin } from '../hooks/useAladin';
import { useObjectSearch } from '../hooks/useObjectSearch';
import { objectCatalog } from '../api/objectCatalog';
import nebulaImg from '../../../assets/images/modules/nebula.webp';
import starClusterImg from '../../../assets/images/modules/starCluster.jpeg';
import galaxyImg from '../../../assets/images/modules/galaxy.webp';

const categoryMeta = {
  nebulas: { label: 'Nebulas', image: nebulaImg, items: objectCatalog.nebulas },
  starClusters: { label: 'Star Clusters', image: starClusterImg, items: objectCatalog.starClusters },
  galaxies: { label: 'Galaxies', image: galaxyImg, items: objectCatalog.galaxies },
};

export default function DeepSkyViewer({ category, onBack }) {
  const meta = categoryMeta[category];

  const { containerRef, aladin, isReady } = useAladin({
    target: meta.items[0]?.id || 'M31',
    fov: 3,
    survey: 'P/DSS2/color',
  });

  const { search, info, images, loading, error } = useObjectSearch();
  const wavelengthOptions = [
    { label: 'Optical', survey: 'P/DSS2/color' },
    { label: 'Infrared', survey: 'P/2MASS/color' },
    { label: 'UV', survey: 'P/GALEXGR6_7/NUV' },
    { label: 'X-ray', survey: 'P/eROSITA/RGB' },
  ];

  const [wavelength, setWavelength] = useState('Optical');

  const switchWavelength = (opt) => {
    if (aladin) aladin.setImageSurvey(opt.survey);
    setWavelength(opt.label);
  };
  const [query, setQuery] = useState('');

  const goToAndSearch = (nameForAladin, nameForSearch) => {
    if (aladin) aladin.gotoObject(nameForAladin);
    search(nameForSearch || nameForAladin);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) goToAndSearch(query.trim());
  };

  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '1rem',
          background: 'none',
          border: '1px solid #444',
          color: '#ccc',
          borderRadius: '6px',
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
        }}
      >
        ← Back to categories
      </button>

      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${meta.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          padding: '2rem 1.5rem',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ margin: '0 0 1rem 0', color: '#fff' }}>{meta.label}</h2>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search a ${meta.label.toLowerCase()} object...`}
            style={{
              flex: 1,
              padding: '0.6rem',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {meta.items.map((obj) => (
            <button
              key={obj.id}
              onClick={() => goToAndSearch(obj.id, obj.name)}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {obj.name}
            </button>
          ))}
        </div>
      </div>

      {!isReady && <div style={{ color: '#aaa', padding: '1rem' }}>Loading sky viewer...</div>}
      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        {wavelengthOptions.map((opt) => (
          <button
          key={opt.label}
          onClick={() => switchWavelength(opt)}
          style={{
            padding: '0.4rem 0.8rem',
            background: wavelength === opt.label ? '#f90' : '#1a1a1a',
            color: wavelength === opt.label ? '#111' : '#eee',
            border: '1px solid #444',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: wavelength === opt.label ? 'bold' : 'normal',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
      <div ref={containerRef} style={{ width: '100%', height: '600px', background: '#000' }} />

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#111', borderRadius: '8px', color: '#eee' }}>
        {loading && <p>Loading object data...</p>}
        {error && <p style={{ color: '#f88' }}>{error} (backend not running - sky viewer above still works fine)</p>}
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
                <li key={idx}>{img.mission} - {img.instrument} - target: {img.target}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
