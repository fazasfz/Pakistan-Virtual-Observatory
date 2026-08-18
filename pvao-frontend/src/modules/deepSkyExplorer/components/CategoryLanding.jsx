/**
 * Displays the landing page for the Deep Sky Explorer.
 * Renders selectable category cards (Nebulas, Star Clusters, Galaxies) for the user to explore.
 * Props: onSelectCategory (function).
 */
import React from 'react';
import nebulaImg from '../../../assets/images/modules/nebula.webp';
import starClusterImg from '../../../assets/images/modules/starCluster.jpeg';
import galaxyImg from '../../../assets/images/modules/galaxy.webp';

const categories = [
  {
    key: 'nebulas',
    title: 'Nebulas',
    description:
      'Giant clouds of gas and dust in space. Some are where new stars are being born; others are the remains of stars that have died.',
    image: nebulaImg,
  },
  {
    key: 'starClusters',
    title: 'Star Clusters',
    description:
      'Groups of hundreds to millions of stars, all born from the same cloud and held together by gravity.',
    image: starClusterImg,
  },
  {
    key: 'galaxies',
    title: 'Galaxies',
    description:
      'Massive systems containing billions of stars, gas, dust, and dark matter. Our own home, the Milky Way, is one example.',
    image: galaxyImg,
  },
];

export default function CategoryLanding({ onSelectCategory }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>
        Deep Sky Explorer
      </h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Select a category below to observe deep sky objects.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            style={{
              textAlign: 'left',
              border: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: '#111',
              color: '#eee',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: '160px',
                width: '100%',
                backgroundImage: `url(${cat.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0,
            }}
            />
            <div style={{ padding: '1rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>{cat.title}</h2>
              <p style={{ margin: 0, color: '#ccc', fontSize: '0.9rem' }}>
                {cat.description}
              </p>
              <p style={{ marginTop: '0.75rem', color: '#f90', fontSize: '0.85rem' }}>
                Explore →
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}