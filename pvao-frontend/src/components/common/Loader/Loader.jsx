import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.core}></div>
      </div>
      <div className={styles.text}>CALIBRATING INSTRUMENTS...</div>
    </div>
  );
};

export default Loader;
