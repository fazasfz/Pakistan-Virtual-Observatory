import React, { useState, useEffect } from 'react';
import styles from '../SolarObservatory.module.css';

const CORONAL_MEDIA = [
    {
        id: 'coronal-hole',
        title: 'Coronal Holes',
        subtitle: 'SDO AIA 193 Å',
        url: 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg',
    },
    {
        id: 'ccor-1',
        title: 'CME Watch (SUVI 304)',
        subtitle: 'GOES SUVI 304 Å',
        url: 'https://services.swpc.noaa.gov/images/animations/suvi/primary/304/latest.png',
    },
    {
        id: 'ccor-2',
        title: 'CME Watch (SUVI 195)',
        subtitle: 'GOES SUVI 195 Å',
        url: 'https://services.swpc.noaa.gov/images/animations/suvi/primary/195/latest.png',
    },
    {
        id: 'lasco-c2',
        title: 'CME Watch (LASCO C2)',
        subtitle: 'SOHO LASCO C2',
        url: 'https://soho.nascom.nasa.gov/data/realtime/c2/1024/latest.jpg',
    },
    {
        id: 'lasco-c3',
        title: 'CME Watch (LASCO C3)',
        subtitle: 'SOHO LASCO C3',
        url: 'https://soho.nascom.nasa.gov/data/realtime/c3/1024/latest.jpg',
    },
];

export default function CoronalEvents() {
    const [activeMedia, setActiveMedia] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setActiveMedia(null);
        };
        if (activeMedia) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeMedia]);

    return (
        <section className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>
                Coronal Holes & Coronal Mass Ejections
            </h2>
            <div className={styles.singleContainerCard}>
                <div className={styles.coronalGrid}>
                    {CORONAL_MEDIA.map((item) => (
                        <div key={item.id} className={styles.coronalCard}>
                            <div
                                className={styles.imageClickWrapper}
                                onClick={() => setActiveMedia(item)}
                            >
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className={styles.solarImage}
                                />
                            </div>
                            <p className={styles.imageCaption}>{item.title}</p>
                            <span className={styles.imageSubCaption}>{item.subtitle}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {activeMedia && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setActiveMedia(null)}
                >
                    <div
                        className={styles.modalCard}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={() => setActiveMedia(null)}
                        >
                            &#10005;
                        </button>
                        <img
                            src={activeMedia.url}
                            alt={activeMedia.title}
                            className={styles.modalImage}
                        />
                        <p className={styles.modalCaption}>{activeMedia.title}</p>
                        <span className={styles.modalSubtext}>{activeMedia.subtitle}</span>
                    </div>
                </div>
            )}
        </section>
    );
}