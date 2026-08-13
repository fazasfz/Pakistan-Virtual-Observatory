import React, { memo } from 'react';
import '@google/model-viewer';
import styles from './LunarSurfaceViewer.module.css';

const LunarSurfaceViewer = ({ liveData, features = [], onSelectFeature }) => {
  // Phase angle: 0 = New Moon, 90 = First Quarter, 180 = Full Moon, 270 = Third Quarter
  const sunAngle = liveData?.sun_moon_angle ?? 180;
  const rotationY = parseFloat((180 - sunAngle).toFixed(1));

  return (
    <div className={styles.wrapper}>
      <model-viewer
        src="/assets/moon.glb"
        alt="3D model of the Moon"
        camera-controls
        exposure="1"
        shadow-intensity="1"
        orientation={`0 ${rotationY}deg 0`}
        camera-orbit={`${rotationY}deg 90deg auto`}
        class={styles.viewer}
      >
        {features.map((f) => (
          f.modelPosition && f.modelNormal ? (
            <button
              key={f.id}
              slot={`hotspot-${f.id}`}
              data-position={f.modelPosition}
              data-normal={f.modelNormal}
              className={styles.hotspot}
              onClick={() => onSelectFeature(f.id)}
            />
          ) : null
        ))}
      </model-viewer>
    </div>
  );
};

export default memo(LunarSurfaceViewer);
