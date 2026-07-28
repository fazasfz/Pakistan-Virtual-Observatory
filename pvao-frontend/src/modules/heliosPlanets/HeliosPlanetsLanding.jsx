import React from 'react';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';

const PlaceholderLanding = ({ title }) => {
  return (
    <SectionWrapper overlay={true}>
      <h1 style={{ color: 'var(--brass)', fontFamily: 'var(--font-mono)' }}>HELIOS & PLANETS SECTOR</h1>
      <p style={{ color: 'var(--slate-ui)' }}>Module under construction.</p>
    </SectionWrapper>
  );
};
export default PlaceholderLanding;
