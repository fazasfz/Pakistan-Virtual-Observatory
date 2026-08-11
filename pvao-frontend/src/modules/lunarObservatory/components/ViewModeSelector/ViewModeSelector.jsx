import React from 'react';
import { Select } from 'antd';
import { Map, Globe, Mountain, Sun, Circle } from 'lucide-react';
import styles from './ViewModeSelector.module.css';

export default function ViewModeSelector({ viewMode, setViewMode }) {
  return (
    <div className={styles.selectorWrapper}>
      <Select
        value={viewMode}
        onChange={setViewMode}
        className={styles.selector}
        dropdownClassName={styles.dropdown}
        bordered={false}
        options={[
          {
            value: 'Snapshot',
            label: (
              <div className={styles.option}>
                <Circle size={16} />
                <span>2D Snapshot</span>
              </div>
            ),
          },
          {
            value: '3D',
            label: (
              <div className={styles.option}>
                <Globe size={16} />
                <span>3D Model</span>
              </div>
            ),
          },
          {
            value: 'Terrain',
            label: (
              <div className={styles.option}>
                <Mountain size={16} />
                <span>Terrain Map</span>
              </div>
            ),
          },
          {
            value: 'Geographic',
            label: (
              <div className={styles.option}>
                <Map size={16} />
                <span>Geographic Map</span>
              </div>
            ),
          },
          {
            value: 'Shade',
            label: (
              <div className={styles.option}>
                <Sun size={16} />
                <span>Shaded Relief</span>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
