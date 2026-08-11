import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import styles from './AstroCopilotTrigger.module.css';

const AstroCopilotTrigger = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button className={styles.triggerButton} onClick={onClick} aria-label="Open Astro-Copilot">
      <div className={styles.pulseRing}></div>
      <div className={styles.pulseRingDelayed}></div>
      <div className={styles.iconContainer}>
        <Bot size={24} className={styles.icon} />
      </div>
      <div className={`${styles.popup} ${!showTooltip ? styles.popupHidden : ''}`}>Ask away stargazer ✨</div>
    </button>
  );
};

export default AstroCopilotTrigger;
