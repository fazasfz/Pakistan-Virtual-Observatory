import React from 'react';
import styles from './MoonRightNowGrid.module.css';
import SectionHeading from '../../../../components/common/SectionHeading/SectionHeading';

const MoonRightNowGrid = ({ setViewMode }) => {
    const cards = [
        { key: 'Snapshot', title: 'Current Phase Snapshot', description: "Today's real illuminated shape" },
        { key: 'Terrain', title: 'Terrain Map', description: 'Elevation & Topography' },
        { key: 'Geographic', title: 'Geologic Map', description: 'Lunar surface composition' },
        { key: 'Shade', title: 'Shaded Relief', description: 'Sun-angle shadows' },
    ];

    const handleCardClick = (mode) => {
        setViewMode(mode);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className={styles.gallerySection}>
            <SectionHeading>The Moon Right Now</SectionHeading>
            <div className={styles.galleryGrid}>
                {cards.map((card) => (
                    <div
                        key={card.key}
                        className={styles.imageCard}
                        onClick={() => handleCardClick(card.key)}
                    >
                        <div className={styles.imagePlaceholder}>
                            {card.title}
                        </div>
                        <span className={styles.imageCaption}>{card.description}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MoonRightNowGrid;
