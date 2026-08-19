/**
 * Root entry point for the Deep Sky Explorer module.
 * Manages state to toggle between the category selection landing page and the interactive Aladin viewer.
 */
import React, { useState } from 'react';
import CategoryLanding from './components/CategoryLanding';
import DeepSkyViewer from './components/DeepSkyViewer';

const DeepSkyExplorer = () => {
  const [category, setCategory] = useState(null);

  return (
    <div style={{ padding: '1rem' }}>
      {!category ? (
        <CategoryLanding onSelectCategory={setCategory} />
      ) : (
        <DeepSkyViewer category={category} onBack={() => setCategory(null)} />
      )}
    </div>
  );
};

export default DeepSkyExplorer;