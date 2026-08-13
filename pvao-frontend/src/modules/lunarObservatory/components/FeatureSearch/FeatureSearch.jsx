import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import styles from './FeatureSearch.module.css';

const FeatureSearch = ({ searchTerm, setSearchTerm }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchTerm]);

  return (
    <div className={styles.searchContainer}>
      <Search size={16} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search lunar features..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
};

export default FeatureSearch;
