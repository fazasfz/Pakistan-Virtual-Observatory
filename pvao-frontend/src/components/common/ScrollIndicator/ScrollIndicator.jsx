import React from 'react';
import styles from './ScrollIndicator.module.css';

const ScrollIndicator = () => {
  return (
    <div className={styles.scrollIndicator}>
      <div className={styles.dial}>
        <div className={styles.tick}></div>
        <div className={styles.tick}></div>
        <div className={styles.tick}></div>
      </div>
      <span className={styles.label}>SCROLL</span>
    </div>
  );
};

export default ScrollIndicator;
