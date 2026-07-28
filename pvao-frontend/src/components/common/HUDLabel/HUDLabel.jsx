import React from 'react';
import styles from './HUDLabel.module.css';

const HUDLabel = ({ text, className = '' }) => {
  return (
    <div className={`${styles.hudLabel} ${className}`}>
      <span className={styles.bracket}>[</span>
      <span className={styles.text}>{text}</span>
      <span className={styles.bracket}>]</span>
    </div>
  );
};

export default HUDLabel;
