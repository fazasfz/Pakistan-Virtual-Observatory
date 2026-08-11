import React from 'react';
import styles from '../SolarObservatory.module.css';

export const InteractiveSun = ({ telemetry, loading }) => {
    const embedUrl =
        'https://sketchfab.com/models/4cc0061b574941c4b6e77858a3d6acc7/embed?autostart=1&internal=1&ui_animation=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0';

    return (
        <div className={styles.solarStage}>
            <div className={styles.sketchfabWrapper}>
                <iframe
                    title="Star/Celestial object/Sun"
                    className={styles.sketchfabIframe}
                    src={embedUrl}
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    execution-while-out-of-viewport="true"
                    execution-while-not-rendered="true"
                    web-share="true"
                />
            </div>

            <div className={styles.timestampBadge}>
                LIVE OBSERVED TIME (PKT):{' '}
                {loading ? 'FETCHING...' : telemetry?.timestamp_pkt || 'N/A'}
            </div>
        </div>
    );
};

export default InteractiveSun;