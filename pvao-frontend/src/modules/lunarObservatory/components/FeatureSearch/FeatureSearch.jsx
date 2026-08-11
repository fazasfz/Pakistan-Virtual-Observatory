import React from 'react';
import { Search } from 'lucide-react';
import styles from './FeatureSearch.module.css';

const FeatureSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className={styles.searchContainer}>
      <Search size={16} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search lunar features..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default FeatureSearch;
