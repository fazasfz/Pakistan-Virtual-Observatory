import React from 'react';
import styles from './SectionHeading.module.css';

const SectionHeading = ({ children, className = '' }) => {
  return (
    <h2 className={`${styles.sectionTitle} ${className}`}>
      {children}
    </h2>
  );
};

export default SectionHeading;
