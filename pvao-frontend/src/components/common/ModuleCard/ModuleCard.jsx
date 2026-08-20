/**
 * UI card component for displaying and linking to a specific observatory module.
 * Props: name, description, linkTo, bgImage.
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import styles from './ModuleCard.module.css';

const FALLBACK_IMG = 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg'; 

const ModuleCard = ({ name, description, linkTo, bgImage, isExternal }) => {
  const [currentBg, setCurrentBg] = useState(bgImage);

  const handleImageError = () => {
    setCurrentBg(FALLBACK_IMG);
  };

  const cardInner = (
    <>
      <img src={currentBg} style={{ display: 'none' }} onError={handleImageError} alt="" />
      
      <div className={styles.overlayGradient}></div>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{name}</h3>
            <div className={styles.arrowIcon}>
              <ArrowRightOutlined />
            </div>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </>
  );

  const isExt = isExternal || (typeof linkTo === 'string' && (linkTo.startsWith('http://') || linkTo.startsWith('https://')));

  if (isExt) {
    return (
      <a
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.moduleCard}
        style={{ backgroundImage: `url(${currentBg})` }}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <NavLink to={linkTo} className={styles.moduleCard} style={{ backgroundImage: `url(${currentBg})` }}>
      {cardInner}
    </NavLink>
  );
};

export default ModuleCard;
