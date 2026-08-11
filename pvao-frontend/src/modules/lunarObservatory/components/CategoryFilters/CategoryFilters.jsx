import React from 'react';
import styles from './CategoryFilters.module.css';

const CATEGORIES = ['All', 'Crater', 'Mare', 'Landing Site', 'Terrain', 'Polar'];

const CategoryFilters = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className={styles.filterContainer}>
      {CATEGORIES.map(category => (
        <button
          key={category}
          className={`${styles.chip} ${activeCategory === category ? styles.chipActive : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
