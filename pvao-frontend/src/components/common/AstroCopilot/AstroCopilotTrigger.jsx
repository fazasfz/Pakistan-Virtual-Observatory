import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

import styles from './AstroCopilotTrigger.module.css';

const AstroCopilotTrigger = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    if (hasClicked) {
      setShowTooltip(false);
      return;
    }

    const timer = setInterval(() => {
      setShowTooltip((prev) => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, [hasClicked]);

  const handleClick = (e) => {
    setHasClicked(true);
    if (onClick) onClick(e);
  };

  return (
    <button className={styles.triggerButton} onClick={handleClick} aria-label="Open Astro-Copilot">
      <div className={styles.pulseRing}></div>
      <div className={styles.pulseRingDelayed}></div>
      <div className={styles.iconContainer}>
        <Bot size={28} className={styles.icon} />
      </div>
      <div className={`${styles.popup} ${!showTooltip ? styles.popupHidden : ''}`}>Ask away stargazer</div>
    </button>
  );
};

export default AstroCopilotTrigger;
