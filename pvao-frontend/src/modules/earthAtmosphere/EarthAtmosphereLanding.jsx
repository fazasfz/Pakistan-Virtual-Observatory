import React from 'react';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';
import { PATHS } from '../../routes/routePaths';

const EarthAtmosphereLanding = () => {
  return (
    <SectionWrapper overlay={true}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: 'var(--brass)', fontFamily: 'var(--font-mono)' }}>EARTH & ATMOSPHERE SECTOR</h1>
        <p style={{ color: 'var(--slate-ui)', marginBottom: '2rem' }}>Select a module below to begin:</p>
        
        <Link 
          to={PATHS.SKY_PORTAL}
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'var(--accent-gold)';
            e.target.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(20, 20, 20, 0.8)';
            e.target.style.color = 'var(--accent-gold)';
          }}
        >
          Open Sky Portal
        </Link>
      </div>
    </SectionWrapper>
  );
};
export default EarthAtmosphereLanding;
