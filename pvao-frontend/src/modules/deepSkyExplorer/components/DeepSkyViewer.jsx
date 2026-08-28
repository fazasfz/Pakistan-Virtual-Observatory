/**
 * Integrates the Aladin Lite sky viewer for a specific celestial category.
 * Provides interactive panning, zooming, FITS band rendering, colour bar, and SIMBAD/MAST info.
 * Props: category (string), onBack (function).
 */
import React, { useEffect, useState } from 'react';
import {
  useAladin,
  applyBand,
  BANDS,
  BAND_ORDER,
  CSS_COLORMAPS,
  nativePixelScaleDeg,
} from '../hooks/useAladin';
import { useObjectSearch } from '../hooks/useObjectSearch';
import { objectCatalog } from '../api/objectCatalog';
import ObjectInfoPanel from './ObjectInfoPanel';
import '../aladinOverrides.css';
import nebulaImg from '../../../assets/images/modules/nebula.webp';
import starClusterImg from '../../../assets/images/modules/starCluster.jpeg';
import galaxyImg from '../../../assets/images/modules/galaxy.webp';

const categoryMeta = {
  nebulas: { label: 'Nebulas', image: nebulaImg, items: objectCatalog.nebulas },
  starClusters: { label: 'Star Clusters', image: starClusterImg, items: objectCatalog.starClusters },
  galaxies: { label: 'Galaxies', image: galaxyImg, items: objectCatalog.galaxies },
};

const API_BASE = import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE || 'http://localhost:8000/api/v1';

const fmt = (v) => {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  if (a >= 1000 || (v !== 0 && a < 0.01)) return v.toExponential(1);
  return v.toFixed(2);
};

const fmtScale = (deg) => {
  const arcsec = deg * 3600;
  return arcsec < 60 ? `${arcsec.toFixed(1)}″` : `${(arcsec / 60).toFixed(1)}′`;
};

export default function DeepSkyViewer({ category, onBack }) {
  const meta = categoryMeta[category];

  const { containerRef, aladin, isReady } = useAladin({
    target: meta.items[0]?.id || 'M31',
    fov: 3,
  });

  const { search, info, images, loading, error } = useObjectSearch();

  const [wavelength, setWavelength] = useState('Optical');
  const [bandState, setBandState] = useState(null);
  const [coverage, setCoverage] = useState('covered');
  const [pixelValue, setPixelValue] = useState(null);
  const [query, setQuery] = useState('');

  const band = BANDS[wavelength];

  // Live pixel readout — this is what makes the colour bar mean something.
  // People move the cursor over the bright part of the nebula, watch the number
  // climb, and the units stop being abstract.
  useEffect(() => {
    if (!aladin || !bandState?.layer) return;
    const handler = ({ x, y }) => {
      try {
        const v = bandState.layer.readPixel(x, y);
        setPixelValue(Number.isFinite(v) ? v : null);
      } catch {
        setPixelValue(null);
      }
    };
    aladin.on('mouseMove', handler);
    return () => aladin.off?.('mouseMove', handler);
  }, [aladin, bandState]);

  const switchWavelength = async (key) => {
    setWavelength(key);
    if (!aladin) return;

    setBandState(null);
    setPixelValue(null);

    // Ask the backend whether this survey actually observed this patch of sky.
    // GALEX in particular skips the Galactic plane and anything near a bright
    // star, so a blank frame is often correct — but it looks like a bug unless
    // you say so. Never block on the answer: if the check is wrong we'd be
    // hiding real data.
    const [ra, dec] = aladin.getRaDec();
    try {
      const res = await fetch(`${API_BASE}/deep-sky-explorer/coverage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hips_id: BANDS[key].id, ra, dec }),
      });
      setCoverage(res.ok ? (await res.json()).coverage : 'unknown');
    } catch {
      setCoverage('unknown');
    }

    const result = await applyBand(aladin, key);
    setBandState(result);

    // Stay locked on the object, or the view drifts between bands and you end
    // up comparing different patches of sky.
    aladin.gotoRaDec(ra, dec);
  };

  const goToAndSearch = (nameForAladin, nameForSearch) => {
    if (aladin) aladin.gotoObject(nameForAladin);
    search(nameForAladin);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) goToAndSearch(query.trim());
  };

  const stops = CSS_COLORMAPS[band.colormap] ?? CSS_COLORMAPS.viridis;
  const [lo, hi] = bandState?.cuts ?? [null, null];

  return (
    <div style={{ width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '108px 2rem 4rem 2rem', boxSizing: 'border-box' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '1.25rem',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(224, 168, 94, 0.3)',
          color: 'var(--copper, #E0A85E)',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontFamily: "var(--font-headline, 'Inter', sans-serif)",
          fontSize: '0.88rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(224, 168, 94, 0.15)';
          e.currentTarget.style.borderColor = 'var(--copper, #E0A85E)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(224, 168, 94, 0.3)';
        }}
      >
        ← Back to Categories
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

      {/* ---- wavelength tabs ---- */}
      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 0.75rem' }}>
        {BAND_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => switchWavelength(key)}
            style={{
              padding: '0.4rem 0.8rem',
              background: wavelength === key ? '#f90' : '#1a1a1a',
              color: wavelength === key ? '#111' : '#eee',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: wavelength === key ? 'bold' : 'normal',
            }}
          >
            {BANDS[key].label}
          </button>
        ))}
      </div>

      {coverage === 'empty' && (
        <div className="band-notice">
          <strong>Patchy {band.label} coverage here.</strong> {band.telescope} has no
          data at this exact position — any circular edges you see are real survey
          boundaries, not a rendering error. Optical and Infrared cover the whole sky.
        </div>
      )}

      {/* ---- legend ---- */}
      <div className="band-colorbar">
        {band.colorbar && (
          <div className="cb-row">
            <span className="cb-tick">{fmt(lo)}</span>
            <div
              className="cb-gradient"
              style={{ background: `linear-gradient(90deg, ${stops.join(',')})` }}
            />
            <span className="cb-tick">{fmt(hi)}</span>
            <span className="cb-unit">{band.unit}</span>
          </div>
        )}

        <p className="cb-caption">
          <strong>
            {band.telescope} · {band.wavelength}.
          </strong>{' '}
          {band.means}
        </p>

        {band.colorbar && (
          <p className="cb-readout">
            {pixelValue != null
              ? `Under cursor: ${pixelValue.toPrecision(4)} ${band.unit}`
              : 'Hover the image to read a pixel value.'}
            {bandState?.order && (
              <>
                {'  ·  '}Native resolution ≈{' '}
                {fmtScale(nativePixelScaleDeg(bandState.order, bandState.tileSize))} per
                pixel; zoom is capped there.
              </>
            )}
          </p>
        )}
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '600px', background: '#000' }} />

      <div style={{ marginTop: '1rem' }}>
        {loading && <p style={{ color: '#aaa' }}>Loading object data...</p>}
        {error && <p style={{ color: '#f88' }}>{error}</p>}

        {info && !error && (
          <ObjectInfoPanel info={info} aladin={aladin} bandKey={wavelength} />
        )}

        {images.length > 0 && (
          <div className="object-info" style={{ marginTop: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem' }}>Available Observations</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#b6bac0' }}>
              {images.map((img, idx) => (
                <li key={idx}>
                  {img.mission} — {img.instrument} — target: {img.target}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}