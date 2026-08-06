import React from 'react';
import DeepSkyViewer from './components/DeepSkyViewer';

const DeepSkyExplorer = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontFamily: 'var(--font-mono)' }}>Deep Sky Explorer</h2>
      <DeepSkyViewer />
    </div>
  );
};

export default DeepSkyExplorer;