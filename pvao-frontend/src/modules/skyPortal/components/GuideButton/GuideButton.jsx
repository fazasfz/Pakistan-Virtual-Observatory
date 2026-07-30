import React from 'react';
import styles from './GuideButton.module.css';

const GuideButton = ({ onClick }) => {
  return (
    <button className={styles.guideButton} onClick={onClick}>
      [ GUIDE ]
    </button>
  );
};

export default GuideButton;
