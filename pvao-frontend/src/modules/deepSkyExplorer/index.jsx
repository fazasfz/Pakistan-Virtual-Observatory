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