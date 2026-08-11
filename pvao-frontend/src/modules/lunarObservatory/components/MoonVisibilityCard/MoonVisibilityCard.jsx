import React from 'react';
import styles from './MoonVisibilityCard.module.css';

const formatTime = (isoString) => {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (isoString) => {
  if (!isoString) return '--/--/----';
  const date = new Date(isoString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const MoonVisibilityCard = ({ data, loading }) => {
  if (loading || !data) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>VISIBILITY & EVENTS</h3>
      </div>
      
      <div className={styles.eventsGrid}>
        <div className={styles.eventRow}>
          <span className={styles.label}>MOONRISE</span>
          <span className={styles.value}>{formatTime(data.rise_time)}</span>
        </div>
        <div className={styles.eventRow}>
          <span className={styles.label}>MOONSET</span>
          <span className={styles.value}>{formatTime(data.set_time)}</span>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.eventRow}>
          <span className={styles.label}>NEXT FULL MOON</span>
          <span className={styles.value}>{formatDate(data.next_full_moon)}</span>
        </div>
        <div className={styles.eventRow}>
          <span className={styles.label}>NEXT NEW MOON</span>
          <span className={styles.value}>{formatDate(data.next_new_moon)}</span>
        </div>
      </div>
    </div>
  );
};

export default MoonVisibilityCard;
