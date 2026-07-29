import React from 'react';
import { Bot } from 'lucide-react';
import styles from './AstroCopilotTrigger.module.css';

const AstroCopilotTrigger = ({ onClick }) => {
  return (
    <button className={styles.triggerButton} onClick={onClick} aria-label="Open Astro-Copilot">
      <div className={styles.pulseRing}></div>
      <div className={styles.pulseRingDelayed}></div>
      <div className={styles.iconContainer}>
        <Bot size={24} className={styles.icon} />
      </div>
    </button>
  );
};

export default AstroCopilotTrigger;
