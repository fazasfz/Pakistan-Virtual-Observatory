import '@google/model-viewer';
import styles from './LunarSurfaceViewer.module.css';

export default function LunarSurfaceViewer({ features = [], onSelectFeature }) {
  return (
    <div className={styles.wrapper}>
      <model-viewer
        src="/assets/moon.glb"
        alt="3D model of the Moon"
        camera-controls
        auto-rotate
        auto-rotate-delay="3000"
        rotation-per-second="8deg"
        exposure="1"
        shadow-intensity="1"
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
}
