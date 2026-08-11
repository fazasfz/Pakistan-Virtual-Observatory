import React from 'react';
import { Eye, Binoculars, Telescope } from 'lucide-react';
import styles from './VisibilityWidget.module.css';

const VISIBILITY_LABELS = { 
  naked_eye: { label: 'Naked Eye', icon: Eye },
  binoculars: { label: 'Binoculars', icon: Binoculars },
  telescope: { label: 'Telescope', icon: Telescope }
};

export default function VisibilityWidget({ visibility }) {
  if (!visibility) return null;
  
  return (
    <div className={styles.widgetWrapper}>
      <div className={styles.header}>Can it be seen?</div>
      <div className={styles.badges}>
        {Object.entries(VISIBILITY_LABELS).map(([key, config]) => {
          const isVisible = visibility[key];
          const Icon = config.icon;
          
          return (
            <div 
              key={key} 
              className={`${styles.badge} ${isVisible ? styles.visible : styles.notVisible}`}
              title={isVisible ? `Visible with ${config.label}` : `Difficult/Not visible with ${config.label}`}
            >
              <Icon size={14} />
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
